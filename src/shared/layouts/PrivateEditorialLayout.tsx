import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type PrivateEditorialLayoutProps = {
  backLabel: string
  backTo: string
  children: ReactNode
  className?: string
  rightSlot?: ReactNode
}

const footerLinks = ['Nuestra Historia', 'Privacidad', 'Contacto']

export function PrivateEditorialLayout({
  backLabel,
  backTo,
  children,
  className,
  rightSlot,
}: PrivateEditorialLayoutProps) {
  return (
    <section className={className ? `dashboard-studio ${className}` : 'dashboard-studio'}>
      <header className="dashboard-studio__header">
        <div className="dashboard-studio__header-inner">
          <Link className="editorial-back-link" to={backTo}>
            {backLabel}
          </Link>

          <p className="dashboard-studio__brand">WeddVue</p>

          {rightSlot ?? <span className="dashboard-studio__header-spacer" aria-hidden="true" />}
        </div>
      </header>

      <main className="dashboard-studio__main">{children}</main>

      <footer className="dashboard-studio__footer">
        <div className="dashboard-studio__footer-inner">
          <div className="dashboard-studio__footer-brand-block">
            <span className="dashboard-studio__footer-brand">WeddVue</span>
            <p className="dashboard-studio__footer-note">
              © 2024 WeddVue. Un momento para siempre.
            </p>
          </div>

          <div className="dashboard-studio__footer-links">
            {footerLinks.map((label) => (
              <a className="dashboard-studio__footer-link" href="#" key={label}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </section>
  )
}
