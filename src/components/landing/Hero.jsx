import { Link } from 'react-router-dom';
import { images } from '../../data/images';

const FEATURES = [
  {
    t: '100% Real', s: 'Ingredients',
    icon: <path d="M6 20c8-1 12-8 13-16-7 1-13 5-13 16Zm2.5-5.5c2 0 4-1.8 5-4.5" />,
  },
  {
    t: 'Small Batch', s: 'Artisan Crafted',
    icon: <><path d="M6 10h12l-1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l-1-9Z" /><path d="M9 10a3 3 0 0 1 6 0M4 10h16" /></>,
  },
  {
    t: 'No Artificial', s: 'Colours or Flavours',
    icon: <><circle cx="12" cy="12" r="8.5" /><path d="m6 6 12 12" /></>,
  },
  {
    t: 'Seasonal Mango', s: 'Specialities',
    icon: <><path d="M9 20c-5-3-6-10-3-14s10-5 13-1c3 5-2 17-10 15Z" /><path d="M15 5c1-2 3-3 5-2-1 2-3 3-5 2" /></>,
  },
];

export default function Hero() {
  return (
    <section className="r2-hero" aria-label="Introduction">
      <div className="container r2-hero__grid">
        <div className="r2-hero__copy">
          <p className="r2-eyebrow">Artisan Ice Cream <span aria-hidden="true">•</span> Since Day One</p>
          <h1 className="r2-hero__title">
            Pure <em>Mango</em>
            <br />
            Happiness
          </h1>
          <p className="r2-hero__lead">
            Handcrafted ice creams with real Alphonso mangoes and premium ingredients.
          </p>
          <div className="r2-hero__actions">
            <Link to="/menu" className="r2-btn r2-btn--solid">Explore Menu <span aria-hidden="true">{'→'}</span></Link>
            <Link to="/visit" className="r2-btn r2-btn--line">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>
              Find a Parlour
            </Link>
          </div>
        </div>

        <figure className="r2-hero__art">
          <span className="r2-hero__ref r2-bowl">
          <img
            className="r2-bowl__img"
            src={images.heroBowlCut}
            srcSet={`${images.heroBowlCut} 1x, ${images.heroBowlCut2x} 2x`}
            alt="A speckled ceramic bowl piled with mango ice cream scoops, mango sauce, mango cubes and leaves"
            width="477"
            height="539"
          />
          </span>
        </figure>

        <div className="r2-badge" aria-label="Made with real Alphonso mangoes">
          <span className="r2-badge__tail r2-badge__tail--l" aria-hidden="true" />
          <span className="r2-badge__tail r2-badge__tail--r" aria-hidden="true" />
          <span className="r2-badge__disc">
            <svg className="r2-badge__leaf" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 19c9 0 14-6 14-14C10 5 5 10 5 19Zm0 0c3-4 6-7 10-9" /></svg>
            <small>Made with</small>
            <strong>Real</strong>
            <em>Alphonso</em>
            <small>Mangoes</small>
          </span>
        </div>
      </div>

      <div className="container">
        <ul className="r2-features">
          {FEATURES.map((f) => (
            <li key={f.t}>
              <span className="r2-features__icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
              </span>
              <span><strong>{f.t}</strong><small>{f.s}</small></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
