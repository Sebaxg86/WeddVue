import {
  useEffect,
  useId,
  useRef,
  type FormEvent,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'

import { EventImageField } from '@/features/events/components/EventImageField'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

type CreateEventPanelProps = {
  coverImageFile: File | null
  eventDate: string
  eventTitle: string
  guestImageFile: File | null
  isCreating: boolean
  onClose: () => void
  onCoverImageChange: (file: File | null) => void
  onCreateEvent: () => Promise<void>
  onEventDateChange: (value: string) => void
  onEventTitleChange: (value: string) => void
  onGuestImageChange: (file: File | null) => void
  statusMessage: StatusMessage | null
}

export function CreateEventPanel({
  coverImageFile,
  eventDate,
  eventTitle,
  guestImageFile,
  isCreating,
  onClose,
  onCoverImageChange,
  onCreateEvent,
  onEventDateChange,
  onEventTitleChange,
  onGuestImageChange,
  statusMessage,
}: CreateEventPanelProps) {
  const titleId = useId()
  const titleInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      titleInputRef.current?.focus()
    }, 120)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isCreating) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCreating, onClose])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateEvent()
  }

  function handleBackdropInteraction(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (event.target !== event.currentTarget || isCreating) {
      return
    }

    onClose()
  }

  function handleModalSurfaceInteraction(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  const modal = (
    <section
      aria-labelledby={titleId}
      aria-modal="true"
      className="dashboard-studio__modal"
      onClick={handleBackdropInteraction}
      role="dialog"
    >
      <article
        className="dashboard-studio__composer dashboard-studio__composer--modal"
        onClick={handleModalSurfaceInteraction}
      >
        <div className="dashboard-studio__composer-header">
          <div className="dashboard-studio__composer-copy">
            <p className="editorial-eyebrow">Nuevo evento</p>
            <h2 className="dashboard-studio__composer-title" id={titleId}>
              Abre una nueva celebracion
            </h2>
            <p className="dashboard-studio__composer-lead">
              Elige un nombre y fecha. Despues podras entrar a su espacio privado
              para configurar mesas y QR.
            </p>
          </div>

          <button
            aria-label="Cerrar formulario"
            className="dashboard-studio__composer-close"
            disabled={isCreating}
            onClick={onClose}
            type="button"
          >
            &times;
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
              ref={titleInputRef}
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

          <div className="dashboard-studio__image-grid">
            <EventImageField
              description="Se vera como portada privada del evento en tu dashboard."
              disabled={isCreating}
              file={coverImageFile}
              helper="Opcional. Puedes cambiarla despues desde el panel del evento."
              imageUrl={null}
              label="Portada del evento"
              onClear={() => onCoverImageChange(null)}
              onSelectFile={onCoverImageChange}
              placeholderCopy="Selecciona la imagen principal del evento"
              previewAlt="Vista previa de la portada del evento"
            />

            <EventImageField
              description="Se mostrara a tus invitados en la pantalla donde cargan sus fotos."
              disabled={isCreating}
              file={guestImageFile}
              helper="Opcional. Ideal para una foto romantica o un retrato de la pareja."
              imageUrl={null}
              label="Imagen para invitados"
              onClear={() => onGuestImageChange(null)}
              onSelectFile={onGuestImageChange}
              placeholderCopy="Selecciona la imagen de la pantalla para invitados"
              previewAlt="Vista previa de la imagen para invitados"
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
            <button
              className="editorial-primary-button editorial-primary-button--compact"
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? 'Creando evento...' : 'Crear evento'}
            </button>
          </div>
        </form>
      </article>
    </section>
  )

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(modal, document.body)
}
