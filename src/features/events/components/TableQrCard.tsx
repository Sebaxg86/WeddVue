import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'

import type { TableQrRecord } from '@/features/events/lib/eventTypes'

type TableQrCardProps = {
  baseUploadUrl: string
  isBusy: boolean
  onRegenerateToken: (table: TableQrRecord) => Promise<void>
  onSave: (
    table: TableQrRecord,
    updates: { guest_group_name: string | null; is_active: boolean },
  ) => Promise<void>
  table: TableQrRecord
}

type LocalMessage = {
  text: string
  tone: 'error' | 'success'
}

function formatLastScan(lastScannedAt: string | null) {
  if (!lastScannedAt) {
    return 'Sin escaneos'
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(lastScannedAt))
}

function sanitizeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function TableQrCard({
  baseUploadUrl,
  isBusy,
  onRegenerateToken,
  onSave,
  table,
}: TableQrCardProps) {
  const [groupName, setGroupName] = useState(table.guest_group_name ?? '')
  const [isActive, setIsActive] = useState(table.is_active)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [localMessage, setLocalMessage] = useState<LocalMessage | null>(null)
  const dismissTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setGroupName(table.guest_group_name ?? '')
    setIsActive(table.is_active)
  }, [table.guest_group_name, table.is_active])

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        window.clearTimeout(dismissTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isBusy) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isBusy, isOpen])

  const uploadUrl = `${baseUploadUrl}?t=${encodeURIComponent(table.token)}`
  const canShareFromDevice =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const normalizedGroupName = groupName.trim()
  const hasPendingChanges =
    normalizedGroupName !== (table.guest_group_name ?? '') || isActive !== table.is_active
  const fileLabel =
    (table.guest_group_name ? sanitizeFileName(table.guest_group_name) : '') ||
    `mesa-${table.table_number}`
  const qrFileName = `weddvue-${fileLabel}-qr.png`
  const cardTitle = table.guest_group_name || table.table_label
  const cardSubtitle = `${table.table_label} - ${table.scan_count} ${table.scan_count === 1 ? 'escaneo' : 'escaneos'}`

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let isCancelled = false

    async function generateQrImage() {
      setIsGeneratingQr(true)

      try {
        const { default: QRCode } = await import('qrcode')
        const nextQrDataUrl = await QRCode.toDataURL(uploadUrl, {
          color: {
            dark: '#2f3331',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 440,
        })

        if (!isCancelled) {
          setQrDataUrl(nextQrDataUrl)
        }
      } catch {
        if (!isCancelled) {
          setQrDataUrl('')
        }
      } finally {
        if (!isCancelled) {
          setIsGeneratingQr(false)
        }
      }
    }

    void generateQrImage()

    return () => {
      isCancelled = true
    }
  }, [isOpen, uploadUrl])

  function pushLocalMessage(message: LocalMessage) {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
    }

    setLocalMessage(message)
    dismissTimerRef.current = window.setTimeout(() => {
      setLocalMessage(null)
      dismissTimerRef.current = null
    }, 2400)
  }

  async function handleSave() {
    await onSave(table, {
      guest_group_name: normalizedGroupName ? normalizedGroupName : null,
      is_active: isActive,
    })
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(uploadUrl)
      pushLocalMessage({ text: 'Enlace copiado.', tone: 'success' })
    } catch {
      pushLocalMessage({
        text: 'No fue posible copiar el enlace en este navegador.',
        tone: 'error',
      })
    }
  }

  function handleDownload() {
    if (!qrDataUrl) {
      return
    }

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = qrFileName
    link.click()
  }

  async function handleShareQr() {
    if (!qrDataUrl) {
      return
    }

    if (canShareFromDevice) {
      try {
        const response = await fetch(qrDataUrl)
        const qrBlob = await response.blob()
        const qrFile = new File([qrBlob], qrFileName, { type: qrBlob.type || 'image/png' })

        if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [qrFile] })) {
          await navigator.share({
            files: [qrFile],
            text: uploadUrl,
            title: `QR de la mesa ${table.table_number}`,
          })
        } else {
          await navigator.share({
            text: uploadUrl,
            title: `QR de la mesa ${table.table_number}`,
            url: uploadUrl,
          })
        }

        pushLocalMessage({
          text: 'QR listo para compartir.',
          tone: 'success',
        })
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
      }
    }

    if (typeof window !== 'undefined') {
      const shareWindow = window.open(qrDataUrl, '_blank', 'noopener,noreferrer')

      if (shareWindow) {
        pushLocalMessage({
          text: 'QR abierto en una nueva pestana.',
          tone: 'success',
        })
        return
      }
    }

    pushLocalMessage({
      text: 'No fue posible abrir el QR en este dispositivo.',
      tone: 'error',
    })
  }

  function handleBackdropClick(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (event.target !== event.currentTarget || isBusy) {
      return
    }

    setIsOpen(false)
  }

  function handleModalSurfaceClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  const modal =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <section
            aria-modal="true"
            className="event-workspace__table-modal"
            onClick={handleBackdropClick}
            role="dialog"
          >
            <article
              className="event-workspace__table-modal-card"
              onClick={handleModalSurfaceClick}
            >
              <div className="event-workspace__table-modal-header">
                <div className="event-workspace__table-modal-copy">
                  <p className="editorial-eyebrow">Mesa {table.table_number}</p>
                  <h4 className="event-workspace__table-modal-title">{cardTitle}</h4>
                </div>

                <button
                  aria-label="Cerrar mesa"
                  className="event-workspace__table-modal-close"
                  disabled={isBusy}
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  &times;
                </button>
              </div>

              <div className="event-workspace__table-card-qr">
                {isGeneratingQr ? (
                  <div className="event-workspace__table-card-qr-placeholder">Generando QR...</div>
                ) : qrDataUrl ? (
                  <img
                    alt={`QR de la mesa ${table.table_number}`}
                    className="event-workspace__table-card-qr-image"
                    src={qrDataUrl}
                  />
                ) : (
                  <div className="event-workspace__table-card-qr-placeholder">
                    No se pudo renderizar el QR
                  </div>
                )}
              </div>

              <div className="event-workspace__table-field">
                <label className="event-workspace__table-field-label" htmlFor={`group-name-${table.id}`}>
                  Familia o grupo
                </label>
                <input
                  className="event-workspace__table-field-input"
                  id={`group-name-${table.id}`}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Ejemplo: Familia Hernandez"
                  type="text"
                  value={groupName}
                />
              </div>

              <div className="event-workspace__table-spotlight">
                <div className="event-workspace__table-metric event-workspace__table-metric--square">
                  <span>Escaneos</span>
                  <strong>{table.scan_count}</strong>
                </div>

                <button
                  className={
                    isActive
                      ? 'event-workspace__table-state-card event-workspace__table-state-card--active'
                      : 'event-workspace__table-state-card'
                  }
                  onClick={() => setIsActive((current) => !current)}
                  type="button"
                >
                  <span>Estado</span>
                  <strong>{isActive ? 'Activa' : 'Inactiva'}</strong>
                </button>
              </div>

              <div className="event-workspace__table-button-row">
                <button
                  className="editorial-primary-button editorial-primary-button--compact event-workspace__table-save-button"
                  disabled={isBusy || !hasPendingChanges}
                  onClick={handleSave}
                  type="button"
                >
                  Guardar mesa
                </button>

                <button
                  className="event-workspace__ghost-button"
                  disabled={!qrDataUrl || isBusy}
                  onClick={handleShareQr}
                  type="button"
                >
                  {canShareFromDevice ? 'Compartir QR' : 'Abrir QR'}
                </button>

                <button
                  className="event-workspace__ghost-button"
                  disabled={!qrDataUrl || isBusy}
                  onClick={handleDownload}
                  type="button"
                >
                  Descargar QR
                </button>

                <button
                  className="event-workspace__ghost-button"
                  disabled={isBusy}
                  onClick={handleCopyLink}
                  type="button"
                >
                  Copiar enlace
                </button>

                <button
                  className="event-workspace__ghost-button"
                  disabled={isBusy}
                  onClick={() => onRegenerateToken(table)}
                  type="button"
                >
                  Regenerar QR
                </button>
              </div>

              {localMessage ? (
                <p
                  className={
                    localMessage.tone === 'error'
                      ? 'event-workspace__message event-workspace__message--error'
                      : 'event-workspace__message event-workspace__message--success'
                  }
                >
                  {localMessage.text}
                </p>
              ) : null}

              <div className="event-workspace__table-metric event-workspace__table-metric--footer">
                <span>Ultimo acceso</span>
                <strong>{formatLastScan(table.last_scanned_at)}</strong>
              </div>
            </article>
          </section>,
          document.body,
        )
      : null

  return (
    <>
      <article
        className={
          table.table_number === 1
            ? 'event-workspace__table-card event-workspace__table-card--featured'
            : 'event-workspace__table-card'
        }
      >
        <button
          className="event-workspace__table-trigger"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <div className="event-workspace__table-trigger-copy">
            <p className="event-workspace__table-card-overline">Mesa {table.table_number}</p>
            <h4 className="event-workspace__table-card-title">{cardTitle}</h4>
            <p className="event-workspace__table-card-meta">{cardSubtitle}</p>
          </div>

          <div className="event-workspace__table-trigger-side">
            <span className="event-workspace__table-card-pill">{table.table_number}</span>
            <span
              className={
                isActive
                  ? 'event-workspace__table-card-state event-workspace__table-card-state--active'
                  : 'event-workspace__table-card-state'
              }
            >
              {isActive ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </button>
      </article>

      {modal}
    </>
  )
}
