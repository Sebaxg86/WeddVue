import { Link } from 'react-router-dom'

const footerLinks = ['Nuestra Historia', 'Privacidad', 'Contacto']

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
          <span className="landing-stitch__eyebrow">Una Experiencia Privada</span>

          <h1 className="landing-stitch__title">
            Toda la belleza de tu historia, capturada por quienes amas.
          </h1>

          <p className="landing-stitch__lead">
            Preserva los momentos más íntimos y espontáneos de tu boda en una
            galería compartida, privada y eterna.
          </p>

          <div className="landing-stitch__media">
            <div className="landing-stitch__hero-image-frame">
              <img
                alt="Fotografía editorial de una pareja de boda en un momento íntimo"
                className="landing-stitch__hero-image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmRE07iEywGTJtrX8MRqpS6kOv_YdRiAOZWw51O4EnWNP-pYD91DT5z7k9kIC7EOT_5CAVuZqDwoPxk3rGEWXWHd_nh2CBiETWowxrfuP_k-aDd6CrjAQ5F6j__BZDyYcvpu8gRP3JAKGKj7fExOdGQh_q9aQp1SDbetNu1S3PEIJSJIGPIhuiHU_RN_fWKa_ECVamL9sbLjGAiGlk9AOEFohLUdoUJouYO-yJi41QQFqxIFKN2TinspbxnbmV65PEMjMDN3q7Fw0"
              />
            </div>

            <div className="landing-stitch__accent-card" aria-hidden="true">
              <img
                alt=""
                className="landing-stitch__accent-image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_Rk7m2zGIcWRHKOdz9cudl2zUIsztr0ytsjAstkccow4axZ1RDsionFVxmlUZuUUSFDdque05XRrkBG9q16qRB5QXVdUgvHLgBGOsrRzpUCxPHV7HmzbEpWzidRUkfjE50SST9qUuVa1st1yanewlJS7qPr3sRIA9pGg7V33JUH61JNnVbTlhMACulNvjvXimjngNwgXHkD6uFPJhJq4kjVfVPuRR9sF93eUFC1HD-jE-E432R2nCKhj2nsoA7KNl8uERxPrDaOw"
              />
            </div>
          </div>

          <div className="landing-stitch__actions">
            <Link className="landing-stitch__primary-button" to="/auth">
              Me voy a casar
            </Link>

            <Link className="landing-stitch__secondary-link" to="/auth">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        <section className="landing-stitch__quote-section">
          <div className="landing-stitch__quote-wrap">
            <blockquote className="landing-stitch__quote">
              “Lo que se ve con el corazón queda grabado para siempre.”
            </blockquote>
            <cite className="landing-stitch__quote-cite">WeddVue Anthology</cite>
          </div>
        </section>
      </main>

      <footer className="landing-stitch__footer">
        <div className="landing-stitch__footer-inner">
          <p className="landing-stitch__footer-brand">WeddVue</p>

          <div className="landing-stitch__footer-links">
            {footerLinks.map((label) => (
              <a className="landing-stitch__footer-link" href="#" key={label}>
                {label}
              </a>
            ))}
          </div>

          <p className="landing-stitch__footer-note">
            © 2024 WeddVue. Un legado de amor.
          </p>
        </div>
      </footer>
    </div>
  )
}
