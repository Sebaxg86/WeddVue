import { useId } from 'react'

type UploadDropzoneProps = {
  onFilesSelected: (files: File[]) => void
  remainingSlots: number
}

export function UploadDropzone({
  onFilesSelected,
  remainingSlots,
}: UploadDropzoneProps) {
  const inputId = useId()

  return (
    <div className="dropzone">
      <div>
        <p className="dropzone__eyebrow">Guest upload</p>
        <h2 className="panel-title">Choose wedding photos</h2>
        <p className="panel-subtitle">
          Add JPG, PNG, or HEIC images. The production flow will compress and
          upload them to the private bucket.
        </p>
      </div>

      <label className="button button--secondary" htmlFor={inputId}>
        Select photos
      </label>

      <input
        accept="image/*"
        className="sr-only"
        id={inputId}
        multiple
        onChange={(event) => {
          const nextFiles = Array.from(event.target.files ?? [])
          onFilesSelected(nextFiles)
          event.currentTarget.value = ''
        }}
        type="file"
      />

      <p className="helper-copy">
        Remaining slots in this batch: {remainingSlots}
      </p>
    </div>
  )
}
