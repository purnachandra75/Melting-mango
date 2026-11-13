import { Link } from 'react-router-dom';
import HeroArt from './HeroArt';
import FallingTreats from './FallingTreats';
import StatsBar from './StatsBar';

const FEATURES = [
  {
    label: ['100% Real', 'Mangoes'],
    icon: <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Zm0 0 9-9" />,
  },
  {
    label: ['No Artificial', 'Additives'],
    icon: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M8 15h8" />,
  },
  {
    label: ['Made with', 'Love'],
    icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  },
];

export default function Hero() {
  return (
    <section className="mm-hero">
      <FallingTreats />
      <div className="mm-hero__blob mm-hero__blob--l" aria-hidden="true" />
      <div className="mm-hero__blob mm-hero__blob--r" aria-hidden="true" />

      <div className="container mm-hero__grid">
        <div className="mm-hero__copy">
          <span className="eyebrow lp-anim" style={{ '--d': '0.1s' }}>Artisan Creamery · Since 2016</span>
          <h1 className="lp-anim" style={{ '--d': '0.2s' }}>
            Slow-churned.
            <span className="mm-hero__script">
              Sun-ripened.
              <svg className="mm-hero__swoosh" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                <path d="M6 18 C 90 4 210 2 294 12" />
              </svg>
            </span>
          </h1>
          <p className="mm-hero__lead lp-anim" style={{ '--d': '0.4s' }}>
            Melting Mango crafts small-batch ice cream from hand-picked mangoes, real cacao and fresh cream — churned fresh
            every single morning.
          </p>
          <div className="hero__cta lp-anim" style={{ '--d': '0.55s' }}>
            <Link to="/menu" className="btn btn--mango btn--lg">Explore flavours →</Link>
            <Link to="/visit" className="btn btn--ghost btn--lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              Find a parlour
            </Link>
          </div>
          <ul className="mm-features lp-anim" style={{ '--d': '0.7s' }}>
            {FEATURES.map((f) => (
              <li key={f.label.join(' ')}>
                <span className="mm-features__icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {f.icon}
                  </svg>
                </span>
                <span>{f.label[0]}<br />{f.label[1]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mm-hero__art lp-anim" style={{ '--d': '0.25s' }}>
          <HeroArt />
          <div className="float-badge float-badge--a">
            <span className="float-badge__icon">🥭</span>
            <div><strong>Mango season</strong><span>Limited until June</span></div>
            <svg className="float-badge__arrow" viewBox="0 0 80 60" aria-hidden="true">
              <path d="M6 6 C 30 10 50 26 70 50" />
              <path d="M58 48 L 70 50 L 68 38" />
            </svg>
          </div>
          <div className="float-badge float-badge--b">
            <span className="float-badge__icon">🕖</span>
            <div><strong>Churned at 7 AM</strong><span>Every single day</span></div>
            <svg className="float-badge__arrow" viewBox="0 0 80 60" aria-hidden="true">
              <path d="M40 56 C 30 40 22 24 8 8" />
              <path d="M8 20 L 8 8 L 20 10" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container">
        <StatsBar />
      </div>
    </section>
  );
}
