import { Link } from 'react-router-dom';
import { images } from '../../data/images';

export default function Hero() {
  return (
    <section className="mm-hero">
      <div className="container mm-hero__grid">
        <div className="mm-hero__copy">
          <span className="eyebrow lp-anim" style={{ '--d': '0.06s' }}>
            Artisan Creamery · Since 2016
          </span>
          <h1 className="lp-anim" style={{ '--d': '0.14s' }}>
            Slow-churned.
            <span>Sun-ripened.</span>
          </h1>
          <p className="mm-hero__lead lp-anim" style={{ '--d': '0.26s' }}>
            Small-batch ice cream, made every morning from ripe fruit, real cacao and fresh cream.
          </p>
          <div className="hero__cta lp-anim" style={{ '--d': '0.38s' }}>
            <Link to="/menu" className="mm-hero__btn">
              Explore flavours
            </Link>
            <Link to="/visit" className="mm-hero__text-link">
              Find a parlour
            </Link>
          </div>
          <p className="mm-hero__trust lp-anim" style={{ '--d': '0.48s' }}>
            <span>4.9 guest rating</span>
            <span>Three parlours</span>
          </p>
        </div>

        <figure className="mm-hero__figure lp-anim" style={{ '--d': '0.18s' }}>
          <img
            src={images.heroCone}
            alt="A hand holding a freshly scooped waffle cone against a sunlit yellow backdrop"
            width="800"
            height="1000"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}
