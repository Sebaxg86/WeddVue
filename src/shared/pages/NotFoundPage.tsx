import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="panel panel--centered">
      <p className="eyebrow">Ruta no encontrada</p>
      <h1 className="page-title">Esta pagina no forma parte del flujo actual.</h1>
      <p className="page-lead">
        Vuelve al inicio o entra a tu dashboard para continuar.
      </p>
      <div className="button-row">
        <Link className="button" to="/">
          Volver al inicio
        </Link>
        <Link className="button button--secondary" to="/dashboard">
          Abrir dashboard
        </Link>
      </div>
    </section>
  )
}
