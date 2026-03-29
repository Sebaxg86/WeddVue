import { formatFileSize } from '@/shared/utils/formatFileSize'

type PhotoSelectionSummaryProps = {
  files: File[]
  onRemoveFile: (index: number) => void
}

export function PhotoSelectionSummary({
  files,
  onRemoveFile,
}: PhotoSelectionSummaryProps) {
  if (files.length === 0) {
    return null
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="guest-upload__selection">
      <div className="guest-upload__selection-header">
        <h3 className="guest-upload__selection-title">Tu selección</h3>
        <p className="guest-upload__selection-meta">
          {files.length} {files.length === 1 ? 'foto' : 'fotos'} · {formatFileSize(totalSize)}
        </p>
      </div>

      <ul className="guest-upload__selection-list">
        {files.map((file, index) => (
          <li className="guest-upload__selection-item" key={`${file.name}-${file.size}-${index}`}>
            <div>
              <p className="guest-upload__selection-name">{file.name}</p>
              <p className="guest-upload__selection-size">{formatFileSize(file.size)}</p>
            </div>

            <button
              className="guest-upload__selection-remove"
              onClick={() => onRemoveFile(index)}
              type="button"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
