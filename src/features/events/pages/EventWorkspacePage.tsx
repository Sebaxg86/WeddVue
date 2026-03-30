import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { EventGalleryLightbox } from '@/features/events/components/EventGalleryLightbox'
import { EventImageField } from '@/features/events/components/EventImageField'
import { EventPhotoCard } from '@/features/events/components/EventPhotoCard'
import { TableQrCard } from '@/features/events/components/TableQrCard'
import {
  createEventCoverUrl,
  getPublicEventGuestImageUrl,
  removeEventAsset,
  uploadEventAsset,
  type EventAssetKind,
} from '@/features/events/lib/eventAssetStorage'
import type {
  AccountEvent,
  EventPhotoRecord,
  TableQrRecord,
} from '@/features/events/lib/eventTypes'
import { generateQrToken } from '@/features/events/lib/generateQrToken'
import { hasSupabaseConfig } from '@/lib/config/env'
import { supabase } from '@/lib/supabase/client'
import {
  isAccountSession,
  useSupabaseSession,
} from '@/lib/supabase/useSupabaseSession'
import { PrivateEditorialLayout } from '@/shared/layouts/PrivateEditorialLayout'

const STORAGE_BUCKET = 'fotos-boda'
const WORKSPACE_STATUS_STORAGE_KEY = 'weddvue_workspace_status'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

type WorkspaceTab = 'gallery' | 'settings' | 'tables'
type GalleryViewMode = 'editorial' | 'mosaic'
type ZipScope = 'favorites' | 'selected' | 'visible'

type GalleryCategory = {
  count: number
  id: string
  label: string
}

type RawWorkspacePhoto = {
  batch_id: string
  captured_at: string | null
  created_at: string
  file_extension: string | null
  file_size_bytes: number
  height: number | null
  id: string
  is_favorite: boolean
  mime_type: string
  original_filename: string | null
  status: string
  storage_bucket: string
  storage_path: string
  upload_batches:
    | {
        guest_name: string
        qr_codes:
          | {
              guest_group_name: string | null
              table_label: string
              table_number: number | null
            }
          | {
              guest_group_name: string | null
              table_label: string
              table_number: number | null
            }[]
          | null
      }
    | {
        guest_name: string
        qr_codes:
          | {
              guest_group_name: string | null
              table_label: string
              table_number: number | null
            }
          | {
              guest_group_name: string | null
              table_label: string
              table_number: number | null
            }[]
          | null
      }[]
    | null
  width: number | null
}

type WorkspaceData = {
  errorMessage: string | null
  event: AccountEvent | null
  photos: EventPhotoRecord[]
  tables: TableQrRecord[]
}

function getSingleRelation<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

async function buildPhotoRecords(rawPhotos: RawWorkspacePhoto[]) {
  if (!supabase || rawPhotos.length === 0) {
    return [] as EventPhotoRecord[]
  }

  const { data: signedRows } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrls(
      rawPhotos.map((photo) => photo.storage_path),
      60 * 60 * 6,
    )

  const signedUrlMap = new Map<string, string | null>()

  signedRows?.forEach((row, index) => {
    const path = rawPhotos[index]?.storage_path

    if (!path) {
      return
    }

    signedUrlMap.set(path, row?.signedUrl ?? null)
  })

  return rawPhotos.map((photo) => {
    const batch = getSingleRelation(photo.upload_batches)
    const qrCode = getSingleRelation(batch?.qr_codes)

    return {
      batch_id: photo.batch_id,
      captured_at: photo.captured_at,
      created_at: photo.created_at,
      file_extension: photo.file_extension,
      file_size_bytes: photo.file_size_bytes,
      guest_group_name: qrCode?.guest_group_name ?? null,
      guest_name: batch?.guest_name ?? 'Invitado',
      height: photo.height,
      id: photo.id,
      is_favorite: photo.is_favorite,
      mime_type: photo.mime_type,
      original_filename: photo.original_filename,
      signed_url: signedUrlMap.get(photo.storage_path) ?? null,
      status: photo.status,
      storage_bucket: photo.storage_bucket,
      storage_path: photo.storage_path,
      table_label: qrCode?.table_label ?? 'Mesa',
      table_number: qrCode?.table_number ?? null,
      width: photo.width,
    }
  })
}

async function hydrateEventRecord(event: AccountEvent) {
  const [coverImageUrl] = await Promise.all([createEventCoverUrl(event.cover_image_path)])

  return {
    ...event,
    cover_image_url: coverImageUrl,
    guest_upload_image_url: getPublicEventGuestImageUrl(event.guest_upload_image_path),
  }
}

async function fetchWorkspaceData(eventId: string): Promise<WorkspaceData> {
  if (!supabase || !eventId) {
    return {
      errorMessage: 'No encontramos un evento valido para cargar.',
      event: null,
      photos: [],
      tables: [],
    }
  }

  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select(
      'id, slug, title, event_date, is_active, owner_user_id, created_at, cover_image_path, guest_upload_image_path',
    )
    .eq('id', eventId)
    .maybeSingle()

  if (eventError) {
    return {
      errorMessage: eventError.message,
      event: null,
      photos: [],
      tables: [],
    }
  }

  if (!eventData) {
    return {
      errorMessage: 'No encontramos ese evento o no tienes permiso para verlo.',
      event: null,
      photos: [],
      tables: [],
    }
  }

  const hydratedEvent = await hydrateEventRecord(eventData as AccountEvent)

  const { data: qrCodes, error: qrCodesError } = await supabase
    .from('qr_codes')
    .select(
      'id, event_id, table_number, table_label, guest_group_name, token, is_active, scan_count, last_scanned_at',
    )
    .eq('event_id', eventId)
    .order('table_number', { ascending: true })

  if (qrCodesError) {
    return {
      errorMessage: qrCodesError.message,
      event: hydratedEvent,
      photos: [],
      tables: [],
    }
  }

  const { data: photoRows, error: photosError } = await supabase
    .from('photos')
    .select(
      `
        id,
        batch_id,
        storage_bucket,
        storage_path,
        original_filename,
        mime_type,
        file_extension,
        file_size_bytes,
        width,
        height,
        captured_at,
        status,
        is_favorite,
        created_at,
        upload_batches!inner(
          guest_name,
          event_id,
          qr_codes!inner(
            table_number,
            table_label,
            guest_group_name
          )
        )
      `,
    )
    .eq('upload_batches.event_id', eventId)
    .order('created_at', { ascending: false })

  if (photosError) {
    return {
      errorMessage: photosError.message,
      event: hydratedEvent,
      photos: [],
      tables: (qrCodes ?? []) as TableQrRecord[],
    }
  }

  const photos = await buildPhotoRecords((photoRows ?? []) as RawWorkspacePhoto[])

  return {
    errorMessage: null,
    event: hydratedEvent,
    photos,
    tables: (qrCodes ?? []) as TableQrRecord[],
  }
}

function formatEventDate(eventDate: string | null) {
  if (!eventDate) {
    return 'Fecha por definir'
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${eventDate}T00:00:00`))
}

function buildDownloadFileName(photo: EventPhotoRecord) {
  if (photo.original_filename?.trim()) {
    return photo.original_filename
  }

  const extension = photo.file_extension || 'jpg'
  return `weddvue-${photo.id}.${extension}`
}

function sanitizeDownloadSegment(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildZipFileName(eventTitle: string, scope: ZipScope) {
  const scopeLabel =
    scope === 'selected' ? 'seleccionadas' : scope === 'favorites' ? 'favoritas' : 'visibles'

  return `weddvue-${sanitizeDownloadSegment(eventTitle)}-${scopeLabel}.zip`
}

function buildUniqueZipEntryPath(photo: EventPhotoRecord, usedNames: Map<string, number>) {
  const folderName = sanitizeDownloadSegment(photo.guest_group_name || photo.table_label || 'mesa')
  const originalName = buildDownloadFileName(photo)
  const dotIndex = originalName.lastIndexOf('.')
  const baseName = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName
  const extension = dotIndex > 0 ? originalName.slice(dotIndex) : ''
  const nameKey = `${folderName}/${originalName}`.toLowerCase()
  const seenCount = usedNames.get(nameKey) ?? 0
  usedNames.set(nameKey, seenCount + 1)
  const safeName =
    seenCount === 0 ? originalName : `${baseName}-${seenCount + 1}${extension}`

  return `${folderName}/${safeName}`
}

export function EventWorkspacePage() {
  const navigate = useNavigate()
  const { eventId = '' } = useParams()
  const { isLoading, session } = useSupabaseSession()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('tables')
  const [activeGalleryCategory, setActiveGalleryCategory] = useState('all')
  const [galleryViewMode, setGalleryViewMode] = useState<GalleryViewMode>('editorial')
  const [event, setEvent] = useState<AccountEvent | null>(null)
  const [editableEventDate, setEditableEventDate] = useState('')
  const [editableEventTitle, setEditableEventTitle] = useState('')
  const [photos, setPhotos] = useState<EventPhotoRecord[]>([])
  const [tables, setTables] = useState<TableQrRecord[]>([])
  const [tableQuery, setTableQuery] = useState('')
  const deferredTableQuery = useDeferredValue(tableQuery.trim().toLowerCase())
  const [targetTableCount, setTargetTableCount] = useState('20')
  const [isBootstrapping, setIsBootstrapping] = useState(false)
  const [isGeneratingTables, setIsGeneratingTables] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])
  const [lightboxPhotoId, setLightboxPhotoId] = useState<string | null>(null)
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null)
  const [busyTableId, setBusyTableId] = useState<string | null>(null)
  const [busyEventAssetKind, setBusyEventAssetKind] = useState<EventAssetKind | null>(null)
  const [isSavingEventDetails, setIsSavingEventDetails] = useState(false)
  const [pendingCoverImageFile, setPendingCoverImageFile] = useState<File | null>(null)
  const [pendingGuestImageFile, setPendingGuestImageFile] = useState<File | null>(null)
  const [bulkDownloadScope, setBulkDownloadScope] = useState<ZipScope | null>(null)
  const [isBulkFavoriteBusy, setIsBulkFavoriteBusy] = useState(false)
  const [selectionFavoriteFeedback, setSelectionFavoriteFeedback] = useState<
    'added' | 'removed' | null
  >(null)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const accountSession = isAccountSession(session) ? session : null

  useEffect(() => {
    if (typeof window === 'undefined' || !eventId) {
      return
    }

    const rawValue = window.sessionStorage.getItem(WORKSPACE_STATUS_STORAGE_KEY)

    if (!rawValue) {
      return
    }

    try {
      const parsedValue = JSON.parse(rawValue) as {
        eventId?: string
        text?: string
        tone?: StatusMessage['tone']
      }

      if (parsedValue.eventId !== eventId || !parsedValue.text || !parsedValue.tone) {
        return
      }

      setStatusMessage({
        text: parsedValue.text,
        tone: parsedValue.tone,
      })
      window.sessionStorage.removeItem(WORKSPACE_STATUS_STORAGE_KEY)
    } catch {
      window.sessionStorage.removeItem(WORKSPACE_STATUS_STORAGE_KEY)
    }
  }, [eventId])

  useEffect(() => {
    if (!accountSession) {
      return
    }

    let isMounted = true

    void (async () => {
      setIsBootstrapping(true)

      const workspace = await fetchWorkspaceData(eventId)

      if (!isMounted) {
        return
      }

      setEvent(workspace.event)
      setPhotos(workspace.photos)
      setTables(workspace.tables)
      setStatusMessage((current) =>
        workspace.errorMessage
          ? { text: workspace.errorMessage, tone: 'error' }
          : current?.tone === 'success'
            ? current
            : null,
      )

      if (workspace.tables.length > 0) {
        setTargetTableCount(String(workspace.tables.length))
      }

      setIsBootstrapping(false)
    })()

    return () => {
      isMounted = false
    }
  }, [accountSession, eventId])

  useEffect(() => {
    if (activeTab === 'gallery') {
      setStatusMessage((current) =>
        current?.tone === 'success' && current.text.includes('mesa') ? null : current,
      )
      return
    }

    setLightboxPhotoId(null)
    setSelectedPhotoIds([])
    setIsSelectionMode(false)
  }, [activeTab])

  useEffect(() => {
    if (!selectionFavoriteFeedback) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSelectionFavoriteFeedback(null)
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [selectionFavoriteFeedback])

  useEffect(() => {
    if (!statusMessage || statusMessage.tone !== 'success') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage((current) =>
        current?.tone === 'success' && current.text === statusMessage.text ? null : current,
      )
    }, 4200)

    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  const baseUploadUrl =
    typeof window === 'undefined' ? '/upload' : `${window.location.origin}/upload`

  const visibleTables = tables.filter((table) => {
    if (deferredTableQuery.length === 0) {
      return true
    }

    return [String(table.table_number), table.table_label, table.guest_group_name ?? ''].some(
      (value) => value.toLowerCase().includes(deferredTableQuery),
    )
  })

  const totalScans = tables.reduce((sum, table) => sum + table.scan_count, 0)

  const galleryCategories = useMemo(() => {
    const categories: GalleryCategory[] = [
      { count: photos.length, id: 'all', label: 'Todas' },
      {
        count: photos.filter((photo) => photo.is_favorite).length,
        id: 'favorites',
        label: 'Favoritas',
      },
    ]

    const tableMap = new Map<string, GalleryCategory>()

    photos.forEach((photo) => {
      const categoryId = `table:${photo.table_number ?? photo.table_label}`
      const currentCategory = tableMap.get(categoryId)

      if (currentCategory) {
        currentCategory.count += 1
        return
      }

      tableMap.set(categoryId, {
        count: 1,
        id: categoryId,
        label: photo.guest_group_name || photo.table_label,
      })
    })

    return [
      ...categories,
      ...Array.from(tableMap.values()).sort((left, right) =>
        left.label.localeCompare(right.label, 'es-MX'),
      ),
    ]
  }, [photos])

  useEffect(() => {
    if (!galleryCategories.some((category) => category.id === activeGalleryCategory)) {
      setActiveGalleryCategory('all')
    }
  }, [activeGalleryCategory, galleryCategories])

  const visiblePhotos = useMemo(() => {
    if (activeGalleryCategory === 'all') {
      return photos
    }

    if (activeGalleryCategory === 'favorites') {
      return photos.filter((photo) => photo.is_favorite)
    }

    return photos.filter(
      (photo) => `table:${photo.table_number ?? photo.table_label}` === activeGalleryCategory,
    )
  }, [activeGalleryCategory, photos])

  const selectedPhotoIdsSet = useMemo(() => new Set(selectedPhotoIds), [selectedPhotoIds])
  const selectedPhotos = useMemo(
    () => photos.filter((photo) => selectedPhotoIdsSet.has(photo.id)),
    [photos, selectedPhotoIdsSet],
  )
  const favoritePhotos = useMemo(
    () => photos.filter((photo) => photo.is_favorite),
    [photos],
  )
  const activeLightboxIndex = useMemo(
    () =>
      lightboxPhotoId ? visiblePhotos.findIndex((photo) => photo.id === lightboxPhotoId) : -1,
    [lightboxPhotoId, visiblePhotos],
  )
  const activeLightboxPhoto =
    activeLightboxIndex >= 0 ? visiblePhotos[activeLightboxIndex] : null

  useEffect(() => {
    setSelectedPhotoIds((current) =>
      current.filter((photoId) => photos.some((photo) => photo.id === photoId)),
    )
  }, [photos])

  useEffect(() => {
    if (lightboxPhotoId && !visiblePhotos.some((photo) => photo.id === lightboxPhotoId)) {
      setLightboxPhotoId(null)
    }
  }, [lightboxPhotoId, visiblePhotos])

  useEffect(() => {
    setEditableEventTitle(event?.title ?? '')
    setEditableEventDate(event?.event_date ?? '')
  }, [event?.event_date, event?.title])

  async function refreshWorkspace(nextEventId: string) {
    const workspace = await fetchWorkspaceData(nextEventId)
    setEvent(workspace.event)
    setPhotos(workspace.photos)
    setTables(workspace.tables)
    return workspace
  }

  async function handleSelectEventAsset(kind: EventAssetKind, file: File | null) {
    if (!supabase || !accountSession || !event || !file) {
      return
    }

    const previousPath =
      kind === 'cover' ? event.cover_image_path : event.guest_upload_image_path

    if (kind === 'cover') {
      setPendingCoverImageFile(file)
    } else {
      setPendingGuestImageFile(file)
    }

    setBusyEventAssetKind(kind)
    setStatusMessage(null)

    let nextPath: string | null = null

    try {
      const uploadResult = await uploadEventAsset({
        eventId: event.id,
        file,
        kind,
        ownerUserId: accountSession.user.id,
      })

      nextPath = uploadResult.path

      const { error } = await supabase
        .from('events')
        .update(
          kind === 'cover'
            ? { cover_image_path: nextPath }
            : { guest_upload_image_path: nextPath },
        )
        .eq('id', event.id)

      if (error) {
        throw new Error(error.message)
      }

      await removeEventAsset(kind, previousPath)

      const workspace = await refreshWorkspace(event.id)

      setStatusMessage({
        text:
          workspace.errorMessage ??
          (kind === 'cover'
            ? 'La portada del evento ya se actualizo.'
            : 'La imagen para invitados ya se actualizo.'),
        tone: workspace.errorMessage ? 'error' : 'success',
      })
    } catch (error) {
      if (nextPath) {
        await removeEventAsset(kind, nextPath)
      }

      setStatusMessage({
        text:
          error instanceof Error
            ? error.message
            : 'No fue posible actualizar esta imagen del evento.',
        tone: 'error',
      })
    } finally {
      if (kind === 'cover') {
        setPendingCoverImageFile(null)
      } else {
        setPendingGuestImageFile(null)
      }

      setBusyEventAssetKind(null)
    }
  }

  async function handleRemoveEventAsset(kind: EventAssetKind) {
    if (!supabase || !event) {
      return
    }

    const currentPath =
      kind === 'cover' ? event.cover_image_path : event.guest_upload_image_path

    if (!currentPath) {
      return
    }

    setBusyEventAssetKind(kind)
    setStatusMessage(null)

    const { error } = await supabase
      .from('events')
      .update(kind === 'cover' ? { cover_image_path: null } : { guest_upload_image_path: null })
      .eq('id', event.id)

    if (error) {
      setStatusMessage({
        text: error.message,
        tone: 'error',
      })
      setBusyEventAssetKind(null)
      return
    }

    await removeEventAsset(kind, currentPath)

    const workspace = await refreshWorkspace(event.id)

    setStatusMessage({
      text:
        workspace.errorMessage ??
        (kind === 'cover'
          ? 'La portada del evento se retiro correctamente.'
          : 'La imagen para invitados se retiro correctamente.'),
      tone: workspace.errorMessage ? 'error' : 'success',
    })
    setBusyEventAssetKind(null)
  }

  async function handleSaveEventDetails() {
    if (!supabase || !event) {
      return
    }

    const normalizedTitle = editableEventTitle.trim()

    if (!normalizedTitle) {
      setStatusMessage({
        text: 'Escribe un nombre claro para el evento antes de guardar los ajustes.',
        tone: 'error',
      })
      return
    }

    setIsSavingEventDetails(true)
    setStatusMessage(null)

    const { error } = await supabase
      .from('events')
      .update({
        event_date: editableEventDate || null,
        title: normalizedTitle,
      })
      .eq('id', event.id)

    if (error) {
      setStatusMessage({
        text: error.message,
        tone: 'error',
      })
      setIsSavingEventDetails(false)
      return
    }

    const workspace = await refreshWorkspace(event.id)

    setStatusMessage({
      text: workspace.errorMessage ?? 'Los ajustes del evento ya se actualizaron.',
      tone: workspace.errorMessage ? 'error' : 'success',
    })
    setIsSavingEventDetails(false)
  }

  async function createFreshSignedUrlMap(targetPhotos: EventPhotoRecord[]) {
    if (!supabase || targetPhotos.length === 0) {
      return new Map<string, string>()
    }

    const bucketMap = new Map<string, EventPhotoRecord[]>()

    targetPhotos.forEach((photo) => {
      const bucket = photo.storage_bucket || STORAGE_BUCKET
      const currentPhotos = bucketMap.get(bucket) ?? []
      currentPhotos.push(photo)
      bucketMap.set(bucket, currentPhotos)
    })

    const nextUrlMap = new Map<string, string>()

    for (const [bucket, bucketPhotos] of bucketMap.entries()) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrls(
          bucketPhotos.map((photo) => photo.storage_path),
          60 * 60,
        )

      if (error) {
        throw error
      }

      data?.forEach((row, index) => {
        const photo = bucketPhotos[index]

        if (!photo || !row?.signedUrl) {
          return
        }

        nextUrlMap.set(photo.id, row.signedUrl)
      })
    }

    if (nextUrlMap.size > 0) {
      setPhotos((current) =>
        current.map((photo) =>
          nextUrlMap.has(photo.id)
            ? { ...photo, signed_url: nextUrlMap.get(photo.id) ?? photo.signed_url }
            : photo,
        ),
      )
    }

    return nextUrlMap
  }

  async function handleSignOut() {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    startTransition(() => {
      navigate('/', { replace: true })
    })
  }

  async function handleGenerateMissingTables() {
    if (!supabase || !event) {
      return
    }

    const desiredCount = Number(targetTableCount)

    if (!Number.isInteger(desiredCount) || desiredCount <= 0) {
      setStatusMessage({
        text: 'Escribe un numero de mesas valido mayor a cero.',
        tone: 'error',
      })
      return
    }

    setIsGeneratingTables(true)
    setStatusMessage(null)

    const existingNumbers = new Set(tables.map((table) => table.table_number))
    const missingRows = Array.from({ length: desiredCount }, (_, index) => index + 1)
      .filter((tableNumber) => !existingNumbers.has(tableNumber))
      .map((tableNumber) => ({
        event_id: event.id,
        guest_group_name: null,
        is_active: true,
        table_label: `Mesa ${tableNumber}`,
        table_number: tableNumber,
        token: generateQrToken(),
      }))

    if (missingRows.length === 0) {
      setStatusMessage({
        text: 'No hay mesas faltantes. Todo ya esta configurado hasta ese numero.',
        tone: 'success',
      })
      setIsGeneratingTables(false)
      return
    }

    const { error } = await supabase.from('qr_codes').insert(missingRows)

    if (error) {
      setStatusMessage({ text: error.message, tone: 'error' })
      setIsGeneratingTables(false)
      return
    }

    const workspace = await refreshWorkspace(event.id)
    setStatusMessage({
      text: `${missingRows.length} ${
        missingRows.length === 1 ? 'mesa fue creada' : 'mesas fueron creadas'
      } correctamente.`,
      tone: 'success',
    })

    if (workspace.tables.length > 0) {
      setTargetTableCount(String(workspace.tables.length))
    }

    setIsGeneratingTables(false)
  }

  async function handleSaveTable(
    table: TableQrRecord,
    updates: { guest_group_name: string | null; is_active: boolean },
  ) {
    if (!supabase) {
      return
    }

    setBusyTableId(table.id)
    setStatusMessage(null)

    const { error } = await supabase
      .from('qr_codes')
      .update({
        guest_group_name: updates.guest_group_name,
        is_active: updates.is_active,
      })
      .eq('id', table.id)

    if (error) {
      setStatusMessage({ text: error.message, tone: 'error' })
      setBusyTableId(null)
      return
    }

    await refreshWorkspace(eventId)
    setStatusMessage({
      text: `La mesa ${table.table_number} se actualizo correctamente.`,
      tone: 'success',
    })
    setBusyTableId(null)
  }

  async function handleRegenerateToken(table: TableQrRecord) {
    if (!supabase) {
      return
    }

    setBusyTableId(table.id)
    setStatusMessage(null)

    const { error } = await supabase
      .from('qr_codes')
      .update({
        token: generateQrToken(),
      })
      .eq('id', table.id)

    if (error) {
      setStatusMessage({ text: error.message, tone: 'error' })
      setBusyTableId(null)
      return
    }

    await refreshWorkspace(eventId)
    setStatusMessage({
      text: `Se genero un nuevo codigo para la mesa ${table.table_number}.`,
      tone: 'success',
    })
    setBusyTableId(null)
  }

  async function handleToggleFavorite(photo: EventPhotoRecord) {
    if (!supabase) {
      return
    }

    const nextFavoriteValue = !photo.is_favorite
    setBusyPhotoId(photo.id)
    setPhotos((current) =>
      current.map((currentPhoto) =>
        currentPhoto.id === photo.id
          ? { ...currentPhoto, is_favorite: nextFavoriteValue }
          : currentPhoto,
      ),
    )

    const { error } = await supabase
      .from('photos')
      .update({ is_favorite: nextFavoriteValue })
      .eq('id', photo.id)

    if (error) {
      setPhotos((current) =>
        current.map((currentPhoto) =>
          currentPhoto.id === photo.id
            ? { ...currentPhoto, is_favorite: photo.is_favorite }
            : currentPhoto,
        ),
      )
      setStatusMessage({
        text: error.message,
        tone: 'error',
      })
    }

    setBusyPhotoId(null)
  }

  async function handleDownloadPhoto(photo: EventPhotoRecord) {
    if (!supabase) {
      return
    }

    setBusyPhotoId(photo.id)

    try {
      let downloadUrl = photo.signed_url

      if (!downloadUrl) {
        const { data } = await supabase.storage
          .from(photo.storage_bucket || STORAGE_BUCKET)
          .createSignedUrl(photo.storage_path, 60 * 60)

        downloadUrl = data?.signedUrl ?? null

        if (downloadUrl) {
          setPhotos((current) =>
            current.map((currentPhoto) =>
              currentPhoto.id === photo.id
                ? { ...currentPhoto, signed_url: downloadUrl }
                : currentPhoto,
            ),
          )
        }
      }

      if (!downloadUrl) {
        setStatusMessage({
          text: 'No fue posible generar la descarga de esta foto.',
          tone: 'error',
        })
        setBusyPhotoId(null)
        return
      }

      try {
        const response = await fetch(downloadUrl)
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = objectUrl
        link.download = buildDownloadFileName(photo)
        link.click()
        window.URL.revokeObjectURL(objectUrl)
      } catch {
        window.open(downloadUrl, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setBusyPhotoId(null)
    }
  }

  async function handleDownloadZip(scope: ZipScope) {
    if (!event) {
      return
    }

    const targetPhotos =
      scope === 'selected'
        ? selectedPhotos
        : scope === 'favorites'
          ? favoritePhotos
          : visiblePhotos

    if (targetPhotos.length === 0) {
      setStatusMessage({
        text:
          scope === 'selected'
            ? 'Selecciona al menos una foto para preparar el ZIP.'
            : scope === 'favorites'
              ? 'Aun no tienes fotos favoritas para descargar.'
              : 'No hay fotos visibles para descargar en este momento.',
        tone: 'error',
      })
      return
    }

    setBulkDownloadScope(scope)
    setStatusMessage(null)

    try {
      const { default: JSZip } = await import('jszip')
      const signedUrlMap = await createFreshSignedUrlMap(targetPhotos)
      const zip = new JSZip()
      const usedNames = new Map<string, number>()

      for (const photo of targetPhotos) {
        const downloadUrl = signedUrlMap.get(photo.id) ?? photo.signed_url

        if (!downloadUrl) {
          throw new Error('No fue posible preparar todas las fotos seleccionadas.')
        }

        const response = await fetch(downloadUrl)

        if (!response.ok) {
          throw new Error('No fue posible descargar una de las fotos del evento.')
        }

        const fileBuffer = await response.arrayBuffer()
        zip.file(buildUniqueZipEntryPath(photo, usedNames), fileBuffer)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const objectUrl = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = buildZipFileName(event.title, scope)
      link.click()
      window.URL.revokeObjectURL(objectUrl)

      setStatusMessage({
        text: `Tu ZIP con ${targetPhotos.length} foto${
          targetPhotos.length === 1 ? '' : 's'
        } esta listo para descargar.`,
        tone: 'success',
      })
    } catch (error) {
      setStatusMessage({
        text:
          error instanceof Error
            ? error.message
            : 'No fue posible preparar el ZIP de esta galeria.',
        tone: 'error',
      })
    } finally {
      setBulkDownloadScope(null)
    }
  }

  function handleToggleSelectionMode() {
    setIsSelectionMode((current) => {
      if (current) {
        setSelectedPhotoIds([])
        return false
      }

      return true
    })
  }

  function handleTogglePhotoSelection(photoId: string) {
    setIsSelectionMode(true)
    setSelectedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((currentPhotoId) => currentPhotoId !== photoId)
        : [...current, photoId],
    )
  }

  function handleSelectVisiblePhotos() {
    setIsSelectionMode(true)
    setSelectedPhotoIds((current) =>
      Array.from(new Set([...current, ...visiblePhotos.map((photo) => photo.id)])),
    )
  }

  async function handleToggleSelectedFavorites() {
    if (!supabase || selectedPhotos.length === 0) {
      setStatusMessage({
        text: 'Selecciona al menos una foto para marcarla como favorita.',
        tone: 'error',
      })
      return
    }

    const selectedIds = selectedPhotos.map((photo) => photo.id)
    const shouldFavorite = selectedPhotos.some((photo) => !photo.is_favorite)

    setIsBulkFavoriteBusy(true)
    setStatusMessage(null)
    setPhotos((current) =>
      current.map((photo) =>
        selectedIds.includes(photo.id) ? { ...photo, is_favorite: shouldFavorite } : photo,
      ),
    )

    const { error } = await supabase
      .from('photos')
      .update({ is_favorite: shouldFavorite })
      .in('id', selectedIds)

    if (error) {
      setPhotos((current) =>
        current.map((photo) =>
          selectedIds.includes(photo.id)
            ? {
                ...photo,
                is_favorite: !shouldFavorite,
              }
            : photo,
        ),
      )
      setStatusMessage({
        text: error.message,
        tone: 'error',
      })
      setIsBulkFavoriteBusy(false)
      return
    }

    setSelectionFavoriteFeedback(shouldFavorite ? 'added' : 'removed')
    setStatusMessage({
      text: shouldFavorite
        ? `${selectedPhotos.length} foto${
            selectedPhotos.length === 1 ? '' : 's'
          } se guardaron en favoritas.`
        : `${selectedPhotos.length} foto${
            selectedPhotos.length === 1 ? '' : 's'
          } se quitaron de favoritas.`,
      tone: 'success',
    })
    setIsBulkFavoriteBusy(false)
  }

  function handleClearSelection() {
    setSelectedPhotoIds([])
    setIsSelectionMode(false)
  }

  function handleOpenPhoto(photoId: string) {
    setLightboxPhotoId(photoId)
  }

  function handleJumpToPhoto(index: number) {
    const nextPhoto = visiblePhotos[index]

    if (!nextPhoto) {
      return
    }

    setLightboxPhotoId(nextPhoto.id)
  }

  function handlePreviousPhoto() {
    if (activeLightboxIndex < 0 || visiblePhotos.length <= 1) {
      return
    }

    const nextIndex =
      activeLightboxIndex === 0 ? visiblePhotos.length - 1 : activeLightboxIndex - 1

    setLightboxPhotoId(visiblePhotos[nextIndex]?.id ?? null)
  }

  function handleNextPhoto() {
    if (activeLightboxIndex < 0 || visiblePhotos.length <= 1) {
      return
    }

    const nextIndex =
      activeLightboxIndex === visiblePhotos.length - 1 ? 0 : activeLightboxIndex + 1

    setLightboxPhotoId(visiblePhotos[nextIndex]?.id ?? null)
  }

  if (!hasSupabaseConfig) {
    return (
      <PrivateEditorialLayout backLabel="Eventos" backTo="/dashboard">
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Configuracion requerida</p>
          <h1 className="dashboard-studio__status-title">
            Faltan las variables publicas de Supabase.
          </h1>
          <p className="dashboard-studio__status-copy">
            Agrega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>{' '}
            en tu archivo <code>.env</code> antes de usar el detalle del evento.
          </p>
        </article>
      </PrivateEditorialLayout>
    )
  }

  if (isLoading) {
    return (
      <PrivateEditorialLayout backLabel="Eventos" backTo="/dashboard">
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Detalle del evento</p>
          <h1 className="dashboard-studio__status-title">Cargando tu evento...</h1>
        </article>
      </PrivateEditorialLayout>
    )
  }

  if (!accountSession) {
    return <Navigate replace to="/auth" />
  }

  if (isBootstrapping) {
    return (
      <PrivateEditorialLayout
        backLabel="Eventos"
        backTo="/dashboard"
        rightSlot={
          <button
            className="dashboard-studio__header-action dashboard-studio__header-action--session"
            onClick={() => void handleSignOut()}
            type="button"
          >
            Cerrar sesion
          </button>
        }
      >
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Detalle del evento</p>
          <h1 className="dashboard-studio__status-title">Preparando el atelier...</h1>
        </article>
      </PrivateEditorialLayout>
    )
  }

  if (!event) {
    return (
      <PrivateEditorialLayout
        backLabel="Eventos"
        backTo="/dashboard"
        rightSlot={
          <button
            className="dashboard-studio__header-action dashboard-studio__header-action--session"
            onClick={() => void handleSignOut()}
            type="button"
          >
            Cerrar sesion
          </button>
        }
      >
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Evento no disponible</p>
          <h1 className="dashboard-studio__status-title">No encontramos este espacio.</h1>
          <p className="dashboard-studio__status-copy">
            Puede que el evento no exista o que pertenezca a otra cuenta.
          </p>
          {statusMessage ? (
            <p className="event-workspace__message event-workspace__message--error">
              {statusMessage.text}
            </p>
          ) : null}
        </article>
      </PrivateEditorialLayout>
    )
  }

  return (
    <PrivateEditorialLayout
      backLabel="Eventos"
      backTo="/dashboard"
      className="dashboard-studio--event"
      rightSlot={
        <button
          className="dashboard-studio__header-action dashboard-studio__header-action--session"
          onClick={() => void handleSignOut()}
          type="button"
        >
          Cerrar sesion
        </button>
      }
    >
      <section className="event-workspace">
        <section className="event-workspace__hero">
          <span className="editorial-eyebrow">Panel de Control</span>
          <h1 className="event-workspace__title">{event.title}</h1>
          <p className="event-workspace__date">{formatEventDate(event.event_date)}</p>
          <div className="event-workspace__hero-summary">
            <span className="event-workspace__hero-summary-item">
              {tables.length} {tables.length === 1 ? 'mesa' : 'mesas'}
            </span>
            <span aria-hidden="true" className="event-workspace__hero-summary-divider" />
            <span className="event-workspace__hero-summary-item">
              {totalScans} {totalScans === 1 ? 'escaneo' : 'escaneos'}
            </span>
          </div>
        </section>

        <div className="event-workspace__tabs" role="tablist" aria-label="Secciones del evento">
          <button
            aria-selected={activeTab === 'tables'}
            className={
              activeTab === 'tables'
                ? 'event-workspace__tab event-workspace__tab--active'
                : 'event-workspace__tab'
            }
            onClick={() => setActiveTab('tables')}
            role="tab"
            type="button"
          >
            Mesas
          </button>
          <button
            aria-selected={activeTab === 'gallery'}
            className={
              activeTab === 'gallery'
                ? 'event-workspace__tab event-workspace__tab--active'
                : 'event-workspace__tab'
            }
            onClick={() => setActiveTab('gallery')}
            role="tab"
            type="button"
          >
            Galeria privada
          </button>
          <button
            aria-selected={activeTab === 'settings'}
            className={
              activeTab === 'settings'
                ? 'event-workspace__tab event-workspace__tab--active'
                : 'event-workspace__tab'
            }
            onClick={() => setActiveTab('settings')}
            role="tab"
            type="button"
          >
            Ajustes del evento
          </button>
          <span
            aria-hidden="true"
            className={
              activeTab === 'tables'
                ? 'event-workspace__tab-indicator'
                : activeTab === 'gallery'
                  ? 'event-workspace__tab-indicator event-workspace__tab-indicator--gallery'
                  : 'event-workspace__tab-indicator event-workspace__tab-indicator--settings'
            }
          />
        </div>

        {statusMessage ? (
          <p
            className={
              statusMessage.tone === 'error'
                ? 'event-workspace__message event-workspace__message--error'
                : 'event-workspace__message event-workspace__message--success'
            }
          >
            {statusMessage.text}
          </p>
        ) : null}

        {activeTab === 'tables' ? (
          <>
            <section className="event-workspace__setup">
              <div className="event-workspace__setup-copy">
                <p className="event-workspace__setup-kicker">Configuracion rapida</p>
                <h2 className="event-workspace__setup-title">Mesas del evento</h2>
              </div>

              <div className="event-workspace__setup-controls">
                <div className="event-workspace__promo-field">
                  <label className="event-workspace__promo-label" htmlFor="target-table-count">
                    Total
                  </label>
                  <input
                    className="event-workspace__promo-input"
                    id="target-table-count"
                    inputMode="numeric"
                    min="1"
                    onChange={(currentEvent) => setTargetTableCount(currentEvent.target.value)}
                    placeholder="24"
                    type="number"
                    value={targetTableCount}
                  />
                </div>

                <button
                  className="editorial-primary-button editorial-primary-button--compact event-workspace__setup-button"
                  disabled={isGeneratingTables}
                  onClick={() => void handleGenerateMissingTables()}
                  type="button"
                >
                  {isGeneratingTables ? 'Generando...' : 'Generar faltantes'}
                </button>
              </div>
            </section>

            <section className="event-workspace__tables-section">
              <div className="event-workspace__tables-heading">
                <h2 className="event-workspace__section-title">Distribucion de Mesas</h2>
              </div>

              <div className="event-workspace__search">
                <label className="event-workspace__search-label" htmlFor="table-search">
                  Buscar mesa o familia
                </label>
                <div className="event-workspace__search-shell">
                  <svg
                    aria-hidden="true"
                    className="event-workspace__search-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10.5 18a7.5 7.5 0 1 1 5.303-12.803A7.5 7.5 0 0 1 10.5 18Zm0-13.5a6 6 0 1 0 4.243 1.757A5.96 5.96 0 0 0 10.5 4.5Zm7.5 15a.746.746 0 0 1-.53-.22l-3.75-3.75a.75.75 0 1 1 1.06-1.06l3.75 3.75A.75.75 0 0 1 18 19.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    className="event-workspace__search-input"
                    id="table-search"
                    inputMode="search"
                    onChange={(currentEvent) => setTableQuery(currentEvent.target.value)}
                    placeholder="Mesa 12 o Familia Hernandez"
                    type="search"
                    value={tableQuery}
                  />
                  {tableQuery ? (
                    <button
                      aria-label="Limpiar busqueda"
                      className="event-workspace__search-clear"
                      onClick={() => setTableQuery('')}
                      type="button"
                    >
                      &times;
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="event-workspace__table-list">
                {tables.length === 0 ? (
                  <article className="event-workspace__empty-card">
                    <p className="event-workspace__empty-copy">
                      Aun no existen mesas QR. Usa el bloque superior para crear las primeras.
                    </p>
                  </article>
                ) : visibleTables.length === 0 ? (
                  <article className="event-workspace__empty-card">
                    <p className="event-workspace__empty-copy">
                      No encontramos mesas que coincidan con tu busqueda.
                    </p>
                  </article>
                ) : (
                  visibleTables.map((table) => (
                    <TableQrCard
                      baseUploadUrl={baseUploadUrl}
                      isBusy={busyTableId === table.id}
                      key={table.id}
                      onRegenerateToken={handleRegenerateToken}
                      onSave={handleSaveTable}
                      table={table}
                    />
                  ))
                )}
              </div>
            </section>
          </>
        ) : activeTab === 'settings' ? (
          <section className="event-workspace__settings-stack">
            <section className="event-workspace__settings-card">
              <div className="event-workspace__appearance-copy">
                <p className="event-workspace__setup-kicker">Datos del evento</p>
                <h2 className="event-workspace__setup-title">Informacion general</h2>
                <p className="event-workspace__appearance-lead">
                  Ajusta el nombre y la fecha que se muestran en todo el atelier privado.
                </p>
              </div>

              <div className="event-workspace__settings-form">
                <div className="dashboard-studio__field">
                  <label className="dashboard-studio__field-label" htmlFor="event-settings-title">
                    Nombre del evento
                  </label>
                  <input
                    className="dashboard-studio__field-input"
                    id="event-settings-title"
                    onChange={(currentEvent) => setEditableEventTitle(currentEvent.target.value)}
                    placeholder="Ejemplo: Boda de Fer y Diego"
                    type="text"
                    value={editableEventTitle}
                  />
                </div>

                <div className="dashboard-studio__field">
                  <label className="dashboard-studio__field-label" htmlFor="event-settings-date">
                    Fecha del evento
                  </label>
                  <input
                    className="dashboard-studio__field-input"
                    id="event-settings-date"
                    onChange={(currentEvent) => setEditableEventDate(currentEvent.target.value)}
                    type="date"
                    value={editableEventDate}
                  />
                </div>
              </div>

              <div className="event-workspace__settings-actions">
                <button
                  className="editorial-primary-button editorial-primary-button--compact"
                  disabled={isSavingEventDetails}
                  onClick={() => void handleSaveEventDetails()}
                  type="button"
                >
                  {isSavingEventDetails ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </section>

            <section className="event-workspace__appearance">
              <div className="event-workspace__appearance-copy">
                <p className="event-workspace__setup-kicker">Apariencia del evento</p>
                <h2 className="event-workspace__setup-title">Imagenes de marca</h2>
                <p className="event-workspace__appearance-lead">
                  Define la portada privada que veras en tu dashboard y la imagen que recibira
                  a tus invitados al momento de subir sus fotos.
                </p>
              </div>

              <div className="event-workspace__appearance-grid">
                <EventImageField
                  description="Se usa como portada editorial en tu dashboard y dentro del panel privado."
                  disabled={busyEventAssetKind !== null}
                  file={pendingCoverImageFile}
                  helper={
                    busyEventAssetKind === 'cover'
                      ? 'Guardando portada...'
                      : 'Privada. Solo visible para la cuenta duena del evento.'
                  }
                  imageUrl={event.cover_image_url ?? null}
                  label="Portada privada"
                  onClear={() => void handleRemoveEventAsset('cover')}
                  onSelectFile={(file) => void handleSelectEventAsset('cover', file)}
                  placeholderCopy="Selecciona la portada del evento"
                  previewAlt={`Portada del evento ${event.title}`}
                />

                <EventImageField
                  description="Aparece en la experiencia mobile del invitado antes de elegir sus fotos."
                  disabled={busyEventAssetKind !== null}
                  file={pendingGuestImageFile}
                  helper={
                    busyEventAssetKind === 'guest'
                      ? 'Guardando imagen para invitados...'
                      : 'Publica. Pensada para el hero de la pantalla de carga.'
                  }
                  imageUrl={event.guest_upload_image_url ?? null}
                  label="Imagen para invitados"
                  onClear={() => void handleRemoveEventAsset('guest')}
                  onSelectFile={(file) => void handleSelectEventAsset('guest', file)}
                  placeholderCopy="Selecciona la imagen para invitados"
                  previewAlt={`Imagen para invitados del evento ${event.title}`}
                />
              </div>
            </section>
          </section>
        ) : (
          <section
            className={
              isSelectionMode
                ? 'event-workspace__gallery event-workspace__gallery--selecting'
                : 'event-workspace__gallery'
            }
          >
            <div className="event-workspace__gallery-heading">
              <div>
                <h2 className="event-workspace__section-title">Galeria privada</h2>
                <p className="event-workspace__gallery-copy">
                  Revisa, selecciona, descarga y conserva los recuerdos del evento con una
                  experiencia privada de nivel editorial.
                </p>
              </div>

              <div className="event-workspace__gallery-summary">
                <span>{photos.length} fotos</span>
                <span>{favoritePhotos.length} favoritas</span>
              </div>
            </div>

            <div className="event-workspace__gallery-toolbar">
              <div
                className="event-workspace__gallery-view-switch"
                role="tablist"
                aria-label="Modos de vista de la galeria"
              >
                <button
                  aria-selected={galleryViewMode === 'editorial'}
                  className={
                    galleryViewMode === 'editorial'
                      ? 'event-workspace__gallery-view-button event-workspace__gallery-view-button--active'
                      : 'event-workspace__gallery-view-button'
                  }
                  onClick={() => setGalleryViewMode('editorial')}
                  role="tab"
                  type="button"
                >
                  Editorial
                </button>
                <button
                  aria-selected={galleryViewMode === 'mosaic'}
                  className={
                    galleryViewMode === 'mosaic'
                      ? 'event-workspace__gallery-view-button event-workspace__gallery-view-button--active'
                      : 'event-workspace__gallery-view-button'
                  }
                  onClick={() => setGalleryViewMode('mosaic')}
                  role="tab"
                  type="button"
                >
                  Mosaico
                </button>
              </div>

              <div className="event-workspace__gallery-toolbar-actions">
                {!isSelectionMode ? (
                  <button
                    className="event-workspace__gallery-utility-button"
                    onClick={handleToggleSelectionMode}
                    type="button"
                  >
                    Seleccionar varias
                  </button>
                ) : null}
              </div>
            </div>

            <div className="event-workspace__gallery-categories" role="tablist">
              {galleryCategories.map((category) => (
                <button
                  className={
                    category.id === activeGalleryCategory
                      ? 'event-workspace__gallery-category event-workspace__gallery-category--active'
                      : 'event-workspace__gallery-category'
                  }
                  key={category.id}
                  onClick={() => setActiveGalleryCategory(category.id)}
                  type="button"
                >
                  <span>{category.label}</span>
                  <strong>{category.count}</strong>
                </button>
              ))}
            </div>

            {photos.length === 0 ? (
              <article className="event-workspace__empty-card">
                <p className="event-workspace__empty-copy">
                  Aun no hay fotos privadas en este evento.
                </p>
              </article>
            ) : visiblePhotos.length === 0 ? (
              <article className="event-workspace__empty-card">
                <p className="event-workspace__empty-copy">
                  No encontramos fotos dentro de esta categoria.
                </p>
              </article>
            ) : (
              <div
                className={
                  galleryViewMode === 'mosaic'
                    ? 'event-workspace__gallery-grid event-workspace__gallery-grid--mosaic'
                    : 'event-workspace__gallery-grid'
                }
              >
                {visiblePhotos.map((photo) => (
                  <EventPhotoCard
                    isBusy={busyPhotoId === photo.id}
                    isSelected={selectedPhotoIdsSet.has(photo.id)}
                    isSelectionMode={isSelectionMode}
                    key={photo.id}
                    onDownload={handleDownloadPhoto}
                    onOpen={handleOpenPhoto}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleSelection={handleTogglePhotoSelection}
                    photo={photo}
                    viewMode={galleryViewMode}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </section>

      {activeTab === 'gallery' && activeLightboxPhoto ? (
        <EventGalleryLightbox
          activeIndex={activeLightboxIndex}
          isBusy={busyPhotoId === activeLightboxPhoto.id}
          onClose={() => setLightboxPhotoId(null)}
          onDownload={handleDownloadPhoto}
          onJumpTo={handleJumpToPhoto}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
          onToggleFavorite={handleToggleFavorite}
          photo={activeLightboxPhoto}
          photos={visiblePhotos}
        />
      ) : null}

      {activeTab === 'gallery' && isSelectionMode ? (
        <section className="event-workspace__selection-bar" aria-label="Acciones de seleccion">
          <div className="event-workspace__selection-bar-pill">
            <strong>{selectedPhotos.length}</strong>
            <span>{selectedPhotos.length === 1 ? 'foto elegida' : 'fotos elegidas'}</span>
          </div>

          <div className="event-workspace__selection-bar-actions">
            <button
              className="event-workspace__selection-bar-button"
              onClick={handleSelectVisiblePhotos}
              type="button"
            >
              <svg aria-hidden="true" className="event-workspace__selection-bar-icon" viewBox="0 0 24 24">
                <path
                  d="M4 5.25A1.25 1.25 0 0 1 5.25 4h13.5A1.25 1.25 0 0 1 20 5.25v13.5A1.25 1.25 0 0 1 18.75 20H5.25A1.25 1.25 0 0 1 4 18.75V5.25Zm1.5.25v13h13v-13h-13Zm2 2.5h2.5v2.5H7.5V8Zm4.25 0h4.75v1.5h-4.75V8Zm-4.25 4.25h2.5v2.5H7.5v-2.5Zm4.25 0h4.75v1.5h-4.75v-1.5Zm-4.25 4.25h2.5V19H7.5v-2.5Zm4.25 0h4.75V18h-4.75v-1.5Z"
                  fill="currentColor"
                />
              </svg>
              <span>Todo</span>
            </button>

            <button
              className={
                selectionFavoriteFeedback
                  ? 'event-workspace__selection-bar-button event-workspace__selection-bar-button--favorite-feedback'
                  : 'event-workspace__selection-bar-button'
              }
              disabled={isBulkFavoriteBusy || selectedPhotos.length === 0}
              onClick={() => void handleToggleSelectedFavorites()}
              type="button"
            >
              <svg aria-hidden="true" className="event-workspace__selection-bar-icon" viewBox="0 0 24 24">
                <path
                  d="M12 20.25a.74.74 0 0 1-.39-.11c-4.07-2.45-6.61-5.24-7.54-8.31A5.02 5.02 0 0 1 8.9 5.5c1.2 0 2.31.47 3.1 1.29A4.44 4.44 0 0 1 15.1 5.5a5.02 5.02 0 0 1 4.83 6.33c-.93 3.07-3.47 5.86-7.54 8.31a.74.74 0 0 1-.39.11Zm-3.1-13.25a3.52 3.52 0 0 0-3.41 4.4c.77 2.56 2.91 4.95 6.51 7.17 3.6-2.22 5.74-4.61 6.51-7.17A3.52 3.52 0 0 0 15.1 7c-1.04 0-1.99.49-2.6 1.34a.75.75 0 0 1-1.22 0A3.18 3.18 0 0 0 8.9 7Z"
                  fill="currentColor"
                />
              </svg>
              <span>
                {isBulkFavoriteBusy
                  ? 'Guardando'
                  : selectionFavoriteFeedback === 'added'
                    ? 'Guardadas'
                    : selectionFavoriteFeedback === 'removed'
                      ? 'Quitadas'
                      : 'Favoritas'}
              </span>
            </button>

            <button
              className="event-workspace__selection-bar-button event-workspace__selection-bar-button--primary"
              disabled={bulkDownloadScope !== null || selectedPhotos.length === 0}
              onClick={() => void handleDownloadZip('selected')}
              type="button"
            >
              <svg aria-hidden="true" className="event-workspace__selection-bar-icon" viewBox="0 0 24 24">
                <path
                  d="M12 15.25a.74.74 0 0 1-.53-.22l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V4.75a.75.75 0 0 1 1.5 0v7.94l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.74.74 0 0 1-.53.22Zm-6 4.75A2.25 2.25 0 0 1 3.75 17.75v-2a.75.75 0 0 1 1.5 0v2a.75.75 0 0 0 .75.75h12a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 18 20H6Z"
                  fill="currentColor"
                />
              </svg>
              <span>{bulkDownloadScope === 'selected' ? 'ZIP...' : 'Descargar'}</span>
            </button>

            <button
              className="event-workspace__selection-bar-button"
              onClick={handleClearSelection}
              type="button"
            >
              <svg aria-hidden="true" className="event-workspace__selection-bar-icon" viewBox="0 0 24 24">
                <path
                  d="M6.97 6.97a.75.75 0 0 1 1.06 0L12 10.94l3.97-3.97a.75.75 0 1 1 1.06 1.06L13.06 12l3.97 3.97a.75.75 0 1 1-1.06 1.06L12 13.06l-3.97 3.97a.75.75 0 1 1-1.06-1.06L10.94 12 6.97 8.03a.75.75 0 0 1 0-1.06Z"
                  fill="currentColor"
                />
              </svg>
              <span>Cancelar</span>
            </button>
          </div>
        </section>
      ) : null}
    </PrivateEditorialLayout>
  )
}
