import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { flavors } from '../../data/flavors';

const STATS = [
  {
    kicker: String(flavors.length),
    title: 'Flavours',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4.6" />
        <path d="M8.4 11.6 12 22l3.6-10.4" />
        <path d="M9.7 15.2h4.6M10.4 18h3.2" />
      </svg>
    ),
  },
  {
    kicker: 'Fresh &',
    title: 'Natural Ingredients',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 20c6.5-.8 9.5-6.5 11-14-6 .8-11 4.2-11 14Z" />
        <path d="M9.5 14c1.8 0 3.5-1.6 4.4-4.2" />
        <path d="M5 18c2.2-2 3-5.2 3-8" />
      </svg>
    ),
  },
  {
    kicker: 'Premium',
    title: 'Quality',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3.5 14.2 8l5 .7-3.6 3.5.9 5-4.5-2.4L6.5 17.2l.9-5L3.8 8.7l5-.7L12 3.5Z" />
      </svg>
    ),
  },
  {
    kicker: 'Loved by',
    title: 'Ice Cream Fans',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="2.4" />
        <circle cx="16" cy="9" r="2.1" />
        <path d="M3.8 18.5c.6-3.2 2.7-5 5.2-5s4.6 1.8 5.2 5" />
        <path d="M12.8 16.2c.7-1.8 2.2-2.8 4-2.8 2 0 3.6 1.3 4.2 3.6" />
      </svg>
    ),
  },
];

function Spark({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 0c.7 6.4 3.2 11.6 8 16-4.8 4.4-7.3 9.6-8 16-.7-6.4-3.2-11.6-8-16C12.8 11.6 15.3 6.4 16 0Z"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="mm-hero" aria-label="Introduction">
      <div className="mm-hero__scene" aria-hidden="true">
        <img
          className="mm-hero__bg"
          src={images.parlourBg}
          alt=""
          width="2000"
          height="1398"
        />
        <div className="mm-hero__veil" />
      </div>

      <div className="container mm-hero__grid">
        <div className="mm-hero__copy">
          <p className="mm-hero__script">A Scoop of</p>
          <h1>
            Happiness
            <Spark className="mm-hero__spark mm-hero__spark--a" />
            <Spark className="mm-hero__spark mm-hero__spark--b" />
          </h1>
          <p className="mm-hero__ribbon">Premium Ice Creams, Scoops &amp; Sundaes</p>
          <p className="mm-hero__lead">
            Rich flavours, fresh ingredients and irresistible creations for every mood.
          </p>
          <Link to="/menu" className="btn btn--ink mm-hero__cta">
            Explore Menu
            <span aria-hidden="true">{" →"}</span>
          </Link>
        </div>

        <figure className="mm-hero__figure">
          <img
            className="mm-hero__cup"
            src={images.heroWaffle}
            alt="A waffle bowl filled with strawberry, chocolate and vanilla ice cream, chocolate drizzle, a cherry, a wafer and fresh strawberries"
            width="958"
            height="829"
            decoding="async"
          />
        </figure>
      </div>

      <div className="container">
        <ul className="mm-stats">
          {STATS.map((s) => (
            <li key={s.title} className="mm-stats__item">
              <span className="mm-stats__icon">{s.icon}</span>
              <span className="mm-stats__text">
                <strong className="mm-stats__num">{s.kicker}</strong>
                <span className="mm-stats__label">{s.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
