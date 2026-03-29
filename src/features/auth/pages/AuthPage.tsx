import { startTransition, useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthForm, type AuthMode } from '@/features/auth/components/AuthForm'
import { hasSupabaseConfig } from '@/lib/config/env'
import { supabase } from '@/lib/supabase/client'
import {
  isAccountSession,
  useSupabaseSession,
} from '@/lib/supabase/useSupabaseSession'

const footerLinks = ['Nuestra Historia', 'Privacidad', 'Contacto']

type AuthPageStateProps = {
  children: ReactNode
}

function AuthPageFrame({ children }: AuthPageStateProps) {
  return (
    <section className="auth-editorial-page">
      <main className="auth-editorial-page__main">
        <div className="auth-editorial-page__return-row">
          <Link className="editorial-back-link" to="/">
            Volver a la landing
          </Link>
        </div>

        <div className="auth-editorial-page__brand-block">
          <h1 className="auth-editorial-page__brand">WeddVue</h1>
          <p className="auth-editorial-page__subtitle">Un momento para siempre</p>
        </div>

        <div className="auth-editorial-page__content">{children}</div>

        <div className="auth-editorial-page__quote-wrap">
          <p className="auth-editorial-page__quote">"El amor es el alma del hogar."</p>
        </div>

        <div className="auth-editorial-page__visual-anchor" aria-hidden="true">
          <img
            alt=""
            className="auth-editorial-page__visual-image"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf4J9oBYici2KFCynv0nspUbNmpCQCAOSCbDqbTdwHXbORhsoGxH0HrmDbrl1I2SAAL5XP_mf9YH1LYBGnhkKj3b6m-oJePHW545yNid3_GwfnlmfPHHv8uctWu2URcLQi6CrxMKsqFW4_G-7Bo8NVWbqreewqSMPX4FneQBQS4vojaDDGnleFR7ZJw6y5F7o-xzNYskqVOoK0QJkl5jWEvTJ7YhHyMzsdTwtXGHPk6j2t-ofW7gh5E83rg4F2xspPKZhfHe-9A2Q"
          />
        </div>
      </main>

      <footer className="auth-editorial-footer">
        <div className="auth-editorial-footer__brand">WeddVue</div>
        <div className="auth-editorial-footer__links">
          {footerLinks.map((label) => (
            <a className="auth-editorial-footer__link" href="#" key={label}>
              {label}
            </a>
          ))}
        </div>
        <div className="auth-editorial-footer__note">
          © 2024 WeddVue. Un momento para siempre.
        </div>
      </footer>
    </section>
  )
}

export function AuthPage() {
  const navigate = useNavigate()
  const { errorMessage: sessionErrorMessage, isLoading, session } = useSupabaseSession()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isAccountSession(session)) {
      startTransition(() => {
        navigate('/dashboard', { replace: true })
      })
    }
  }, [navigate, session])

  async function handleSubmit() {
    if (!supabase) {
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || password.trim().length < 8) {
      setErrorMessage('Escribe un correo válido y una contraseña de al menos 8 caracteres.')
      setInfoMessage(null)
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setInfoMessage(null)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
      }

      setIsSubmitting(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    if (isAccountSession(data.session ?? null)) {
      startTransition(() => {
        navigate('/dashboard', { replace: true })
      })
    } else {
      setInfoMessage(
        'Tu cuenta fue creada. Si tu proyecto pide confirmación por correo, confirma tu email antes de entrar.',
      )
      setMode('signin')
    }

    setIsSubmitting(false)
  }

  if (!hasSupabaseConfig) {
    return (
      <AuthPageFrame>
        <article className="auth-editorial-card auth-editorial-card--status">
          <header className="auth-editorial-card__header">
            <h2 className="auth-editorial-card__title">Configuración requerida</h2>
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
              Estamos verificando tu sesión para llevarte a tu espacio privado.
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
          email={email}
          errorMessage={errorMessage}
          infoMessage={infoMessage}
          isSubmitting={isSubmitting}
          mode={mode}
          onEmailChange={setEmail}
          onModeChange={(nextMode) => {
            setMode(nextMode)
            setErrorMessage(null)
            setInfoMessage(null)
          }}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          password={password}
        />
      </>
    </AuthPageFrame>
  )
}
