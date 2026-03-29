import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { EventSetupPanel } from '@/features/events/components/EventSetupPanel'
import { TableQrCard } from '@/features/events/components/TableQrCard'
import type { AccountEvent, TableQrRecord } from '@/features/events/lib/eventTypes'
import { generateQrToken } from '@/features/events/lib/generateQrToken'
import { hasSupabaseConfig } from '@/lib/config/env'
import { supabase } from '@/lib/supabase/client'
import {
  isAccountSession,
  useSupabaseSession,
} from '@/lib/supabase/useSupabaseSession'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

async function fetchWorkspaceData(eventId: string) {
  if (!supabase || !eventId) {
    return {
      errorMessage: 'No encontramos un evento valido para cargar.',
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
        workspace.errorMessage
          ? { text: workspace.errorMessage, tone: 'error' }
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

    const workspace = await fetchWorkspaceData(event.id)
    setEvent(workspace.event)
    setTables(workspace.tables)
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

    const workspace = await fetchWorkspaceData(eventId)
    setEvent(workspace.event)
    setTables(workspace.tables)
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

    const workspace = await fetchWorkspaceData(eventId)
    setEvent(workspace.event)
    setTables(workspace.tables)
    setStatusMessage({
      text: `Se genero un nuevo token para la mesa ${table.table_number}.`,
      tone: 'success',
    })
    setBusyTableId(null)
  }

  if (!hasSupabaseConfig) {
    return (
      <section className="panel panel--centered">
        <p className="eyebrow">Configuracion requerida</p>
        <h1 className="page-title">Faltan las variables publicas de Supabase.</h1>
        <p className="page-lead">
          Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en tu archivo
          `.env` antes de usar el workspace del evento.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="panel panel--centered">
        <p className="eyebrow">Evento</p>
        <h1 className="page-title">Cargando tu evento...</h1>
      </section>
    )
  }

  if (!accountSession) {
    return <Navigate replace to="/auth" />
  }

  if (isBootstrapping) {
    return (
      <section className="panel panel--centered">
        <p className="eyebrow">Evento</p>
        <h1 className="page-title">Preparando el workspace...</h1>
      </section>
    )
  }

  if (!event) {
    return (
      <section className="panel panel--centered">
        <p className="eyebrow">Evento no disponible</p>
        <h1 className="page-title">No encontramos este espacio.</h1>
        <p className="page-lead">
          Puede que el evento no exista o que pertenezca a otra cuenta.
        </p>
        {statusMessage ? (
          <p className="notice-banner notice-banner--error">{statusMessage.text}</p>
        ) : null}
      </section>
    )
  }

  const baseUploadUrl =
    typeof window === 'undefined' ? '/upload' : `${window.location.origin}/upload`
  const visibleTables = tables.filter((table) => {
    if (deferredTableQuery.length === 0) {
      return true
    }

    return [
      String(table.table_number),
      table.table_label,
      table.guest_group_name ?? '',
      table.token,
    ].some((value) => value.toLowerCase().includes(deferredTableQuery))
  })
  const totalScans = tables.reduce((sum, table) => sum + table.scan_count, 0)

  return (
    <section className="admin-dashboard">
      <EventSetupPanel
        activeTablesCount={tables.filter((table) => table.is_active).length}
        event={event}
        isGenerating={isGeneratingTables}
        onDesiredTableCountChange={setTargetTableCount}
        onGenerateMissingTables={handleGenerateMissingTables}
        onSignOut={handleSignOut}
        statusMessage={statusMessage}
        tables={tables}
        targetTableCount={targetTableCount}
        totalScans={totalScans}
      />

      <section className="admin-dashboard__tables">
        <div className="admin-dashboard__tables-header">
          <div className="admin-dashboard__tables-heading">
            <p className="eyebrow">Mesas y QR</p>
            <h2 className="panel-title">Configura cada mesa con claridad.</h2>
            <p className="helper-copy">
              Mostrando {visibleTables.length} de {tables.length} mesas. Puedes
              buscar por numero, familia o token.
            </p>
          </div>

          <div className="field-group admin-dashboard__search">
            <label className="field-label" htmlFor="table-search">
              Buscar una mesa
            </label>
            <input
              className="text-input"
              id="table-search"
              inputMode="search"
              onChange={(event) => setTableQuery(event.target.value)}
              placeholder="Mesa 12 o Familia Hernandez"
              type="search"
              value={tableQuery}
            />
          </div>
        </div>

        {tables.length === 0 ? (
          <article className="panel">
            <p className="panel-subtitle">
              Aun no existen mesas QR. Crea el primer bloque desde la tarjeta del
              evento.
            </p>
          </article>
        ) : visibleTables.length === 0 ? (
          <article className="panel">
            <h2 className="panel-title">No hay mesas que coincidan.</h2>
            <p className="panel-subtitle">
              Prueba con un numero de mesa, un apellido o borra la busqueda para
              volver a ver todas las tarjetas.
            </p>
          </article>
        ) : (
          <div className="admin-dashboard__tables-grid">
            {visibleTables.map((table) => (
              <TableQrCard
                baseUploadUrl={baseUploadUrl}
                isBusy={busyTableId === table.id}
                key={table.id}
                onRegenerateToken={handleRegenerateToken}
                onSave={handleSaveTable}
                table={table}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
