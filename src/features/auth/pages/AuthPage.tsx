import { startTransition, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { AuthForm, type AuthMode } from '@/features/auth/components/AuthForm'
import { hasSupabaseConfig } from '@/lib/config/env'
import { supabase } from '@/lib/supabase/client'
import {
  isAccountSession,
  useSupabaseSession,
} from '@/lib/supabase/useSupabaseSession'
import { EditorialFooter } from '@/shared/components/EditorialFooter'

type AuthPageStateProps = {
  children: ReactNode
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function buildFullName(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
}

function getBaseAuthUrl() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return `${window.location.origin}/auth`
}

function getPasswordRecoveryRedirectUrl() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return `${window.location.origin}/auth?mode=reset`
}

function normalizeAuthMode(value: string | null): AuthMode {
  if (value === 'signup' || value === 'forgot' || value === 'reset') {
    return value
  }

  return 'signin'
}

function mapAuthErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'Correo o contrasena incorrectos.'
  }

  if (normalizedMessage.includes('email not confirmed')) {
    return 'Primero confirma tu correo desde el enlace que te enviamos.'
  }

  if (normalizedMessage.includes('user already registered')) {
    return 'Ya existe una cuenta con este correo.'
  }

  if (normalizedMessage.includes('same password')) {
    return 'Elige una contrasena distinta a la anterior.'
  }

  return message
}

function AuthPageFrame({ children }: AuthPageStateProps) {
  return (
    <section className="auth-editorial-page">
      <main className="auth-editorial-page__main">
        <div className="auth-editorial-page__return-row">
          <Link className="dashboard-studio__header-action" to="/">
            <span className="dashboard-studio__header-action-mark" aria-hidden="true">
              &larr;
            </span>
            <span>Volver</span>
          </Link>
        </div>

        <div className="auth-editorial-page__brand-block">
          <h1 className="auth-editorial-page__brand">WeddVue</h1>
          <p className="auth-editorial-page__subtitle">Un momento para siempre</p>
        </div>

        <div className="auth-editorial-page__content">{children}</div>
      </main>

      <EditorialFooter className="auth-editorial-footer" />
    </section>
  )
}

export function AuthPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { errorMessage: sessionErrorMessage, isLoading, session } = useSupabaseSession()
  const mode = normalizeAuthMode(searchParams.get('mode'))
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null)
  const [pendingPasswordResetEmail, setPendingPasswordResetEmail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const authRedirectUrl = useMemo(() => getBaseAuthUrl(), [])
  const recoveryRedirectUrl = useMemo(() => getPasswordRecoveryRedirectUrl(), [])
  const recoverySessionReady = mode === 'reset' && isAccountSession(session)

  useEffect(() => {
    if (isAccountSession(session) && mode !== 'reset') {
      startTransition(() => {
        navigate('/dashboard', { replace: true })
      })
    }
  }, [mode, navigate, session])

  const effectiveInfoMessage =
    infoMessage ??
    (recoverySessionReady
      ? 'Ya puedes definir una nueva contrasena para recuperar tu cuenta.'
      : null)

  function resetMessages() {
    setErrorMessage(null)
    setInfoMessage(null)
  }

  function updateMode(nextMode: AuthMode) {
    const nextParams = new URLSearchParams(searchParams)

    if (nextMode === 'signin') {
      nextParams.delete('mode')
    } else {
      nextParams.set('mode', nextMode)
    }

    setSearchParams(nextParams, { replace: true })
    resetMessages()

    if (nextMode !== 'signup') {
      setFirstName('')
      setLastName('')
      setConfirmEmail('')
    }

    if (nextMode !== 'forgot') {
      setPendingPasswordResetEmail(null)
    }

    if (nextMode !== 'signin') {
      setPendingConfirmationEmail(null)
    }

    if (nextMode !== 'reset') {
      setPassword('')
      setConfirmPassword('')
    }
  }

  async function handleResendConfirmation() {
    if (!supabase) {
      return
    }

    const targetEmail = (pendingConfirmationEmail || email).trim().toLowerCase()

    if (!isValidEmail(targetEmail)) {
      setErrorMessage('Escribe un correo valido para reenviar la confirmacion.')
      setInfoMessage(null)
      return
    }

    setIsResendingConfirmation(true)
    setErrorMessage(null)

    const { error } = await supabase.auth.resend({
      email: targetEmail,
      options: authRedirectUrl ? { emailRedirectTo: authRedirectUrl } : undefined,
      type: 'signup',
    })

    if (error) {
      setErrorMessage(mapAuthErrorMessage(error.message))
      setIsResendingConfirmation(false)
      return
    }

    setPendingConfirmationEmail(targetEmail)
    setInfoMessage(`Reenviamos el correo de confirmacion a ${targetEmail}.`)
    setIsResendingConfirmation(false)
  }

  async function handleSubmit() {
    if (!supabase) {
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedConfirmEmail = confirmEmail.trim().toLowerCase()

    if (mode === 'signin') {
      if (!isValidEmail(normalizedEmail)) {
        setErrorMessage('Escribe un correo valido para continuar.')
        setInfoMessage(null)
        return
      }

      if (!password) {
        setErrorMessage('Escribe tu contrasena para entrar.')
        setInfoMessage(null)
        return
      }

      setIsSubmitting(true)
      resetMessages()

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) {
        setErrorMessage(mapAuthErrorMessage(error.message))
      }

      setIsSubmitting(false)
      return
    }

    if (mode === 'forgot') {
      if (!isValidEmail(normalizedEmail)) {
        setErrorMessage('Escribe un correo valido para enviarte el enlace de recuperacion.')
        setInfoMessage(null)
        return
      }

      setIsSubmitting(true)
      resetMessages()

      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        ...(recoveryRedirectUrl ? { redirectTo: recoveryRedirectUrl } : {}),
      })

      if (error) {
        setErrorMessage(mapAuthErrorMessage(error.message))
        setIsSubmitting(false)
        return
      }

      setPendingPasswordResetEmail(normalizedEmail)
      setInfoMessage(
        `Te enviamos un enlace de recuperacion a ${normalizedEmail}. Abre el correo y vuelve aqui para crear una nueva contrasena.`,
      )
      setIsSubmitting(false)
      return
    }

    if (mode === 'reset') {
      if (!recoverySessionReady) {
        setErrorMessage('Este enlace de recuperacion ya no es valido. Solicita uno nuevo.')
        setInfoMessage(null)
        return
      }

      if (password.length < 8) {
        setErrorMessage('Tu nueva contrasena debe tener al menos 8 caracteres.')
        setInfoMessage(null)
        return
      }

      if (password !== confirmPassword) {
        setErrorMessage('Las contrasenas no coinciden.')
        setInfoMessage(null)
        return
      }

      setIsSubmitting(true)
      resetMessages()

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setErrorMessage(mapAuthErrorMessage(error.message))
        setIsSubmitting(false)
        return
      }

      setInfoMessage('Tu contrasena fue actualizada. Te llevaremos a tu panel privado.')
      setPassword('')
      setConfirmPassword('')

      window.setTimeout(() => {
        startTransition(() => {
          navigate('/dashboard', { replace: true })
        })
      }, 900)

      setIsSubmitting(false)
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage('Escribe un correo valido para continuar.')
      setInfoMessage(null)
      return
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Escribe nombre y apellidos para crear tu cuenta.')
      setInfoMessage(null)
      return
    }

    if (normalizedEmail !== normalizedConfirmEmail) {
      setErrorMessage('Los correos no coinciden.')
      setInfoMessage(null)
      return
    }

    if (password.length < 8) {
      setErrorMessage('Tu contrasena debe tener al menos 8 caracteres.')
      setInfoMessage(null)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contrasenas no coinciden.')
      setInfoMessage(null)
      return
    }

    setIsSubmitting(true)
    resetMessages()

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          full_name: buildFullName(firstName, lastName),
          last_name: lastName.trim(),
        },
        ...(authRedirectUrl ? { emailRedirectTo: authRedirectUrl } : {}),
      },
    })

    if (error) {
      setErrorMessage(mapAuthErrorMessage(error.message))
      setIsSubmitting(false)
      return
    }

    if (isAccountSession(data.session ?? null)) {
      startTransition(() => {
        navigate('/dashboard', { replace: true })
      })
      setIsSubmitting(false)
      return
    }

    setPendingConfirmationEmail(normalizedEmail)
    setPassword('')
    setConfirmPassword('')
    updateMode('signin')
    setInfoMessage(
      `Te enviamos un correo de confirmacion a ${normalizedEmail}. Abre el enlace para activar tu cuenta y volver a WeddVue.`,
    )
    setIsSubmitting(false)
  }

  if (!hasSupabaseConfig) {
    return (
      <AuthPageFrame>
        <article className="auth-editorial-card auth-editorial-card--status">
          <header className="auth-editorial-card__header">
            <h2 className="auth-editorial-card__title">Configuracion requerida</h2>
            <p className="auth-editorial-card__lead">
              Agrega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>{' '}
              en tu archivo <code>.env</code> para habilitar el acceso de cuentas.
            </p>
          </header>
        </article>
      </AuthPageFrame>
    )
  }

  if (isLoading) {
    return (
      <AuthPageFrame>
        <article className="auth-editorial-card auth-editorial-card--status">
          <header className="auth-editorial-card__header">
            <h2 className="auth-editorial-card__title">Preparando tu acceso</h2>
            <p className="auth-editorial-card__lead">
              Estamos verificando tu sesion para llevarte a tu espacio privado.
            </p>
          </header>
        </article>
      </AuthPageFrame>
    )
  }

  return (
    <AuthPageFrame>
      <>
        {sessionErrorMessage ? (
          <p className="auth-editorial-global-error">{sessionErrorMessage}</p>
        ) : null}

        <AuthForm
          confirmEmail={confirmEmail}
          confirmPassword={confirmPassword}
          email={email}
          errorMessage={errorMessage}
          firstName={firstName}
          infoMessage={effectiveInfoMessage}
          isRecoveryReady={recoverySessionReady}
          isResendingConfirmation={isResendingConfirmation}
          isSubmitting={isSubmitting}
          lastName={lastName}
          mode={mode}
          onConfirmEmailChange={setConfirmEmail}
          onConfirmPasswordChange={setConfirmPassword}
          onEmailChange={setEmail}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onModeChange={updateMode}
          onPasswordChange={setPassword}
          onResendConfirmation={handleResendConfirmation}
          onSubmit={handleSubmit}
          password={password}
          pendingConfirmationEmail={pendingConfirmationEmail}
          pendingPasswordResetEmail={pendingPasswordResetEmail}
        />
      </>
    </AuthPageFrame>
  )
}
