import { useEffect, useMemo, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

type HomeCarouselSlide = {
  id: string
  alt: string
  desktopSrc: string
  mobileSrc: string
}

const desktopImages = import.meta.glob(
  '../../../assets/home-carousel/desktop/*.{webp,avif}',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>

const mobileImages = import.meta.glob(
  '../../../assets/home-carousel/mobile/*.{webp,avif}',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>

const fallbackSlides: HomeCarouselSlide[] = [
  {
    id: 'fallback-1',
    alt: 'Fotografia editorial de boda frente al mar',
    desktopSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAV4houBuNn6q_c0GBsNX3vOs4l3sjvDNPDC2_wEbG74M_kxpIVPHOWkvbaW2S0lQDASeRbs6y4G4_7Uq3zzA9biv9cUMxsXAAgEFdhmKGi0YZ8HuaLdjM2AhFCSHD0TDf0FX0HxwJ_LWj23cM9U0IVUh1-SWrocH66af1bJIIOWRk711NYrYHDS-ZL9gT9sK-nNXsZ3p1VbeVa3q5AmUH49qn6Q7VapfzYsRiqYSoPJUSPTOiOV8d8SQsPuEyRpQUl1VmfZFv_nmg',
    mobileSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrQKeOiD2GIG0of1wEtLeGV_vjfxgGO0i7SGExWNAwN9WUW-bBrh69vEQdVPyaPnPo7MMDmxxvat4cTe6SluInQvbrCH4J1Qpdm-olhERgHn4xs3Zais2rE3mikpa7wi01OolKPEc2JUH0dLrKl1GLR5u295wpuJToytoIimApIQMZ_6DO5PnfQJL9teJ-vg0kRJgkuX2JJJo-Fz0OYhZzg-JOkTnssZeY_TAkBi8YBiirEc55B3PUh-egnCp2nzNIrEWQjcGSONU',
  },
]

const slideAltById: Record<string, string> = {
  '1': 'Ceremonia de boda en playa al atardecer',
  '2': 'Recepcion elegante frente al oceano al atardecer',
  '3': 'Recepcion de boda en jardin con luces calidas',
  '4': 'Celebracion de boda en interior con iluminacion de velas',
  '5': 'Boda en exterior con paisaje costero y luz dorada',
  '6': 'Cena de boda en patio de hacienda con iluminacion calida',
  '7': 'Brunch elegante de boda frente al mar',
  '8': 'Primer baile de boda al aire libre de noche',
  '9': 'Detalle editorial de mesa y decoracion de boda',
  '10': 'Retrato editorial de pareja de boda al atardecer',
}

function getSlideId(assetPath: string) {
  const fileStem = assetPath.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''

  return fileStem
    .toLowerCase()
    .replace(/-(desktop|mobile)$/i, '')
    .replace(/^home-slide-?/i, '')
    .replace(/^slide-?/i, '')
    .replace(/^0+(\d+)$/, '$1')
    .trim()
}

function sortSlideIds(left: string, right: string) {
  const leftNumber = Number(left)
  const rightNumber = Number(right)

  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber) && leftNumber !== rightNumber) {
    return leftNumber - rightNumber
  }

  return left.localeCompare(right, undefined, { numeric: true })
}

function buildSlides(): HomeCarouselSlide[] {
  const desktopById = new Map(
    Object.entries(desktopImages).map(([assetPath, assetUrl]) => [getSlideId(assetPath), assetUrl]),
  )
  const mobileById = new Map(
    Object.entries(mobileImages).map(([assetPath, assetUrl]) => [getSlideId(assetPath), assetUrl]),
  )

  const slideIds = Array.from(
    new Set([...desktopById.keys(), ...mobileById.keys()].filter(Boolean)),
  ).sort(sortSlideIds)

  const localSlides = slideIds
    .map((slideId) => {
      const desktopSrc = desktopById.get(slideId)
      const mobileSrc = mobileById.get(slideId)

      if (!desktopSrc || !mobileSrc) {
        return null
      }

      return {
        id: slideId,
        alt: slideAltById[slideId] ?? 'Fotografia editorial de boda',
        desktopSrc,
        mobileSrc,
      }
    })
    .filter((slide): slide is HomeCarouselSlide => slide !== null)

  return localSlides.length > 0 ? localSlides : fallbackSlides
}

export function HomeHeroCarousel() {
  const slides = useMemo(() => buildSlides(), [])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    duration: 32,
    loop: slides.length > 1,
  })

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    const syncSelectedIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    syncSelectedIndex()
    emblaApi.on('select', syncSelectedIndex)
    emblaApi.on('reInit', syncSelectedIndex)

    return () => {
      emblaApi.off('select', syncSelectedIndex)
      emblaApi.off('reInit', syncSelectedIndex)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || slides.length < 2 || isPaused) {
      return
    }

    const autoplayInterval = window.setInterval(() => {
      emblaApi.scrollNext()
    }, 5800)

    return () => {
      window.clearInterval(autoplayInterval)
    }
  }, [emblaApi, isPaused, slides.length])

  return (
    <div
      className="landing-stitch__carousel-shell"
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="landing-stitch__hero-image-frame">
        <div className="landing-stitch__carousel-viewport" ref={emblaRef}>
          <div className="landing-stitch__carousel-track">
            {slides.map((slide, index) => (
              <div className="landing-stitch__carousel-slide" key={slide.id}>
                <picture className="landing-stitch__hero-picture">
                  <source media="(min-width: 900px)" srcSet={slide.desktopSrc} />
                  <img
                    alt={slide.alt}
                    className={`landing-stitch__hero-image${index === selectedIndex ? ' is-active' : ''}`}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    src={slide.mobileSrc}
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="landing-stitch__carousel-controls" aria-label="Seleccionar imagen del carrusel">
          <div className="landing-stitch__carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                aria-label={`Ir a la imagen ${index + 1}`}
                className={`landing-stitch__carousel-dot${index === selectedIndex ? ' is-active' : ''}`}
                onClick={() => emblaApi?.scrollTo(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
