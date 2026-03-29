import { Link } from 'react-router-dom'

const landingHighlights = [
  {
    eyebrow: 'Dashboard privado',
    title: 'La pareja entra por el dominio principal',
    copy:
      'Crea tu cuenta, abre tu dashboard y administra todos tus eventos desde una sola experiencia simple.',
  },
  {
    eyebrow: 'Invitados sin friccion',
    title: 'El formulario de fotos vive solo en el QR',
    copy:
      'Los invitados no necesitan buscar enlaces ni navegar por el sitio. Escanean su mesa y llegan directo a subir fotos.',
  },
  {
    eyebrow: 'Trazabilidad elegante',
    title: 'Cada subida queda organizada por evento y mesa',
    copy:
      'Las fotos se vinculan con mesa, nombre y dispositivo para que despues puedan revisarlas con contexto.',
  },
]

export function HomeLandingPage() {
  return (
    <section className="landing">
      <div className="landing__hero page-grid">
        <div className="page-copy landing__copy">
          <p className="eyebrow">Plataforma privada para bodas</p>
          <h1 className="page-title landing__title">
            Convierte cada mesa en un recuerdo compartido.
          </h1>
          <p className="page-lead landing__lead">
            Crea eventos, genera codigos QR por mesa y recibe fotos privadas de
            tus invitados sin pedirles cuenta ni complicarles el momento.
          </p>

          <div className="button-row">
            <Link className="button landing__cta" to="/auth">
              Me voy a casar
            </Link>
            <Link className="button button--secondary" to="/auth">
              Ya tengo cuenta
            </Link>
          </div>

          <p className="helper-copy landing__note">
            Si eres invitado, no necesitas entrar aqui: solo escanea el QR de tu
            mesa y llegas directo a subir fotos.
          </p>
        </div>

        <div className="landing__cards">
          {landingHighlights.map((highlight) => (
            <article className="panel landing-card" key={highlight.title}>
              <p className="eyebrow">{highlight.eyebrow}</p>
              <h2 className="panel-title">{highlight.title}</h2>
              <p className="panel-subtitle">{highlight.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
