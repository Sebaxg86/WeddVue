import type { FormEvent } from 'react'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

type CreateEventPanelProps = {
  eventCount: number
  eventDate: string
  eventTitle: string
  isCreating: boolean
  onCreateEvent: () => Promise<void>
  onEventDateChange: (value: string) => void
  onEventTitleChange: (value: string) => void
  onSignOut: () => Promise<void>
  ownerEmail: string
  statusMessage: StatusMessage | null
}

export function CreateEventPanel({
  eventCount,
  eventDate,
  eventTitle,
  isCreating,
  onCreateEvent,
  onEventDateChange,
  onEventTitleChange,
  onSignOut,
  ownerEmail,
  statusMessage,
}: CreateEventPanelProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateEvent()
  }

  return (
    <article className="panel panel--highlight dashboard-hero">
      <div className="dashboard-hero__header">
        <div>
          <p className="eyebrow">Tu espacio privado</p>
          <h1 className="page-title dashboard-hero__title">
            Crea eventos y administra cada mesa desde un solo lugar.
          </h1>
          <p className="page-lead dashboard-hero__lead">
            Sesion activa con {ownerEmail}. Cada evento que crees quedara ligado a
            tu cuenta para que despues puedas configurar QR, revisar cargas y
            mantener todo ordenado.
          </p>
        </div>

        <button className="button button--secondary" onClick={onSignOut} type="button">
          Cerrar sesion
        </button>
      </div>

      <div className="metric-grid dashboard-hero__metrics">
        <div className="metric-card">
          <span className="metric-label">Eventos creados</span>
          <strong className="metric-value">{eventCount}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Flujo invitados</span>
          <strong className="metric-value">Solo via QR</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Bucket privado</span>
          <strong className="metric-value">fotos-boda</strong>
        </div>
      </div>

      <form className="admin-setup__form" onSubmit={handleSubmit}>
        <div className="field-group admin-setup__field">
          <label className="field-label" htmlFor="event-title">
            Nombre del evento
          </label>
          <input
            className="text-input"
            id="event-title"
            onChange={(event) => onEventTitleChange(event.target.value)}
            placeholder="Ejemplo: Boda de Fer y Diego"
            type="text"
            value={eventTitle}
          />
        </div>

        <div className="field-group admin-setup__field">
          <label className="field-label" htmlFor="event-date">
            Fecha del evento
          </label>
          <input
            className="text-input"
            id="event-date"
            onChange={(event) => onEventDateChange(event.target.value)}
            type="date"
            value={eventDate}
          />
        </div>

        <button className="button" disabled={isCreating} type="submit">
          {isCreating ? 'Creando evento...' : 'Crear evento'}
        </button>
      </form>

      <p className="helper-copy">
        Despues de crearlo entraras directo al workspace del evento para generar
        mesas y QR.
      </p>

      {statusMessage ? (
        <p
          className={
            statusMessage.tone === 'error'
              ? 'notice-banner notice-banner--error'
              : 'notice-banner notice-banner--success'
          }
        >
          {statusMessage.text}
        </p>
      ) : null}
    </article>
  )
}
