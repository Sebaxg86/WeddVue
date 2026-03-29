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
    return (
      <div className="empty-state">
        <p className="empty-state-title">No photos selected yet.</p>
        <p className="empty-state-copy">
          Guests will be able to upload up to 10 photos per batch.
        </p>
      </div>
    )
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="selection-summary">
      <div className="selection-summary__header">
        <div>
          <h3 className="panel-title">Selected photos</h3>
          <p className="panel-subtitle">
            {files.length} file{files.length === 1 ? '' : 's'} ·{' '}
            {formatFileSize(totalSize)}
          </p>
        </div>
      </div>

      <ul className="file-list">
        {files.map((file, index) => (
          <li className="file-list__item" key={`${file.name}-${file.size}-${index}`}>
            <div>
              <p className="file-list__name">{file.name}</p>
              <p className="file-list__meta">{formatFileSize(file.size)}</p>
            </div>
            <button
              className="ghost-button"
              onClick={() => onRemoveFile(index)}
              type="button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
