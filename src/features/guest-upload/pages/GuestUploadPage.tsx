import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PhotoSelectionSummary } from '@/features/guest-upload/components/PhotoSelectionSummary'
import { UploadDropzone } from '@/features/guest-upload/components/UploadDropzone'
import {
  guestUploadSchema,
  MAX_FILES_PER_BATCH,
} from '@/features/guest-upload/lib/guestUploadSchema'
import { clientEnv, hasSupabaseConfig } from '@/lib/config/env'
import { getDeviceContext } from '@/lib/device/getDeviceContext'
import { formatFileSize } from '@/shared/utils/formatFileSize'

const uploadPromises = [
  'No sign-in for guests',
  'Private storage for the couple',
  'Traceability by QR, guest name, and device context',
]

export function GuestUploadPage() {
  const [searchParams] = useSearchParams()
  const [guestName, setGuestName] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [deviceContext] = useState(() => getDeviceContext())

  const qrToken = searchParams.get('t') ?? ''
  const validation = guestUploadSchema.safeParse({
    guestName,
    files: selectedFiles,
  })
  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message ?? 'Complete the required fields.'

  const totalSelectedSize = selectedFiles.reduce(
    (sum, file) => sum + file.size,
    0,
  )

  function handleFilesSelected(nextFiles: File[]) {
    const imageFiles = nextFiles.filter((file) => file.type.startsWith('image/'))
    const mergedFiles = [...selectedFiles]

    for (const file of imageFiles) {
      const alreadyAdded = mergedFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified,
      )

      if (alreadyAdded || mergedFiles.length >= MAX_FILES_PER_BATCH) {
        continue
      }

      mergedFiles.push(file)
    }

    setSelectedFiles(mergedFiles)
  }

  function handleRemoveFile(indexToRemove: number) {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    )
  }

  return (
    <section className="page-grid">
      <div className="page-copy">
        <p className="eyebrow">Guest upload flow</p>
        <h1 className="page-title">Share the wedding through your own lens.</h1>
        <p className="page-lead">
          This first TypeScript scaffold is already aligned with the actual
          product: low friction, private storage, and a clean path from table QR
          to upload batch.
        </p>

        <div className="pill-row">
          <span className="status-pill">
            {hasSupabaseConfig ? 'Supabase env detected' : 'Supabase env pending'}
          </span>
          <span className="status-pill status-pill--soft">
            Turnstile key{' '}
            {clientEnv.turnstileSiteKey ? 'configured' : 'not configured yet'}
          </span>
        </div>

        <ul className="feature-list">
          {uploadPromises.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </div>

      <div className="panel-stack">
        <article className="panel panel--highlight">
          <div className="panel-grid">
            <div>
              <h2 className="panel-title">Batch details</h2>
              <p className="panel-subtitle">
                The QR token, guest name, and device context will be attached to
                every upload batch.
              </p>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <span className="info-label">QR token</span>
                <strong className="info-value">
                  {qrToken || 'Missing from URL'}
                </strong>
              </div>
              <div className="info-card">
                <span className="info-label">Photo limit</span>
                <strong className="info-value">10 per batch</strong>
              </div>
              <div className="info-card">
                <span className="info-label">Selected size</span>
                <strong className="info-value">
                  {formatFileSize(totalSelectedSize)}
                </strong>
              </div>
            </div>

            {!qrToken ? (
              <p className="warning-banner">
                Open this page with a `?t=your-token` query parameter to simulate
                the QR entry flow.
              </p>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <div className="field-group">
            <label className="field-label" htmlFor="guest-name">
              Guest name
            </label>
            <input
              className="text-input"
              id="guest-name"
              maxLength={120}
              onChange={(event) => setGuestName(event.target.value)}
              placeholder="Example: Sebastian, cousin of the bride"
              type="text"
              value={guestName}
            />
          </div>

          <UploadDropzone
            onFilesSelected={handleFilesSelected}
            remainingSlots={MAX_FILES_PER_BATCH - selectedFiles.length}
          />

          <PhotoSelectionSummary
            files={selectedFiles}
            onRemoveFile={handleRemoveFile}
          />

          <div className="action-row">
            <button
              className="button"
              disabled={!validation.success || qrToken.length === 0}
              type="button"
            >
              Continue to upload orchestration
            </button>
            <p className="helper-copy">
              {validationMessage ??
                'The next step is connecting this form to a signed-upload Edge Function.'}
            </p>
          </div>
        </article>

        <article className="panel">
          <h2 className="panel-title">Captured device context</h2>
          <div className="metric-grid">
            <div className="metric-card">
              <span className="metric-label">Language</span>
              <strong className="metric-value">{deviceContext.language}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Timezone</span>
              <strong className="metric-value">{deviceContext.timezone}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Viewport</span>
              <strong className="metric-value">
                {deviceContext.screenWidth} x {deviceContext.screenHeight}
              </strong>
            </div>
          </div>
          <p className="helper-copy">
            This is a lightweight placeholder. We can enrich it later with
            parsed browser and device data during the real upload flow.
          </p>
        </article>
      </div>
    </section>
  )
}
