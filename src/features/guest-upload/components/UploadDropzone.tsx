import { useId } from 'react'

type UploadDropzoneProps = {
  disabled?: boolean
  onFilesSelected: (files: File[]) => void
  remainingSlots: number
  selectedCount: number
}

export function UploadDropzone({
  disabled = false,
  onFilesSelected,
  remainingSlots,
  selectedCount,
}: UploadDropzoneProps) {
  const inputId = useId()

  return (
    <div className="guest-upload__picker">
      <img
        alt="Ambiente editorial de boda en tonos suaves"
        className="guest-upload__picker-image"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1czbLtCkN4M7kaipHlgtecB_GMwB0OMEQ3ev3OwKDzOQIz5Mac0MTw1UwRRnPnV4DD2W3R-K3MCY2CPRuLU473FYYSC-jTstHuXgXtcyYFEvW2GQ_obOc8fboKFi9J7ZhK_Sdc3mUh1sm9OPRohoIEo6_3h10xnsl8yYMY1P84iG-Xo4DTxbxIxdHyR6fMYiRpkuOO7Ume29VYyxZcYTPFYZQSDzZh-uYbHAjq-5s_wt8ASw-ZE7fPbILjbFwY37WKSKHRB_d2ZU"
      />
      <div className="guest-upload__picker-overlay" aria-hidden="true" />

      <div className="guest-upload__picker-content">
        <label
          className={
            disabled
              ? 'guest-upload__picker-button guest-upload__picker-button--disabled'
              : 'guest-upload__picker-button'
          }
          htmlFor={inputId}
        >
          <span className="guest-upload__picker-button-mark">+</span>
        </label>

        <input
          accept="image/*"
          className="sr-only"
          disabled={disabled}
          id={inputId}
          multiple
          onChange={(event) => {
            const nextFiles = Array.from(event.target.files ?? [])
            onFilesSelected(nextFiles)
            event.currentTarget.value = ''
          }}
          type="file"
        />

        <p className="guest-upload__picker-label">Toca para seleccionar fotos</p>
        <p className="guest-upload__picker-caption">
          {selectedCount > 0
            ? `${selectedCount} ${selectedCount === 1 ? 'foto elegida' : 'fotos elegidas'}`
            : 'Los pequeños detalles cuentan'}
        </p>
        <p className="guest-upload__picker-helper">
          Puedes agregar hasta {remainingSlots} foto{remainingSlots === 1 ? '' : 's'} más en este envío.
        </p>
      </div>
    </div>
  )
}
