import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="panel panel--centered">
      <p className="eyebrow">Route not found</p>
      <h1 className="page-title">This page is not part of the wedding flow.</h1>
      <p className="page-lead">
        The route does not exist yet. Head back to the upload or admin prototype.
      </p>
      <div className="button-row">
        <Link className="button" to="/upload">
          Go to upload
        </Link>
        <Link className="button button--secondary" to="/admin">
          Open admin preview
        </Link>
      </div>
    </section>
  )
}
