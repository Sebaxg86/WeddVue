import type { FormEvent } from 'react'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

type CreateEventPanelProps = {
  eventDate: string
  eventTitle: string
  isCreating: boolean
  onClose: () => void
  onCreateEvent: () => Promise<void>
  onEventDateChange: (value: string) => void
  onEventTitleChange: (value: string) => void
  statusMessage: StatusMessage | null
}

export function CreateEventPanel({
  eventDate,
  eventTitle,
  isCreating,
  onClose,
  onCreateEvent,
  onEventDateChange,
  onEventTitleChange,
  statusMessage,
}: CreateEventPanelProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateEvent()
  }

  return (
    <article className="dashboard-studio__composer">
      <div className="dashboard-studio__composer-header">
        <div>
          <p className="editorial-eyebrow">Nuevo evento</p>
          <h2 className="dashboard-studio__composer-title">
            Abre una nueva celebración
          </h2>
          <p className="dashboard-studio__composer-lead">
            Elige un nombre y, si lo deseas, la fecha. Después podrás entrar a su
            espacio privado para configurar mesas y QR.
          </p>
        </div>

        <button className="editorial-back-link" onClick={onClose} type="button">
          Ocultar
        </button>
      </div>

      <form className="dashboard-studio__composer-form" onSubmit={handleSubmit}>
        <div className="dashboard-studio__field">
          <label className="dashboard-studio__field-label" htmlFor="event-title">
            Nombre del evento
          </label>
          <input
            className="dashboard-studio__field-input"
            id="event-title"
            onChange={(event) => onEventTitleChange(event.target.value)}
            placeholder="Ejemplo: Boda de Fer y Diego"
            type="text"
            value={eventTitle}
          />
        </div>

        <div className="dashboard-studio__field">
          <label className="dashboard-studio__field-label" htmlFor="event-date">
            Fecha del evento
          </label>
          <input
            className="dashboard-studio__field-input"
            id="event-date"
            onChange={(event) => onEventDateChange(event.target.value)}
            type="date"
            value={eventDate}
          />
        </div>

        {statusMessage ? (
          <p
            className={
              statusMessage.tone === 'error'
                ? 'dashboard-studio__message dashboard-studio__message--error'
                : 'dashboard-studio__message dashboard-studio__message--success'
            }
          >
            {statusMessage.text}
          </p>
        ) : null}

        <div className="dashboard-studio__composer-actions">
          <button className="editorial-primary-button editorial-primary-button--compact" disabled={isCreating} type="submit">
            {isCreating ? 'Creando evento...' : 'Crear evento'}
          </button>
        </div>
      </form>
    </article>
  )
}
