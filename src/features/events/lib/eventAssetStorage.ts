import imageCompression from 'browser-image-compression'

import { supabase } from '@/lib/supabase/client'

export const EVENT_COVER_BUCKET = 'event-assets-private'
export const EVENT_GUEST_BUCKET = 'event-assets-public'

export type EventAssetKind = 'cover' | 'guest'

type UploadEventAssetParams = {
  eventId: string
  file: File
  kind: EventAssetKind
  ownerUserId: string
}

function getEventAssetBucket(kind: EventAssetKind) {
  return kind === 'cover' ? EVENT_COVER_BUCKET : EVENT_GUEST_BUCKET
}

function getEventAssetFolder(kind: EventAssetKind) {
  return kind === 'cover' ? 'cover' : 'guest'
}

function sanitizeFileSegment(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getFileExtension(fileName: string, mimeType: string) {
  const normalizedFileName = fileName.trim().toLowerCase()
  const dotIndex = normalizedFileName.lastIndexOf('.')

  if (dotIndex >= 0 && dotIndex < normalizedFileName.length - 1) {
    return normalizedFileName.slice(dotIndex + 1)
  }

  const mimeExtension = mimeType.split('/')[1] ?? 'jpg'
  return mimeExtension.replace('jpeg', 'jpg')
}

async function compressEventAssetFile(file: File) {
  if (!file.type.startsWith('image/')) {
    return file
  }

  try {
    return await imageCompression(file, {
      initialQuality: 0.86,
      maxSizeMB: 4,
      maxWidthOrHeight: 2800,
      preserveExif: false,
      useWebWorker: true,
    })
  } catch {
    return file
  }
}

export function getPublicEventGuestImageUrl(path: string | null) {
  if (!supabase || !path) {
    return null
  }

  return supabase.storage.from(EVENT_GUEST_BUCKET).getPublicUrl(path).data.publicUrl
}

export async function createEventCoverUrl(path: string | null) {
  if (!supabase || !path) {
    return null
  }

  const { data, error } = await supabase.storage
    .from(EVENT_COVER_BUCKET)
    .createSignedUrl(path, 60 * 60 * 6)

  if (error) {
    return null
  }

  return data.signedUrl
}

export async function createEventCoverUrlMap(paths: string[]) {
  if (!supabase || paths.length === 0) {
    return new Map<string, string | null>()
  }

  const uniquePaths = Array.from(new Set(paths.filter(Boolean)))

  if (uniquePaths.length === 0) {
    return new Map<string, string | null>()
  }

  const { data, error } = await supabase.storage
    .from(EVENT_COVER_BUCKET)
    .createSignedUrls(uniquePaths, 60 * 60 * 6)

  if (error) {
    return new Map<string, string | null>()
  }

  const nextMap = new Map<string, string | null>()
  data?.forEach((row, index) => {
    const path = uniquePaths[index]

    if (!path) {
      return
    }

    nextMap.set(path, row?.signedUrl ?? null)
  })

  return nextMap
}

export async function uploadEventAsset({
  eventId,
  file,
  kind,
  ownerUserId,
}: UploadEventAssetParams) {
  if (!supabase) {
    throw new Error('Falta la configuracion publica de Supabase.')
  }

  const preparedFile = await compressEventAssetFile(file)
  const safeBaseName =
    sanitizeFileSegment(file.name.replace(/\.[^.]+$/, '')) || 'imagen-evento'
  const extension = getFileExtension(file.name, preparedFile.type || file.type)
  const path = `${ownerUserId}/${eventId}/${getEventAssetFolder(kind)}/${safeBaseName}-${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(getEventAssetBucket(kind))
    .upload(path, preparedFile, {
      cacheControl: '3600',
      contentType: preparedFile.type || file.type || 'image/jpeg',
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  return { path }
}

export async function removeEventAsset(kind: EventAssetKind, path: string | null) {
  if (!supabase || !path) {
    return
  }

  await supabase.storage.from(getEventAssetBucket(kind)).remove([path])
}
