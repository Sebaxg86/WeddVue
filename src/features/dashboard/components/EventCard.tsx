import { Link } from 'react-router-dom'

import type { EventSummary } from '@/features/events/lib/eventTypes'

type EventCardProps = {
  event: EventSummary
  imageAlt: string
  imageUrl: string
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

export function EventCard({ event, imageAlt, imageUrl }: EventCardProps) {
  return (
    <Link className="dashboard-studio__event-card" to={`/dashboard/events/${event.id}`}>
      <div className="dashboard-studio__event-media">
        <img alt={imageAlt} className="dashboard-studio__event-image" src={imageUrl} />
        <div className="dashboard-studio__event-tint" aria-hidden="true" />
      </div>

      <div className="dashboard-studio__event-copy">
        <h3 className="dashboard-studio__event-title">{event.title}</h3>
        <p className="dashboard-studio__event-date">{formatEventDate(event.event_date)}</p>
      </div>
    </Link>
  )
}
