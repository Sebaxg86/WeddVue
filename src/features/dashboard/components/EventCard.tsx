import { Link } from 'react-router-dom'

import type { EventSummary } from '@/features/events/lib/eventTypes'

type EventCardProps = {
  event: EventSummary
}

function formatEventDate(eventDate: string | null) {
  if (!eventDate) {
    return 'Fecha pendiente'
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${eventDate}T00:00:00`))
}

export function EventCard({ event }: EventCardProps) {
  const totalTables = event.qr_codes?.length ?? 0
  const activeTables =
    event.qr_codes?.filter((table) => table.is_active).length ?? 0

  return (
    <article className="panel event-card">
      <div className="event-card__header">
        <div>
          <p className="eyebrow">Evento</p>
          <h2 className="panel-title">{event.title}</h2>
          <p className="panel-subtitle">
            {formatEventDate(event.event_date)} - slug: {event.slug}
          </p>
        </div>

        <span className={event.is_active ? 'status-pill' : 'status-pill status-pill--soft'}>
          {event.is_active ? 'Activo' : 'Pausado'}
        </span>
      </div>

      <div className="event-card__metrics">
        <div className="info-card">
          <span className="info-label">Mesas</span>
          <strong className="info-value">{totalTables}</strong>
        </div>
        <div className="info-card">
          <span className="info-label">Mesas activas</span>
          <strong className="info-value">{activeTables}</strong>
        </div>
      </div>

      <div className="button-row">
        <Link className="button" to={`/dashboard/events/${event.id}`}>
          Abrir evento
        </Link>
      </div>
    </article>
  )
}
