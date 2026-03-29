import { NavLink, Outlet } from 'react-router-dom'

const navigationItems = [
  { label: 'Guest Upload', to: '/upload' },
  { label: 'Admin', to: '/admin' },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" aria-hidden="true" />

      <header className="site-header">
        <div>
          <p className="site-brand">WedSnap</p>
          <p className="site-caption">
            Private wedding uploads powered by QR entry
          </p>
        </div>

        <nav className="site-nav" aria-label="Primary">
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
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  )
}
