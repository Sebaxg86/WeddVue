import { Link } from 'react-router-dom'

type EditorialFooterLink = {
  href?: string
  label: string
  to?: string
}

type EditorialFooterProps = {
  brand?: string
  className?: string
  innerClassName?: string
  links?: EditorialFooterLink[]
  note?: string
  layout?: 'centered' | 'split'
}

function getCurrentYear() {
  return new Date().getFullYear()
}

function buildClassName(...values: Array<string | null | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

export function EditorialFooter({
  brand = 'WeddVue',
  className,
  innerClassName,
  links = [],
  note = `\u00a9 ${getCurrentYear()} WeddVue by Sebastian Glz Chairez`,
  layout = 'centered',
}: EditorialFooterProps) {
  return (
    <footer className={buildClassName('editorial-footer', className)}>
      <div
        className={buildClassName(
          'editorial-footer__inner',
          `editorial-footer__inner--${layout}`,
          innerClassName,
        )}
      >
        <div className="editorial-footer__brand-block">
          <p className="editorial-footer__brand">{brand}</p>
          <p className="editorial-footer__note">{note}</p>
        </div>

        {links.length > 0 ? (
          <div className="editorial-footer__links">
            {links.map((link) =>
              link.to ? (
                <Link className="editorial-footer__link" key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ) : (
                <a
                  className="editorial-footer__link"
                  href={link.href ?? '#'}
                  key={link.label}
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        ) : null}
      </div>
    </footer>
  )
}
