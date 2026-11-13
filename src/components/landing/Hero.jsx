import { Link } from 'react-router-dom';
import { images } from '../../data/images';

const FEATURES = [
  {
    title: 'Real fruit',
    text: 'Hand-pulped Alphonso mangoes and seasonal fruit, never from a tin.',
    icon: 'fruit',
  },
  {
    title: 'Slow-churned',
    text: 'Small batches every morning for a denser, creamier scoop.',
    icon: 'churn',
  },
  {
    title: 'Nothing artificial',
    text: 'No artificial colours or flavours — just ripe fruit and fresh cream.',
    icon: 'leaf',
  },
  {
    title: 'Three parlours',
    text: 'Visit us in Hyderabad, Bengaluru and Mumbai, seven days a week.',
    icon: 'pin',
  },
];

function FeatureIcon({ name }) {
  if (name === 'fruit') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21c5 0 8-4.2 8-9.2C20 6.5 16.5 3 12 3S4 6.5 4 11.8C4 16.8 7 21 12 21Z" />
        <path d="M12 3c1.2-1.8 3.4-2 4.6-1" />
        <path d="M12 8v13" />
      </svg>
    );
  }
  if (name === 'churn') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3h8" />
        <path d="M12 3v6" />
        <path d="M7 9h10l-1.2 10.2A2 2 0 0 1 13.8 21h-3.6a2 2 0 0 1-2-1.8L7 9Z" />
        <path d="M9.5 13h5" />
      </svg>
    );
  }
  if (name === 'leaf') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 19c8-1 13-8 14-15-8 1-14 7-14 15Z" />
        <path d="M5 19c2-4 6-8 12-10" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-5.6 7-11.2A7 7 0 0 0 5 9.8C5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="mm-hero">
      <div className="container">
        <div className="mm-hero__grid">
          <div className="mm-hero__copy">
            <p className="mm-hero__script lp-anim" style={{ '--d': '0.06s' }}>
              Slow-churned, sun-ripened
            </p>
            <h1 className="lp-anim" style={{ '--d': '0.14s' }}>
              Life is Better
              <span>with</span>
              <em>Mango Ice Cream</em>
            </h1>
            <p className="mm-hero__lead lp-anim" style={{ '--d': '0.26s' }}>
              Small-batch ice cream, made every morning from ripe fruit, real cacao and fresh cream.
            </p>
            <div className="hero__cta lp-anim" style={{ '--d': '0.38s' }}>
              <Link to="/menu" className="mm-hero__btn">
                Explore flavours
              </Link>
              <Link to="/visit" className="mm-hero__btn mm-hero__btn--ghost">
                Find a parlour
              </Link>
            </div>
          </div>

          <div className="mm-hero__visual lp-anim" style={{ '--d': '0.18s' }}>
            <div className="mm-hero__blob" aria-hidden="true" />
            <div className="mm-hero__blob mm-hero__blob--soft" aria-hidden="true" />
            <figure className="mm-hero__photo">
              <img
                src={images.mangoScoops}
                alt="Three scoops of mango ice cream on a ceramic pedestal dish"
                width="800"
                height="1000"
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          </div>
        </div>

        <ul className="mm-features">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className="mm-feature lp-anim"
              style={{ '--d': `${0.42 + i * 0.07}s` }}
            >
              <span className="mm-feature__icon" aria-hidden="true">
                <FeatureIcon name={f.icon} />
              </span>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
