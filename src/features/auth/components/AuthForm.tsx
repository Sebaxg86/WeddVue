import type { FormEvent } from 'react'

export type AuthMode = 'signin' | 'signup'

type AuthFormProps = {
  email: string
  errorMessage: string | null
  infoMessage: string | null
  isSubmitting: boolean
  mode: AuthMode
  onEmailChange: (value: string) => void
  onModeChange: (mode: AuthMode) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => Promise<void>
  password: string
}

export function AuthForm({
  email,
  errorMessage,
  infoMessage,
  isSubmitting,
  mode,
  onEmailChange,
  onModeChange,
  onPasswordChange,
  onSubmit,
  password,
}: AuthFormProps) {
  const isSignUp = mode === 'signup'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <article className="auth-editorial-card">
      <div className="auth-editorial-card__accent" aria-hidden="true" />

      <header className="auth-editorial-card__header">
        <h2 className="auth-editorial-card__title">
          {isSignUp ? 'Crea tu espacio privado' : 'Bienvenido a su celebración'}
        </h2>
        <p className="auth-editorial-card__lead">
          {isSignUp
            ? 'Cree su cuenta para empezar a organizar sus eventos, mesas y códigos QR en un espacio íntimo y privado.'
            : 'Por favor, introduzca sus credenciales para acceder a su espacio privado.'}
        </p>
      </header>

      <form className="auth-editorial-form" onSubmit={handleSubmit}>
        <div className="auth-editorial-field">
          <label className="auth-editorial-field__label" htmlFor="auth-email">
            Correo Electrónico
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

        <div className="auth-editorial-field">
          <label className="auth-editorial-field__label" htmlFor="auth-password">
            Contraseña
          </label>
          <input
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="auth-editorial-field__input"
            id="auth-password"
            minLength={8}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="••••••••"
            type="password"
            value={password}
          />
        </div>

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

        <div className="auth-editorial-form__actions">
          <button className="auth-editorial-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? isSignUp
                ? 'Creando cuenta...'
                : 'Entrando...'
              : isSignUp
                ? 'Crear mi cuenta'
                : 'Entrar'}
          </button>

          {!isSignUp ? (
            <div className="auth-editorial-form__meta">
              <button className="auth-editorial-form__link" type="button">
                ¿Olvidó su contraseña?
              </button>
            </div>
          ) : null}
        </div>
      </form>

      <div className="auth-editorial-card__toggle">
        <p className="auth-editorial-card__toggle-copy">
          {isSignUp ? '¿Ya tiene una cuenta?' : '¿Aún no tiene una cuenta?'}
        </p>
        <button
          className="auth-editorial-card__toggle-button"
          onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')}
          type="button"
        >
          {isSignUp ? 'Iniciar sesión' : 'Crear mi cuenta'}
        </button>
      </div>
    </article>
  )
}
