import { startTransition, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { CreateEventPanel } from '@/features/dashboard/components/CreateEventPanel'
import { EventCard } from '@/features/dashboard/components/EventCard'
import type { EventSummary } from '@/features/events/lib/eventTypes'
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

async function fetchOwnedEvents(userId: string) {
  if (!supabase) {
    return {
      errorMessage: 'Falta la configuracion publica de Supabase.',
      events: [] as EventSummary[],
    }
  }

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, slug, title, event_date, is_active, owner_user_id, created_at, qr_codes(id, is_active)',
    )
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: false })

  return {
    errorMessage: error?.message ?? null,
    events: (data ?? []) as EventSummary[],
  }
}

function buildEventSlug(title: string) {
  const baseSlug =
    title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'evento'

  const suffix = crypto.randomUUID().slice(0, 8)
  return `${baseSlug}-${suffix}`
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { errorMessage: sessionErrorMessage, isLoading, session } = useSupabaseSession()
  const [events, setEvents] = useState<EventSummary[]>([])
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  const accountSession = isAccountSession(session) ? session : null

  useEffect(() => {
    if (!accountSession) {
      return
    }

    let isMounted = true

    void (async () => {
      setIsLoadingEvents(true)

      const { errorMessage, events: ownedEvents } = await fetchOwnedEvents(
        accountSession.user.id,
      )

      if (!isMounted) {
        return
      }

      if (errorMessage) {
        setStatusMessage({ text: errorMessage, tone: 'error' })
        setEvents([])
      } else {
        setEvents(ownedEvents)
      }

      setIsLoadingEvents(false)
    })()

    return () => {
      isMounted = false
    }
  }, [accountSession])

  async function handleCreateEvent() {
    if (!supabase || !accountSession) {
      return
    }

    const normalizedTitle = eventTitle.trim()

    if (!normalizedTitle) {
      setStatusMessage({
        text: 'Escribe un nombre claro para el evento antes de crearlo.',
        tone: 'error',
      })
      return
    }

    setIsCreating(true)
    setStatusMessage(null)

    const { data, error } = await supabase
      .from('events')
      .insert({
        event_date: eventDate || null,
        is_active: true,
        owner_user_id: accountSession.user.id,
        slug: buildEventSlug(normalizedTitle),
        title: normalizedTitle,
      })
      .select('id')
      .single()

    if (error || !data) {
      setStatusMessage({
        text: error?.message ?? 'No fue posible crear el evento.',
        tone: 'error',
      })
      setIsCreating(false)
      return
    }

    setEventTitle('')
    setEventDate('')
    setStatusMessage({
      text: 'Evento creado. Vamos a abrir su workspace.',
      tone: 'success',
    })
    setIsCreating(false)

    startTransition(() => {
      navigate(`/dashboard/events/${data.id}`)
    })
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

  if (!hasSupabaseConfig) {
    return (
      <section className="panel panel--centered">
        <p className="eyebrow">Configuracion requerida</p>
        <h1 className="page-title">Faltan las variables publicas de Supabase.</h1>
        <p className="page-lead">
          Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en tu archivo
          `.env` para habilitar el dashboard.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="panel panel--centered">
        <p className="eyebrow">Dashboard</p>
        <h1 className="page-title">Cargando tu cuenta...</h1>
      </section>
    )
  }

  if (!accountSession) {
    return <Navigate replace to="/auth" />
  }

  return (
    <section className="dashboard-grid">
      <CreateEventPanel
        eventCount={events.length}
        eventDate={eventDate}
        eventTitle={eventTitle}
        isCreating={isCreating}
        onCreateEvent={handleCreateEvent}
        onEventDateChange={setEventDate}
        onEventTitleChange={setEventTitle}
        onSignOut={handleSignOut}
        ownerEmail={accountSession.user.email ?? 'tu cuenta'}
        statusMessage={
          statusMessage ??
          (sessionErrorMessage ? { text: sessionErrorMessage, tone: 'error' } : null)
        }
      />

      <section className="dashboard-events">
        <div className="dashboard-events__header">
          <div>
            <p className="eyebrow">Tus eventos</p>
            <h2 className="panel-title">Abre el evento que quieras configurar.</h2>
            <p className="helper-copy">
              Cada tarjeta te lleva al workspace donde vives la logica de mesas y
              QR.
            </p>
          </div>
        </div>

        {isLoadingEvents ? (
          <article className="panel">
            <p className="panel-subtitle">Cargando tus eventos...</p>
          </article>
        ) : events.length === 0 ? (
          <article className="panel">
            <h2 className="panel-title">Todavia no tienes eventos.</h2>
            <p className="panel-subtitle">
              Crea el primero desde la tarjeta superior y te llevaremos directo al
              panel de configuracion.
            </p>
          </article>
        ) : (
          <div className="event-card-grid">
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
