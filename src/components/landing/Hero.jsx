import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { flavors } from '../../data/flavors';
import { LOCATIONS } from '../../data/locations';

const STATS = [
  {
    title: `${flavors.length} Signature Flavours`,
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="5" />
        <path d="M8 12 12 22 16 12" />
        <path d="M9.6 15.4h4.8M10.3 18.2h3.4" />
      </svg>
    ),
  },
  {
    title: 'Fresh & Natural Ingredients',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 20c8-1 11-8 13-16-7 1-13 5-13 16Z" />
        <path d="M8 13c2 0 4-2 5-5" />
      </svg>
    ),
  },
  {
    title: 'Slow-churned Daily',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z" />
      </svg>
    ),
  },
  {
    title: `${LOCATIONS.length} Parlours`,
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    ),
  },
];

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
            <svg className="mm-hero__splash" viewBox="0 0 72 56" aria-hidden="true">
              <path fill="currentColor" d="M18 8c6 2 8 10 6 16-4-6-12-8-16-6 6-2 8-8 10-10Zm28 2c10 4 14 16 10 26-8-10-22-12-28-8 10-4 14-14 18-18Zm-8 28c6 6 6 16 2 22-4-8-14-10-20-6 6-2 10-10 18-16Z" />
            </svg>
          </h1>
          <p className="mm-hero__ribbon">Premium Ice Creams, Scoops &amp; Sundaes</p>
          <p className="mm-hero__lead">
            Small-batch ice cream, made every morning from ripe fruit, real cacao and fresh cream.
          </p>
          <Link to="/menu" className="btn btn--ink mm-hero__cta">
            Explore Menu
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <figure className="mm-hero__figure">
          <img
            className="mm-hero__cup"
            src={images.heroCup}
            alt="A white cup overflowing with mango and vanilla ice cream, mango sauce, a wafer stick and fresh mango"
            width="1400"
            height="1236"
          />
        </figure>
      </div>

      <div className="container">
        <ul className="mm-stats">
          {STATS.map((s) => (
            <li key={s.title} className="mm-stats__item">
              <span className="mm-stats__icon">{s.icon}</span>
              <span className="mm-stats__label">{s.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
