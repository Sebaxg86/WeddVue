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
import { PrivateEditorialLayout } from '@/shared/layouts/PrivateEditorialLayout'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

const eventVisuals = [
  {
    alt: 'Recepción de boda minimalista al atardecer con mesas largas y luz cálida',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV4houBuNn6q_c0GBsNX3vOs4l3sjvDNPDC2_wEbG74M_kxpIVPHOWkvbaW2S0lQDASeRbs6y4G4_7Uq3zzA9biv9cUMxsXAAgEFdhmKGi0YZ8HuaLdjM2AhFCSHD0TDf0FX0HxwJ_LWj23cM9U0IVUh1-SWrocH66af1bJIIOWRk711NYrYHDS-ZL9gT9sK-nNXsZ3p1VbeVa3q5AmUH49qn6Q7VapfzYsRiqYSoPJUSPTOiOV8d8SQsPuEyRpQUl1VmfZFv_nmg',
  },
  {
    alt: 'Mesa elegante con vajilla fina, cristalería y rosas marfil',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrQKeOiD2GIG0of1wEtLeGV_vjfxgGO0i7SGExWNAwN9WUW-bBrh69vEQdVPyaPnPo7MMDmxxvat4cTe6SluInQvbrCH4J1Qpdm-olhERgHn4xs3Zais2rE3mikpa7wi01OolKPEc2JUH0dLrKl1GLR5u295wpuJToytoIimApIQMZ_6DO5PnfQJL9teJ-vg0kRJgkuX2JJJo-Fz0OYhZzg-JOkTnssZeY_TAkBi8YBiirEc55B3PUh-egnCp2nzNIrEWQjcGSONU',
  },
  {
    alt: 'Arreglo floral editorial con orquídeas blancas y follaje suave',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApdXReMI4tQIVxGTBWT9OMEFrxSdNaVNAoTEnX-WlvC9OwtqyrGcN1ch4Q37NzrT71nzbzXtMXGgzadwBHtSuZo_-N6quP7UJLs1hpZTyrMIlMVcv9-vgxuPpMPeMpaVQ3MyxkFTr9vE5Pzjm5Bl_8cLY67y0LhUDJPuqHzWWOdB4Fwah5iZJ9NFne2FnHmR7PdlM11suxI4MXuR86qAWT4glPejQAWsvpkuYwfNJmIQnKCFfxQrKxgsCV-Ze5pAzLGWDHpn8HWn8',
  },
]

async function fetchOwnedEvents(userId: string) {
  if (!supabase) {
    return {
      errorMessage: 'Falta la configuración pública de Supabase.',
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
  const [isComposerOpen, setIsComposerOpen] = useState(false)
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
      text: 'Evento creado. Vamos a abrir su atelier privado.',
      tone: 'success',
    })
    setIsCreating(false)
    setIsComposerOpen(false)

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
      <PrivateEditorialLayout backLabel="Volver a la landing" backTo="/">
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Configuración requerida</p>
          <h1 className="dashboard-studio__status-title">
            Faltan las variables públicas de Supabase.
          </h1>
          <p className="dashboard-studio__status-copy">
            Agrega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>{' '}
            en tu archivo <code>.env</code> para habilitar el dashboard.
          </p>
        </article>
      </PrivateEditorialLayout>
    )
  }

  if (isLoading) {
    return (
      <PrivateEditorialLayout backLabel="Volver a la landing" backTo="/">
        <article className="dashboard-studio__status-card">
          <p className="editorial-eyebrow">Atelier privado</p>
          <h1 className="dashboard-studio__status-title">Cargando tu cuenta...</h1>
        </article>
      </PrivateEditorialLayout>
    )
  }

  if (!accountSession) {
    return <Navigate replace to="/auth" />
  }

  return (
    <PrivateEditorialLayout
      backLabel="Volver a la landing"
      backTo="/"
      rightSlot={
        <button className="editorial-back-link" onClick={() => void handleSignOut()} type="button">
          Cerrar sesión
        </button>
      }
    >
      <section className="dashboard-studio__hero">
        <div className="dashboard-studio__hero-copy">
          <span className="editorial-eyebrow">Bienvenida a su atelier</span>
          <h1 className="dashboard-studio__title">Un momento para siempre</h1>
        </div>
      </section>

      <section className="dashboard-studio__actions">
        <button
          className="dashboard-studio__create-trigger"
          onClick={() => {
            setIsComposerOpen((current) => !current)
            setStatusMessage(null)
          }}
          type="button"
        >
          <div className="dashboard-studio__create-trigger-icon" aria-hidden="true">
            +
          </div>
          <span className="dashboard-studio__create-trigger-label">Crear Nuevo Evento</span>
        </button>
      </section>

      {isComposerOpen ? (
        <section className="dashboard-studio__composer-wrap">
          <CreateEventPanel
            eventDate={eventDate}
            eventTitle={eventTitle}
            isCreating={isCreating}
            onClose={() => setIsComposerOpen(false)}
            onCreateEvent={handleCreateEvent}
            onEventDateChange={setEventDate}
            onEventTitleChange={setEventTitle}
            statusMessage={
              statusMessage ??
              (sessionErrorMessage ? { text: sessionErrorMessage, tone: 'error' } : null)
            }
          />
        </section>
      ) : sessionErrorMessage || statusMessage ? (
        <section className="dashboard-studio__composer-wrap">
          <p
            className={
              (statusMessage?.tone ?? 'error') === 'error'
                ? 'dashboard-studio__message dashboard-studio__message--error'
                : 'dashboard-studio__message dashboard-studio__message--success'
            }
          >
            {statusMessage?.text ?? sessionErrorMessage}
          </p>
        </section>
      ) : null}

      <div className="dashboard-studio__list-header">
        <h2 className="dashboard-studio__list-title">Sus Próximas Celebraciones</h2>
      </div>

      <section className="dashboard-studio__list">
        {isLoadingEvents ? (
          <article className="dashboard-studio__status-card">
            <p className="dashboard-studio__status-copy">Cargando tus eventos...</p>
          </article>
        ) : events.length === 0 ? (
          <>
            <article className="dashboard-studio__empty-card">
              <p className="dashboard-studio__empty-quote">
                “Toda gran celebración empieza con una intención delicada.”
              </p>
              <span className="dashboard-studio__empty-caption">
                Crea tu primer evento para comenzar.
              </span>
            </article>
            <article className="dashboard-studio__quote-card">
              <p className="dashboard-studio__quote-text">
                “El amor es, sobre todo, la cura a la soledad.”
              </p>
              <span className="dashboard-studio__quote-caption">
                — Fragmento de un sueño
              </span>
            </article>
          </>
        ) : (
          <>
            {events.map((event, index) => {
              const visual = eventVisuals[index % eventVisuals.length]

              return (
                <EventCard
                  event={event}
                  imageAlt={visual.alt}
                  imageUrl={visual.url}
                  key={event.id}
                />
              )
            })}

            <article className="dashboard-studio__quote-card">
              <p className="dashboard-studio__quote-text">
                “El amor es, sobre todo, la cura a la soledad.”
              </p>
              <span className="dashboard-studio__quote-caption">
                — Fragmento de un sueño
              </span>
            </article>
          </>
        )}
      </section>
    </PrivateEditorialLayout>
  )
}
