import type { FormEvent } from 'react'

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset'

type AuthFormProps = {
  confirmEmail: string
  confirmPassword: string
  email: string
  errorMessage: string | null
  firstName: string
  infoMessage: string | null
  isRecoveryReady: boolean
  isResendingConfirmation: boolean
  isSubmitting: boolean
  lastName: string
  mode: AuthMode
  onConfirmEmailChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onEmailChange: (value: string) => void
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onModeChange: (mode: AuthMode) => void
  onPasswordChange: (value: string) => void
  onResendConfirmation: () => Promise<void>
  onSubmit: () => Promise<void>
  password: string
  pendingConfirmationEmail: string | null
  pendingPasswordResetEmail: string | null
}

function buildTitle(mode: AuthMode) {
  if (mode === 'signup') {
    return 'Crea tu espacio'
  }

  if (mode === 'forgot') {
    return 'Recupera tu acceso'
  }

  if (mode === 'reset') {
    return 'Elige una nueva contrasena'
  }

  return 'Bienvenido de nuevo'
}

function buildLead(mode: AuthMode) {
  if (mode === 'signup') {
    return 'Abre tu cuenta para empezar a organizar eventos, mesas y codigos QR con una experiencia privada.'
  }

  if (mode === 'forgot') {
    return 'Te enviaremos un enlace seguro para restablecer tu contrasena y volver a tu atelier.'
  }

  if (mode === 'reset') {
    return 'Define una nueva contrasena para recuperar tu acceso y volver a tu panel privado.'
  }

  return 'Introduce tus credenciales para entrar a tu atelier privado.'
}

function buildSubmitLabel(mode: AuthMode, isSubmitting: boolean) {
  if (mode === 'signup') {
    return isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'
  }

  if (mode === 'forgot') {
    return isSubmitting ? 'Enviando enlace...' : 'Enviar enlace'
  }

  if (mode === 'reset') {
    return isSubmitting ? 'Guardando contrasena...' : 'Guardar nueva contrasena'
  }

  return isSubmitting ? 'Entrando...' : 'Entrar'
}

export function AuthForm({
  confirmEmail,
  confirmPassword,
  email,
  errorMessage,
  firstName,
  infoMessage,
  isRecoveryReady,
  isResendingConfirmation,
  isSubmitting,
  lastName,
  mode,
  onConfirmEmailChange,
  onConfirmPasswordChange,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onModeChange,
  onPasswordChange,
  onResendConfirmation,
  onSubmit,
  password,
  pendingConfirmationEmail,
  pendingPasswordResetEmail,
}: AuthFormProps) {
  const isSignUp = mode === 'signup'
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <article className="auth-editorial-card">
      <div className="auth-editorial-card__accent" aria-hidden="true" />

      <header className="auth-editorial-card__header">
        <h2 className="auth-editorial-card__title">{buildTitle(mode)}</h2>
        <p className="auth-editorial-card__lead">{buildLead(mode)}</p>
      </header>

      <form className="auth-editorial-form" onSubmit={handleSubmit}>
        {isSignUp ? (
          <div className="auth-editorial-form__field-grid">
            <div className="auth-editorial-field">
              <label className="auth-editorial-field__label" htmlFor="auth-first-name">
                Nombre
              </label>
              <input
                autoComplete="given-name"
                className="auth-editorial-field__input"
                id="auth-first-name"
                onChange={(event) => onFirstNameChange(event.target.value)}
                placeholder="Sofia"
                type="text"
                value={firstName}
              />
            </div>

            <div className="auth-editorial-field">
              <label className="auth-editorial-field__label" htmlFor="auth-last-name">
                Apellidos
              </label>
              <input
                autoComplete="family-name"
                className="auth-editorial-field__input"
                id="auth-last-name"
                onChange={(event) => onLastNameChange(event.target.value)}
                placeholder="Hernandez Ruiz"
                type="text"
                value={lastName}
              />
            </div>
          </div>
        ) : null}

        {!isReset ? (
          <div className="auth-editorial-field">
            <label className="auth-editorial-field__label" htmlFor="auth-email">
              Correo electronico
            </label>
            <input
              autoComplete="email"
              className="auth-editorial-field__input"
              id="auth-email"
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="nombre@ejemplo.com"
              type="email"
              value={email}
            />
          </div>
        ) : null}

        {isSignUp ? (
          <div className="auth-editorial-field">
            <label className="auth-editorial-field__label" htmlFor="auth-email-confirm">
              Confirmar correo
            </label>
            <input
              autoComplete="email"
              className="auth-editorial-field__input"
              id="auth-email-confirm"
              onChange={(event) => onConfirmEmailChange(event.target.value)}
              placeholder="Repite tu correo"
              type="email"
              value={confirmEmail}
            />
          </div>
        ) : null}

        {!isForgot ? (
          <div className="auth-editorial-field">
            <label className="auth-editorial-field__label" htmlFor="auth-password">
              Contrasena
            </label>
            <input
              autoComplete={isSignUp || isReset ? 'new-password' : 'current-password'}
              className="auth-editorial-field__input"
              id="auth-password"
              minLength={8}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
            />
          </div>
        ) : null}

        {isSignUp || isReset ? (
          <div className="auth-editorial-field">
            <label className="auth-editorial-field__label" htmlFor="auth-password-confirm">
              Confirmar contrasena
            </label>
            <input
              autoComplete="new-password"
              className="auth-editorial-field__input"
              id="auth-password-confirm"
              minLength={8}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              placeholder="Repite tu contrasena"
              type="password"
              value={confirmPassword}
            />
          </div>
        ) : null}

        {errorMessage ? (
          <p className="auth-editorial-message auth-editorial-message--error">
            {errorMessage}
          </p>
        ) : null}

        {infoMessage ? (
          <p className="auth-editorial-message auth-editorial-message--success">
            {infoMessage}
          </p>
        ) : null}

        {mode === 'signin' && pendingConfirmationEmail ? (
          <div className="auth-editorial-form__assist">
            <p className="auth-editorial-form__assist-copy">
              Si no ves el correo de confirmacion en <strong>{pendingConfirmationEmail}</strong>,
              puedes reenviarlo ahora.
            </p>

            <button
              className="auth-editorial-form__secondary-button"
              disabled={isResendingConfirmation}
              onClick={() => void onResendConfirmation()}
              type="button"
            >
              {isResendingConfirmation ? 'Reenviando...' : 'Reenviar confirmacion'}
            </button>
          </div>
        ) : null}

        {isForgot && pendingPasswordResetEmail ? (
          <div className="auth-editorial-form__assist">
            <p className="auth-editorial-form__assist-copy">
              El enlace de recuperacion fue enviado a <strong>{pendingPasswordResetEmail}</strong>.
              Si no lo ves, revisa spam o vuelve a solicitarlo.
            </p>
          </div>
        ) : null}

        {isReset && !isRecoveryReady ? (
          <div className="auth-editorial-form__assist">
            <p className="auth-editorial-form__assist-copy">
              Este enlace de recuperacion ya no esta activo. Solicita uno nuevo para continuar.
            </p>

            <button
              className="auth-editorial-form__secondary-button"
              onClick={() => onModeChange('forgot')}
              type="button"
            >
              Solicitar nuevo enlace
            </button>
          </div>
        ) : null}

        <div className="auth-editorial-form__actions">
          <button
            className="auth-editorial-form__submit"
            disabled={isSubmitting || (isReset && !isRecoveryReady)}
            type="submit"
          >
            {buildSubmitLabel(mode, isSubmitting)}
          </button>

          {mode === 'signin' ? (
            <div className="auth-editorial-form__meta">
              <button
                className="auth-editorial-form__link"
                onClick={() => onModeChange('forgot')}
                type="button"
              >
                Olvide mi contrasena
              </button>
            </div>
          ) : null}
        </div>
      </form>

      <div className="auth-editorial-card__toggle">
        {mode === 'signup' ? (
          <>
            <p className="auth-editorial-card__toggle-copy">Ya tienes una cuenta?</p>
            <button
              className="auth-editorial-card__toggle-button"
              onClick={() => onModeChange('signin')}
              type="button"
            >
              Iniciar sesion
            </button>
          </>
        ) : mode === 'signin' ? (
          <>
            <p className="auth-editorial-card__toggle-copy">Aun no tienes una cuenta?</p>
            <button
              className="auth-editorial-card__toggle-button"
              onClick={() => onModeChange('signup')}
              type="button"
            >
              Crear mi cuenta
            </button>
          </>
        ) : (
          <>
            <p className="auth-editorial-card__toggle-copy">
              {isForgot
                ? 'Recordaste tu contrasena?'
                : 'Prefieres volver a la entrada principal?'}
            </p>
            <button
              className="auth-editorial-card__toggle-button"
              onClick={() => onModeChange('signin')}
              type="button"
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </article>
  )
}
