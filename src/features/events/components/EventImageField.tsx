import { useEffect, useId, useMemo } from 'react'

type EventImageFieldProps = {
  buttonLabel?: string
  description: string
  disabled?: boolean
  file: File | null
  helper?: string
  imageUrl: string | null
  label: string
  onClear?: () => void
  onSelectFile: (file: File | null) => void
  placeholderCopy: string
  previewAlt: string
}

export function EventImageField({
  buttonLabel,
  description,
  disabled = false,
  file,
  helper,
  imageUrl,
  label,
  onClear,
  onSelectFile,
  placeholderCopy,
  previewAlt,
}: EventImageFieldProps) {
  const inputId = useId()
  const localPreviewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl)
      }
    }
  }, [localPreviewUrl])

  const previewUrl = localPreviewUrl ?? imageUrl

  return (
    <div className="event-asset-field">
      <div className="event-asset-field__header">
        <label className="dashboard-studio__field-label" htmlFor={inputId}>
          {label}
        </label>
        <p className="event-asset-field__description">{description}</p>
      </div>

      <div className="event-asset-field__frame">
        {previewUrl ? (
          <img
            alt={previewAlt}
            className="event-asset-field__image"
            src={previewUrl}
          />
        ) : (
          <div className="event-asset-field__placeholder">
            <p className="event-asset-field__placeholder-copy">{placeholderCopy}</p>
          </div>
        )}
      </div>

      <div className="event-asset-field__actions">
        <label
          className={
            disabled
              ? 'event-workspace__ghost-button event-workspace__ghost-button--disabled'
              : 'event-workspace__ghost-button'
          }
          htmlFor={inputId}
        >
          {buttonLabel ?? (previewUrl ? 'Cambiar imagen' : 'Elegir imagen')}
        </label>

        <input
          accept="image/*"
          className="sr-only"
          disabled={disabled}
          id={inputId}
          onChange={(event) => {
            onSelectFile(event.target.files?.[0] ?? null)
            event.currentTarget.value = ''
          }}
          type="file"
        />

        {onClear && previewUrl ? (
          <button
            className="event-workspace__ghost-button"
            disabled={disabled}
            onClick={onClear}
            type="button"
          >
            Quitar
          </button>
        ) : null}
      </div>

      {helper ? <p className="event-asset-field__helper">{helper}</p> : null}
    </div>
  )
}
