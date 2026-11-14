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
      <img className="r2-hero__blur r2-hero__blur--l" src={images.heroMango} alt="" aria-hidden="true" />
      <img className="r2-hero__blur r2-hero__blur--r" src={images.heroMango} alt="" aria-hidden="true" />

      <div className="container r2-hero__grid">
        <div className="r2-hero__copy">
          <p className="r2-eyebrow">Artisan Ice Cream <span aria-hidden="true">•</span> Since Day One</p>
          <h1 className="r2-hero__title">
            Pure <em>Mango</em>
            <br />
            Happiness
          </h1>
          <p className="r2-hero__lead">
            Small-batch, slow-churned ice cream made every morning with ripe fruit, real cream and
            nothing artificial.
          </p>
          <div className="r2-hero__actions">
            <Link to="/menu" className="r2-btn r2-btn--solid">Explore Menu <span aria-hidden="true">{'\u2192'}</span></Link>
            <Link to="/visit" className="r2-btn r2-btn--line">Find a Parlour</Link>
          </div>
        </div>

        <figure className="r2-hero__art">
          <span className="r2-hero__glow" aria-hidden="true" />
          <img
            className="r2-hero__bowl"
            src={images.heroBowl2}
            alt="A speckled ceramic bowl of mango ice cream scoops with mango sauce, fresh mango cubes and mango leaves"
            width="1008"
            height="713"
          />
        </figure>

        <div className="r2-badge" aria-label="Made with real Alphonso mangoes">
          <span className="r2-badge__tail r2-badge__tail--l" aria-hidden="true" />
          <span className="r2-badge__tail r2-badge__tail--r" aria-hidden="true" />
          <span className="r2-badge__disc">
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
      <svg className="r2-wave-line" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 22c120-16 240-16 360 0s240 16 360 0 240-16 360 0 240 16 360 0" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </section>
  );
}
