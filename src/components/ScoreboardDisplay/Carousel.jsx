import { useScoreboard } from '../../context/ScoreboardContext'

export default function Carousel() {
  const { state } = useScoreboard()
  const { carouselImages } = state

  if (!carouselImages || carouselImages.length === 0) {
    return (
      <section className="carousel-section">
        <div className="carousel-empty">Sponsor Area</div>
      </section>
    )
  }

  // Duplicate images to create seamless infinite scroll
  const doubled = [...carouselImages, ...carouselImages]

  return (
    <section className="carousel-section">
      <div className="carousel-inner">
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Sponsor ${(i % carouselImages.length) + 1}`}
            className="carousel-img"
          />
        ))}
      </div>
    </section>
  )
}
