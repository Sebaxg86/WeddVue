import { useEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'

import type { EventPhotoRecord } from '@/features/events/lib/eventTypes'

type EventGalleryLightboxProps = {
  activeIndex: number
  isBusy: boolean
  onClose: () => void
  onDownload: (photo: EventPhotoRecord) => Promise<void>
  onJumpTo: (index: number) => void
  onNext: () => void
  onPrevious: () => void
  onToggleFavorite: (photo: EventPhotoRecord) => Promise<void>
  photo: EventPhotoRecord
  photos: EventPhotoRecord[]
}

export function EventGalleryLightbox({
  activeIndex,
  isBusy,
  onClose,
  onDownload,
  onJumpTo,
  onNext,
  onPrevious,
  onToggleFavorite,
  photo,
  photos,
}: EventGalleryLightboxProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'ArrowLeft' && photos.length > 1) {
        onPrevious()
      }

      if (event.key === 'ArrowRight' && photos.length > 1) {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onNext, onPrevious, photos.length])

  function handleBackdropClick(event: MouseEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) {
      return
    }

    onClose()
  }

  function handleSurfaceClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  const title = photo.original_filename || 'Recuerdo del evento'

  return createPortal(
    <section
      aria-modal="true"
      className="event-gallery-lightbox"
      onClick={handleBackdropClick}
      role="dialog"
    >
      <article className="event-gallery-lightbox__surface" onClick={handleSurfaceClick}>
        <div className="event-gallery-lightbox__media-stage">
          <div className="event-gallery-lightbox__topbar">
            <div className="event-gallery-lightbox__controls">
              <button
                aria-label={photo.is_favorite ? 'Quitar favorita' : 'Guardar favorita'}
                className={
                  photo.is_favorite
                    ? 'event-gallery-lightbox__icon-button event-gallery-lightbox__icon-button--active'
                    : 'event-gallery-lightbox__icon-button'
                }
                disabled={isBusy}
                onClick={() => void onToggleFavorite(photo)}
                type="button"
              >
                <svg aria-hidden="true" className="event-gallery-lightbox__icon" viewBox="0 0 24 24">
                  <path
                    d="M12 20.25a.74.74 0 0 1-.39-.11c-4.07-2.45-6.61-5.24-7.54-8.31A5.02 5.02 0 0 1 8.9 5.5c1.2 0 2.31.47 3.1 1.29A4.44 4.44 0 0 1 15.1 5.5a5.02 5.02 0 0 1 4.83 6.33c-.93 3.07-3.47 5.86-7.54 8.31a.74.74 0 0 1-.39.11Zm-3.1-13.25a3.52 3.52 0 0 0-3.41 4.4c.77 2.56 2.91 4.95 6.51 7.17 3.6-2.22 5.74-4.61 6.51-7.17A3.52 3.52 0 0 0 15.1 7c-1.04 0-1.99.49-2.6 1.34a.75.75 0 0 1-1.22 0A3.18 3.18 0 0 0 8.9 7Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <button
                aria-label="Descargar foto"
                className="event-gallery-lightbox__icon-button"
                disabled={isBusy}
                onClick={() => void onDownload(photo)}
                type="button"
              >
                <svg aria-hidden="true" className="event-gallery-lightbox__icon" viewBox="0 0 24 24">
                  <path
                    d="M12 15.25a.74.74 0 0 1-.53-.22l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V4.75a.75.75 0 0 1 1.5 0v7.94l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.74.74 0 0 1-.53.22Zm-6 4.75A2.25 2.25 0 0 1 3.75 17.75v-2a.75.75 0 0 1 1.5 0v2a.75.75 0 0 0 .75.75h12a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 18 20H6Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <button
                aria-label="Cerrar visor"
                className="event-gallery-lightbox__icon-button"
                onClick={onClose}
                type="button"
              >
                <svg aria-hidden="true" className="event-gallery-lightbox__icon" viewBox="0 0 24 24">
                  <path
                    d="M6.97 6.97a.75.75 0 0 1 1.06 0L12 10.94l3.97-3.97a.75.75 0 1 1 1.06 1.06L13.06 12l3.97 3.97a.75.75 0 1 1-1.06 1.06L12 13.06l-3.97 3.97a.75.75 0 1 1-1.06-1.06L10.94 12 6.97 8.03a.75.75 0 0 1 0-1.06Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          {photos.length > 1 ? (
            <button
              aria-label="Foto anterior"
              className="event-gallery-lightbox__nav event-gallery-lightbox__nav--previous"
              onClick={onPrevious}
              type="button"
            >
              &larr;
            </button>
          ) : null}

          <div className="event-gallery-lightbox__media-shell">
            {photo.signed_url ? (
              <img alt={title} className="event-gallery-lightbox__image" src={photo.signed_url} />
            ) : (
              <div className="event-gallery-lightbox__placeholder">Sin vista previa</div>
            )}
          </div>

          {photos.length > 1 ? (
            <button
              aria-label="Siguiente foto"
              className="event-gallery-lightbox__nav event-gallery-lightbox__nav--next"
              onClick={onNext}
              type="button"
            >
              &rarr;
            </button>
          ) : null}
        </div>

        {photos.length > 1 ? (
          <div className="event-gallery-lightbox__thumbs">
            {photos.map((item, index) => (
              <button
                aria-label={`Ir a la foto ${index + 1}`}
                className={
                  index === activeIndex
                    ? 'event-gallery-lightbox__thumb event-gallery-lightbox__thumb--active'
                    : 'event-gallery-lightbox__thumb'
                }
                key={item.id}
                onClick={() => onJumpTo(index)}
                type="button"
              >
                {item.signed_url ? (
                  <img alt="" className="event-gallery-lightbox__thumb-image" src={item.signed_url} />
                ) : (
                  <span className="event-gallery-lightbox__thumb-placeholder" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </article>
    </section>,
    document.body,
  )
}
