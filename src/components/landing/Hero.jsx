import { Link } from 'react-router-dom';
import { images } from '../../data/images';

const PERKS = [
  {
    title: 'Real fruit',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21c5 0 8-4.2 8-9.2C20 6.5 16.5 3 12 3S4 6.5 4 11.8C4 16.8 7 21 12 21Z" />
        <path d="M12 3c1.2-1.8 3.4-2 4.6-1" />
      </svg>
    ),
  },
  {
    title: 'Slow-churned daily',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3h8" />
        <path d="M12 3v6" />
        <path d="M7 9h10l-1.2 10.2A2 2 0 0 1 13.8 21h-3.6a2 2 0 0 1-2-1.8L7 9Z" />
      </svg>
    ),
  },
  {
    title: 'Nothing artificial',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 19c8-1 13-8 14-15-8 1-14 7-14 15Z" />
        <path d="M5 19c2-4 6-8 12-10" />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section className="mm-hero">
      <div className="container mm-hero__grid">
        <div className="mm-hero__copy">
          <p className="mm-hero__label">Premium Ice Cream Cafe</p>
          <h1>
            Life is Better with
            <em>
              Mango Ice Cream
              <svg className="mm-hero__swoosh" viewBox="0 0 280 12" fill="none" aria-hidden="true" preserveAspectRatio="none">
                <path d="M2 9c48-6 96-8 148-6 42 1.5 86 4 128 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </em>
          </h1>
          <p className="mm-hero__lead">
            Small-batch ice cream, made every morning from ripe fruit, real cacao and fresh cream.
          </p>
          <div className="hero__cta">
            <Link to="/menu" className="mm-hero__btn">
              Explore flavours
            </Link>
            <Link to="/visit" className="mm-hero__btn mm-hero__btn--ghost">
              Find a parlour
            </Link>
          </div>
          <ul className="mm-hero__perks">
            {PERKS.map((p) => (
              <li key={p.title}>
                <span className="mm-hero__perk-icon" aria-hidden="true">{p.icon}</span>
                {p.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="mm-hero__visual">
          <figure className="mm-hero__cutout">
            <img
              src={images.heroBowl}
              alt="A bowl of ice cream scoops in a sprinkle-covered dish"
              width="1200"
              height="1027"
              fetchPriority="high"
              decoding="async"
            />
          </figure>
          <p className="mm-hero__note" aria-hidden="true">Scoop happiness every day</p>
        </div>
      </div>
    </section>
  );
}
