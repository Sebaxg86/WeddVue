import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { TableQrCard } from '@/features/events/components/TableQrCard'
import type { AccountEvent, TableQrRecord } from '@/features/events/lib/eventTypes'
import { generateQrToken } from '@/features/events/lib/generateQrToken'
import { hasSupabaseConfig } from '@/lib/config/env'
import { supabase } from '@/lib/supabase/client'
import {
  isAccountSession,
  useSupabaseSession,
} from '@/lib/supabase/useSupabaseSession'
import { PrivateEditorialLayout } from '@/shared/layouts/PrivateEditorialLayout'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

async function fetchWorkspaceData(eventId: string) {
  if (!supabase || !eventId) {
    return {
      errorMessage: 'No encontramos un evento válido para cargar.',
      event: null as AccountEvent | null,
      tables: [] as TableQrRecord[],
    }
  }

  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('id, slug, title, event_date, is_active, owner_user_id, created_at')
    .eq('id', eventId)
    .maybeSingle()

  if (eventError) {
    return {
      errorMessage: eventError.message,
      event: null as AccountEvent | null,
      tables: [] as TableQrRecord[],
    }
  }

  if (!eventData) {
    return {
      errorMessage: 'No encontramos ese evento o no tienes permiso para verlo.',
      event: null as AccountEvent | null,
      tables: [] as TableQrRecord[],
    }
  }

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
      event: eventData as AccountEvent,
      tables: [] as TableQrRecord[],
    }
  }

  return {
    errorMessage: null,
    event: eventData as AccountEvent,
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

export function EventWorkspacePage() {
  const navigate = useNavigate()
  const { eventId = '' } = useParams()
  const { isLoading, session } = useSupabaseSession()
  const [event, setEvent] = useState<AccountEvent | null>(null)
  const [tables, setTables] = useState<TableQrRecord[]>([])
  const [tableQuery, setTableQuery] = useState('')
  const deferredTableQuery = useDeferredValue(tableQuery.trim().toLowerCase())
  const [targetTableCount, setTargetTableCount] = useState('20')
  const [isBootstrapping, setIsBootstrapping] = useState(false)
  const [isGeneratingTables, setIsGeneratingTables] = useState(false)
  const [busyTableId, setBusyTableId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const accountSession = isAccountSession(session) ? session : null

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
      setTables(workspace.tables)
      setStatusMessage(
        workspace.errorMessage ? { text: workspace.errorMessage, tone: 'error' } : null,
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

  async function refreshWorkspace(nextEventId: string) {
    const workspace = await fetchWorkspaceData(nextEventId)
    setEvent(workspace.event)
    setTables(workspace.tables)
    return workspace
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
        text: 'Escribe un número de mesas válido mayor a cero.',
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
        text: 'No hay mesas faltantes. Todo ya está configurado hasta ese número.',
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
      text: `${missingRows.length} ${missingRows.length === 1 ? 'mesa fue creada' : 'mesas fueron creadas'} correctamente.`,
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
      text: `La mesa ${table.table_number} se actualizó correctamente.`,
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
      text: `Se generó un nuevo código para la mesa ${table.table_number}.`,
      tone: 'success',
    })
    setBusyTableId(null)
  }

  if (!hasSupabaseConfig) {
    return (
      <PrivateEditorialLayout backLabel="Volver al dashboard" backTo="/dashboard">
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Configuración requerida</p>
          <h1 className="dashboard-studio__status-title">
            Faltan las variables públicas de Supabase.
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
      <PrivateEditorialLayout backLabel="Volver al dashboard" backTo="/dashboard">
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
        backLabel="Volver al dashboard"
        backTo="/dashboard"
        rightSlot={
          <button className="editorial-back-link" onClick={() => void handleSignOut()} type="button">
            Cerrar sesión
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
        backLabel="Volver al dashboard"
        backTo="/dashboard"
        rightSlot={
          <button className="editorial-back-link" onClick={() => void handleSignOut()} type="button">
            Cerrar sesión
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
  const activeTablesCount = tables.filter((table) => table.is_active).length

  return (
    <PrivateEditorialLayout
      backLabel="Volver al dashboard"
      backTo="/dashboard"
      className="dashboard-studio--event"
      rightSlot={
        <button className="editorial-back-link" onClick={() => void handleSignOut()} type="button">
          Cerrar sesión
        </button>
      }
    >
      <section className="event-workspace">
        <section className="event-workspace__hero">
          <span className="editorial-eyebrow">Panel de Control</span>
          <h1 className="event-workspace__title">{event.title}</h1>
          <p className="event-workspace__date">{formatEventDate(event.event_date)}</p>
        </section>

        <section className="event-workspace__stats">
          <article className="event-workspace__stat-card">
            <p>Mesas</p>
            <strong>{tables.length}</strong>
          </article>
          <article className="event-workspace__stat-card">
            <p>Escaneos</p>
            <strong>{totalScans}</strong>
          </article>
        </section>

        <section className="event-workspace__tables-section">
          <div className="event-workspace__tables-heading">
            <h2 className="event-workspace__section-title">Distribución de Mesas</h2>
            <button
              className="editorial-back-link"
              onClick={() => setTableQuery('')}
              type="button"
            >
              Ver todas
            </button>
          </div>

          <div className="event-workspace__search">
            <label className="event-workspace__search-label" htmlFor="table-search">
              Buscar mesa o familia
            </label>
            <input
              className="event-workspace__search-input"
              id="table-search"
              inputMode="search"
              onChange={(currentEvent) => setTableQuery(currentEvent.target.value)}
              placeholder="Mesa 12 o Familia Hernández"
              type="search"
              value={tableQuery}
            />
          </div>

          <div className="event-workspace__table-list">
            {tables.length === 0 ? (
              <article className="event-workspace__empty-card">
                <p className="event-workspace__empty-copy">
                  Aún no existen mesas QR. Usa el bloque inferior para crear las primeras.
                </p>
              </article>
            ) : visibleTables.length === 0 ? (
              <article className="event-workspace__empty-card">
                <p className="event-workspace__empty-copy">
                  No encontramos mesas que coincidan con tu búsqueda.
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

        <section className="event-workspace__promo">
          <div className="event-workspace__promo-content">
            <h3 className="event-workspace__promo-title">Acceso Instantáneo</h3>
            <p className="event-workspace__promo-copy">
              Crea una experiencia fluida generando los códigos QR para cada mesa.
            </p>

            <div className="event-workspace__promo-field">
              <label className="event-workspace__promo-label" htmlFor="target-table-count">
                Total de mesas
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
              className="editorial-primary-button"
              disabled={isGeneratingTables}
              onClick={() => void handleGenerateMissingTables()}
              type="button"
            >
              {isGeneratingTables ? 'Generando...' : 'Generar Todas'}
            </button>
          </div>

          <div className="event-workspace__promo-pattern" aria-hidden="true" />
        </section>

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

        <section className="event-workspace__summary">
          <article className="event-workspace__summary-card">
            <p>Mesas activas</p>
            <strong>{activeTablesCount}</strong>
          </article>
          <article className="event-workspace__summary-card">
            <p>Visitas al QR</p>
            <strong>{totalScans}</strong>
          </article>
        </section>
      </section>
    </PrivateEditorialLayout>
  )
}
