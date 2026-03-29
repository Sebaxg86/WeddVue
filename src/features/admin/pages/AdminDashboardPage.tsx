const adminCapabilities = [
  'Private sign-in with Supabase Auth',
  'Review batches by guest name and table QR',
  'Favorite, download, and curate submitted photos',
  'Filter by table, upload time, and device traceability',
]

export function AdminDashboardPage() {
  return (
    <section className="page-grid">
      <div className="page-copy">
        <p className="eyebrow">Admin surface</p>
        <h1 className="page-title">Private moderation space for the couple.</h1>
        <p className="page-lead">
          This route is ready to become the authenticated dashboard. The next
          integration step is wiring Supabase Auth and querying the private
          tables and storage bucket.
        </p>
      </div>

      <div className="panel-stack">
        <article className="panel">
          <h2 className="panel-title">What this area will do</h2>
          <ul className="feature-list">
            {adminCapabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2 className="panel-title">Security posture</h2>
          <div className="metric-grid">
            <div className="metric-card">
              <span className="metric-label">Storage</span>
              <strong className="metric-value">Private bucket</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Access</span>
              <strong className="metric-value">Admin-only RLS</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Traceability</span>
              <strong className="metric-value">Batch + device context</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
