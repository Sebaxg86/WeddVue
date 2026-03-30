import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PhotoSelectionSummary } from '@/features/guest-upload/components/PhotoSelectionSummary'
import { UploadDropzone } from '@/features/guest-upload/components/UploadDropzone'
import {
  fetchGuestUploadContext,
  submitGuestUpload,
  type GuestUploadContext,
  type GuestUploadProgress,
  type SubmitGuestUploadResult,
} from '@/features/guest-upload/lib/guestUploadService'
import {
  guestUploadSchema,
  MAX_FILES_PER_BATCH,
} from '@/features/guest-upload/lib/guestUploadSchema'
import { getPublicEventGuestImageUrl } from '@/features/events/lib/eventAssetStorage'
import { hasSupabaseConfig } from '@/lib/config/env'
import { getDeviceContext } from '@/lib/device/getDeviceContext'

type StatusMessage = {
  text: string
  tone: 'error' | 'success'
}

function buildRomanticHeading(title: string) {
  const normalized = title
    .trim()
    .replace(/^enlace de\s+/i, '')
    .replace(/^boda de\s+/i, '')
    .replace(/^celebraci[oó]n de\s+/i, '')

  const ampersandParts = normalized.split(/\s*&\s*/).map((part) => part.trim())

  if (ampersandParts.length === 2 && ampersandParts.every(Boolean)) {
    return {
      kind: 'pair' as const,
      left: ampersandParts[0],
      right: ampersandParts[1],
    }
  }

  const yParts = normalized.split(/\s+y\s+/i).map((part) => part.trim())

  if (yParts.length === 2 && yParts.every(Boolean)) {
    return {
      kind: 'pair' as const,
      left: yParts[0],
      right: yParts[1],
    }
  }

  return {
    kind: 'single' as const,
    title: normalized || title,
  }
}

function GuestUploadFrame({
  children,
  isToastVisible,
}: {
  children: ReactNode
  isToastVisible: boolean
}) {
  return (
    <section className="guest-upload">
      {isToastVisible ? (
        <div className="guest-upload__toast" role="status" aria-live="polite">
          <div className="guest-upload__toast-card">
            <span className="guest-upload__toast-mark">+</span>
            <p className="guest-upload__toast-title">¡Gracias por este regalo!</p>
            <p className="guest-upload__toast-copy">
              Tus fotos ya son parte del recuerdo
            </p>
          </div>
        </div>
      ) : null}

      <nav className="guest-upload__nav">
        <div className="guest-upload__nav-inner">
          <span className="guest-upload__nav-brand">WeddVue</span>
        </div>
      </nav>

      <main className="guest-upload__main">{children}</main>
    </section>
  )
}

export function GuestUploadPage() {
  const [searchParams] = useSearchParams()
  const [guestName, setGuestName] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [deviceContext] = useState(() => getDeviceContext())
  const [uploadContext, setUploadContext] = useState<GuestUploadContext | null>(null)
  const [contextError, setContextError] = useState<string | null>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(() => Boolean(hasSupabaseConfig))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)
  const [lastUploadResult, setLastUploadResult] = useState<SubmitGuestUploadResult | null>(null)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<GuestUploadProgress>({
    completed: 0,
    currentFileName: null,
    total: 0,
  })

  const qrToken = searchParams.get('t') ?? ''
  const validation = guestUploadSchema.safeParse({
    guestName,
    files: selectedFiles,
  })
  const validationMessage = validation.success
    ? null
    : validation.error.issues[0]?.message ?? 'Completa los campos requeridos.'

  const romanticHeading = useMemo(
    () => buildRomanticHeading(uploadContext?.event_title ?? ''),
    [uploadContext?.event_title],
  )
  const guestUploadImageUrl = useMemo(
    () => getPublicEventGuestImageUrl(uploadContext?.guest_upload_image_path ?? null),
    [uploadContext?.guest_upload_image_path],
  )

  useEffect(() => {
    let isCancelled = false

    async function loadUploadContext() {
      if (!hasSupabaseConfig) {
        setIsLoadingContext(false)
        return
      }

      if (!qrToken.trim()) {
        setUploadContext(null)
        setContextError(null)
        setIsLoadingContext(false)
        return
      }

      setIsLoadingContext(true)
      setContextError(null)

      try {
        const nextContext = await fetchGuestUploadContext(qrToken)

        if (!isCancelled) {
          setUploadContext(nextContext)
        }
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error
              ? error.message
              : 'No pudimos validar el QR de esta mesa.'

          setUploadContext(null)
          setContextError(message)
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingContext(false)
        }
      }
    }

    void loadUploadContext()

    return () => {
      isCancelled = true
    }
  }, [qrToken])

  useEffect(() => {
    if (!lastUploadResult) {
      return
    }

    setIsToastVisible(true)
    const timer = window.setTimeout(() => {
      setIsToastVisible(false)
    }, 5000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [lastUploadResult])

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
    setStatusMessage(null)
    setLastUploadResult(null)
    setIsToastVisible(false)
  }

  function handleRemoveFile(indexToRemove: number) {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    )
    setStatusMessage(null)
  }

  async function handleSubmitUpload() {
    if (!validation.success || !uploadContext) {
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)
    setLastUploadResult(null)
    setIsToastVisible(false)
    setUploadProgress({
      completed: 0,
      currentFileName: null,
      total: selectedFiles.length,
    })

    try {
      const result = await submitGuestUpload(
        {
          deviceContext,
          files: selectedFiles,
          guestName,
          qrToken,
        },
        (progress) => setUploadProgress(progress),
      )

      setLastUploadResult(result)
      setSelectedFiles([])

      if (result.failedFileNames.length > 0) {
        setStatusMessage({
          text: `Se subieron ${result.uploadedCount} fotos. Algunas no pudieron enviarse.`,
          tone: 'success',
        })
      } else {
        setStatusMessage(null)
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible subir las fotos en este momento.'

      setStatusMessage({
        text: message,
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasSupabaseConfig) {
    return (
      <GuestUploadFrame isToastVisible={false}>
        <div className="guest-upload__status">
          <p className="editorial-eyebrow">Configuración requerida</p>
          <h1 className="guest-upload__status-title">
            Faltan las variables públicas de Supabase.
          </h1>
          <p className="guest-upload__status-copy">
            Agrega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>{' '}
            en tu archivo <code>.env</code> para usar el sitio.
          </p>
        </div>
      </GuestUploadFrame>
    )
  }

  const isUploadDisabled =
    !validation.success ||
    qrToken.trim().length === 0 ||
    !uploadContext ||
    isLoadingContext ||
    isSubmitting

  const helperText = isSubmitting
    ? `Procesando: ${uploadProgress.currentFileName || 'preparando envío'}`
    : lastUploadResult && !statusMessage
      ? 'Si quieres, puedes elegir más fotos y enviar otro lote.'
      : validationMessage ||
        'Tus fotos se guardan de forma privada y puedes compartir hasta 10 por envío.'

  return (
    <GuestUploadFrame isToastVisible={isToastVisible}>
      {isLoadingContext ? (
        <div className="guest-upload__status">
          <p className="editorial-eyebrow">En honor a</p>
          <h1 className="guest-upload__status-title">Estamos preparando tu espacio.</h1>
          <p className="guest-upload__status-copy">
            Validando el código de tu mesa para abrir el formulario correcto.
          </p>
        </div>
      ) : contextError ? (
        <div className="guest-upload__status">
          <p className="editorial-eyebrow">No pudimos abrir esta mesa</p>
          <h1 className="guest-upload__status-title">Intenta escanear el QR nuevamente.</h1>
          <p className="guest-upload__status-copy">{contextError}</p>
        </div>
      ) : !qrToken ? (
        <div className="guest-upload__status">
          <p className="editorial-eyebrow">Acceso por invitación</p>
          <h1 className="guest-upload__status-title">
            Esta página se abre desde el QR de tu mesa.
          </h1>
          <p className="guest-upload__status-copy">
            Si eres invitado, escanea el código impreso en tu mesa para compartir tus fotos de forma privada.
          </p>
        </div>
      ) : uploadContext ? (
        <div className="guest-upload__content">
          <header className="guest-upload__hero">
            <div className="guest-upload__eyebrow-wrap">
              <span className="guest-upload__eyebrow">En honor a</span>
            </div>

            {romanticHeading.kind === 'pair' ? (
              <h1 className="guest-upload__title">
                <span>{romanticHeading.left}</span>
                <span className="guest-upload__ampersand">&amp;</span>
                <span>{romanticHeading.right}</span>
              </h1>
            ) : (
              <h1 className="guest-upload__title guest-upload__title--single">
                <span>{romanticHeading.title}</span>
              </h1>
            )}

            <p className="guest-upload__lead">
              Ayúdanos a capturar la magia de este día a través de tu lente
            </p>
          </header>

          <section className="guest-upload__interaction">
            <div className="guest-upload__name-field">
              <label className="guest-upload__name-label" htmlFor="guest-name">
                ¿Quién nos acompaña?
              </label>
              <input
                className="guest-upload__name-input"
                id="guest-name"
                maxLength={120}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Tu nombre aquí"
                type="text"
                value={guestName}
              />
            </div>

            <UploadDropzone
              disabled={isSubmitting}
              imageUrl={guestUploadImageUrl}
              onFilesSelected={handleFilesSelected}
              remainingSlots={MAX_FILES_PER_BATCH - selectedFiles.length}
              selectedCount={selectedFiles.length}
            />

            <PhotoSelectionSummary
              files={selectedFiles}
              onRemoveFile={handleRemoveFile}
            />

            {statusMessage ? (
              <p
                className={
                  statusMessage.tone === 'error'
                    ? 'guest-upload__message guest-upload__message--error'
                    : 'guest-upload__message guest-upload__message--success'
                }
              >
                {statusMessage.text}
              </p>
            ) : null}

            <div className="guest-upload__submit-wrap">
              <button
                className="editorial-primary-button guest-upload__submit"
                disabled={isUploadDisabled}
                onClick={handleSubmitUpload}
                type="button"
              >
                {isSubmitting
                  ? `Subiendo ${uploadProgress.completed}/${uploadProgress.total || selectedFiles.length}`
                  : 'Enviar al Álbum'}
              </button>

              <div className="guest-upload__microcopy">
                <span className="guest-upload__microcopy-dot" />
                <p>Se añadirán instantáneamente</p>
                <span className="guest-upload__microcopy-dot" />
              </div>

              <p className="guest-upload__helper">{helperText}</p>
            </div>
          </section>

          <footer className="guest-upload__footer">
            <p className="guest-upload__footer-title">Gracias de todo corazón</p>
            <div className="guest-upload__footer-divider" aria-hidden="true" />
            <div className="guest-upload__footer-links">
              <a className="guest-upload__footer-link" href="#">
                Privacidad
              </a>
              <a className="guest-upload__footer-link" href="#">
                Contacto
              </a>
            </div>
            <p className="guest-upload__footer-note">© 2024 WeddVue</p>
          </footer>
        </div>
      ) : null}
    </GuestUploadFrame>
  )
}
