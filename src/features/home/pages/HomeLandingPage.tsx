import { Link } from 'react-router-dom'

import { HomeHeroCarousel } from '@/features/home/components/HomeHeroCarousel'
import { EditorialFooter } from '@/shared/components/EditorialFooter'

export function HomeLandingPage() {
  return (
    <div className="landing-stitch">
      <header className="landing-stitch__header">
        <div className="landing-stitch__header-inner">
          <p className="landing-stitch__brand">WeddVue</p>
        </div>
      </header>

      <main className="landing-stitch__main">
        <section className="landing-stitch__hero">
          <span className="landing-stitch__eyebrow">Recuerdos que perduran</span>

          <h1 className="landing-stitch__title">
            Toda la belleza de tu historia, capturada por quienes amas.
          </h1>

          <p className="landing-stitch__lead">
            Preserva los momentos más íntimos y espontáneos de tu boda, capturados por
            los que más te quieren.
          </p>

          <div className="landing-stitch__media">
            <HomeHeroCarousel />
          </div>

          <div className="landing-stitch__actions">
            <Link className="landing-stitch__primary-button" to="/auth?mode=signup">
              Me voy a casar
            </Link>

            <Link className="landing-stitch__secondary-link" to="/auth?mode=signin">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        <section className="landing-stitch__quote-section">
          <div className="landing-stitch__quote-wrap">
            <blockquote className="landing-stitch__quote">
              "Lo que se ve con el corazón queda grabado para siempre."
            </blockquote>
            <cite className="landing-stitch__quote-cite">WeddVue Anthology</cite>
          </div>
        </section>
      </main>

      <EditorialFooter className="landing-stitch__footer" />
    </div>
  )
}
