import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export function AppShell() {
  const location = useLocation()
  const isLandingRoute = location.pathname === '/'
  const isGuestRoute = location.pathname.startsWith('/upload')
  const isAuthRoute = location.pathname.startsWith('/auth')
  const isDashboardRoute =
    location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')
  const isStandaloneRoute = isLandingRoute || isAuthRoute || isDashboardRoute || isGuestRoute

  const navigationItems = isGuestRoute
    ? []
    : isDashboardRoute
      ? [
          { label: 'Volver al inicio', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
        ]
      : [{ label: 'Volver al inicio', to: '/' }]

  const caption = isGuestRoute
    ? 'Acceso exclusivo desde el QR de tu mesa'
    : isDashboardRoute
      ? 'Tu panel privado para eventos, mesas y QR'
      : isAuthRoute
        ? 'Crea tu cuenta o entra a tu dashboard'
        : 'Recuerdos privados para bodas y celebraciones'

  return (
    <div
      className={
        isLandingRoute
          ? 'app-shell app-shell--landing'
          : isAuthRoute
            ? 'app-shell app-shell--auth'
            : isGuestRoute
              ? 'app-shell app-shell--guest'
            : isDashboardRoute
              ? 'app-shell app-shell--dashboard'
              : 'app-shell'
      }
    >
      {isStandaloneRoute ? null : <div className="app-shell__backdrop" aria-hidden="true" />}

      {isStandaloneRoute ? null : (
        <header className="site-header">
          <div>
            <Link className="site-brand-link" to="/">
              <p className="site-brand">WeddVue</p>
            </Link>
            <p className="site-caption">{caption}</p>
          </div>

          {navigationItems.length > 0 ? (
            <nav className="site-nav" aria-label="Principal">
              {navigationItems.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                  key={item.to}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          ) : null}
        </header>
      )}

      <main
        className={
          isLandingRoute
            ? 'site-main site-main--landing'
            : isAuthRoute
              ? 'site-main site-main--auth'
              : isGuestRoute
                ? 'site-main site-main--guest'
              : isDashboardRoute
                ? 'site-main site-main--dashboard'
                : 'site-main'
        }
      >
        <Outlet />
      </main>
    </div>
  )
}
