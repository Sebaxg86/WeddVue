import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { EditorialFooter } from '@/shared/components/EditorialFooter'

type PrivateEditorialLayoutProps = {
  backLabel: string
  backTo: string
  children: ReactNode
  className?: string
  rightSlot?: ReactNode
}

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
          <div className="dashboard-studio__header-rail dashboard-studio__header-rail--start">
            <Link
              className="dashboard-studio__header-action dashboard-studio__header-action--back"
              to={backTo}
            >
              <span className="dashboard-studio__header-action-mark" aria-hidden="true">
                &larr;
              </span>
              <span>{backLabel}</span>
            </Link>
          </div>

          <div className="dashboard-studio__header-center">
            <p className="dashboard-studio__brand">WeddVue</p>
          </div>

          <div className="dashboard-studio__header-rail dashboard-studio__header-rail--end">
            {rightSlot ?? (
              <span className="dashboard-studio__header-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-studio__main">{children}</main>

      <EditorialFooter className="dashboard-studio__footer" />
    </section>
  )
}
