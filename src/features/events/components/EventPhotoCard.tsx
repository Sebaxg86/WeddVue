import type { EventPhotoRecord } from '@/features/events/lib/eventTypes'

type GalleryViewMode = 'editorial' | 'mosaic'

type EventPhotoCardProps = {
  isBusy: boolean
  isSelected: boolean
  isSelectionMode: boolean
  onDownload: (photo: EventPhotoRecord) => Promise<void>
  onOpen: (photoId: string) => void
  onToggleFavorite: (photo: EventPhotoRecord) => Promise<void>
  onToggleSelection: (photoId: string) => void
  photo: EventPhotoRecord
  viewMode: GalleryViewMode
}

function formatPhotoDate(value: string | null) {
  if (!value) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function EventPhotoCard({
  isBusy,
  isSelected,
  isSelectionMode,
  onDownload,
  onOpen,
  onToggleFavorite,
  onToggleSelection,
  photo,
  viewMode,
}: EventPhotoCardProps) {
  const displayName = photo.original_filename || 'Recuerdo del evento'
  const categoryLabel = photo.guest_group_name || photo.table_label
  const tableLabel = photo.table_number ? `Mesa ${photo.table_number}` : 'Mesa'
  const overlayLabel = isSelectionMode
    ? isSelected
      ? 'Seleccionada'
      : 'Seleccionar'
    : 'Abrir'

  function handlePrimaryAction() {
    if (isSelectionMode) {
      onToggleSelection(photo.id)
      return
    }

    onOpen(photo.id)
  }

  return (
    <article
      className={[
        'event-workspace__photo-card',
        viewMode === 'mosaic' ? 'event-workspace__photo-card--mosaic' : '',
        isSelected ? 'event-workspace__photo-card--selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="event-workspace__photo-media-shell">
        <button
          aria-label={isSelectionMode ? `Seleccionar ${displayName}` : `Abrir ${displayName}`}
          className="event-workspace__photo-media-button"
          onClick={handlePrimaryAction}
          type="button"
        >
          <div className="event-workspace__photo-media">
            {photo.signed_url ? (
              <img
                alt={displayName}
                className="event-workspace__photo-image"
                loading="lazy"
                src={photo.signed_url}
              />
            ) : (
              <div className="event-workspace__photo-placeholder">Sin vista previa</div>
            )}
            <span className="event-workspace__photo-overlay">{overlayLabel}</span>
          </div>
        </button>

        {isSelectionMode ? (
          <button
            aria-label={isSelected ? 'Quitar de seleccion' : 'Agregar a seleccion'}
            className={
              isSelected
                ? 'event-workspace__photo-select event-workspace__photo-select--selected'
                : 'event-workspace__photo-select'
            }
            onClick={() => onToggleSelection(photo.id)}
            type="button"
          >
            {isSelected ? (
              <svg
                aria-hidden="true"
                className="event-workspace__photo-select-icon"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.55 16.6 5.8 12.85l1.06-1.06 2.69 2.69 7.6-7.6 1.06 1.06-8.66 8.66Z"
                  fill="currentColor"
                />
              </svg>
            ) : null}
          </button>
        ) : null}

        {photo.is_favorite ? (
          <span className="event-workspace__photo-favorite-badge" aria-hidden="true">
            Favorita
          </span>
        ) : null}
      </div>

      {viewMode === 'editorial' ? (
        <>
          <div className="event-workspace__photo-copy">
            <div className="event-workspace__photo-tags">
              <span className="event-workspace__photo-tag">{categoryLabel}</span>
              <span className="event-workspace__photo-tag event-workspace__photo-tag--soft">
                {tableLabel}
              </span>
            </div>

            <h3 className="event-workspace__photo-title">{displayName}</h3>
            <p className="event-workspace__photo-caption">Subida por {photo.guest_name}</p>

            <div className="event-workspace__photo-meta">
              <span>{formatPhotoDate(photo.captured_at ?? photo.created_at)}</span>
              <span>{formatFileSize(photo.file_size_bytes)}</span>
            </div>
          </div>

          {!isSelectionMode ? (
            <div className="event-workspace__photo-actions">
              <button
                className={
                  photo.is_favorite
                    ? 'event-workspace__photo-action event-workspace__photo-action--active'
                    : 'event-workspace__photo-action'
                }
                disabled={isBusy}
                onClick={() => void onToggleFavorite(photo)}
                type="button"
              >
                {photo.is_favorite ? 'Favorita' : 'Marcar favorita'}
              </button>

              <button
                className="event-workspace__photo-action event-workspace__photo-action--ghost"
                disabled={isBusy}
                onClick={() => void onDownload(photo)}
                type="button"
              >
                Descargar
              </button>
            </div>
          ) : (
            <div className="event-workspace__photo-selection-note">
              <span>{isSelected ? 'Seleccionada' : 'Lista para seleccionar'}</span>
            </div>
          )}
        </>
      ) : null}
    </article>
  )
}
