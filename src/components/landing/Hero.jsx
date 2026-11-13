import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { flavors } from '../../data/flavors';
import { LOCATIONS } from '../../data/locations';

const CUPS = {
  mango: {
    src: images.heroCups.mango,
    accent: '#FC6E04',
    soft: '#F9BC54',
    glow: 'rgba(252, 110, 4, 0.22)',
    alt: 'A white cup overflowing with mango and vanilla ice cream, mango sauce, a wafer stick and fresh mango',
  },
  chocolate: {
    src: images.heroCups.chocolate,
    accent: '#8B5E45',
    soft: '#C4A07A',
    glow: 'rgba(91, 58, 46, 0.28)',
    alt: 'A white cup of chocolate ice cream with chocolate sauce, a wafer stick and mint',
  },
  pista: {
    src: images.heroCups.pista,
    accent: '#7FA35B',
    soft: '#C5D9A0',
    glow: 'rgba(127, 163, 91, 0.26)',
    alt: 'A white cup of pistachio ice cream with a pistachio glaze, a wafer stick and mint',
  },
  chickoo: {
    src: images.heroCups.chickoo,
    accent: '#C49A6C',
    soft: '#E0C08A',
    glow: 'rgba(196, 154, 108, 0.28)',
    alt: 'A white cup of chickoo ice cream with caramel sauce, a wafer stick and mint',
  },
  'banana-split': {
    src: images.heroCups.bananaSplit,
    accent: '#D4A84A',
    soft: '#F3DE8A',
    glow: 'rgba(212, 168, 74, 0.26)',
    alt: 'A white cup of banana-cream ice cream with hot-fudge sauce, a wafer stick and mint',
  },
};

const HERO_FLAVORS = flavors.map((f) => ({
  id: f.id,
  name: f.name,
  color: f.color,
  ...(CUPS[f.id] || CUPS.mango),
}));

const CYCLE_MS = 3600;

const STATS = [
  {
    kicker: String(flavors.length),
    title: 'Signature Flavours',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="5" />
        <path d="M8 12 12 22 16 12" />
        <path d="M9.6 15.4h4.8M10.3 18.2h3.4" />
      </svg>
    ),
  },
  {
    title: 'Fresh & Natural Ingredients',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 20c8-1 11-8 13-16-7 1-13 5-13 16Z" />
        <path d="M8 13c2 0 4-2 5-5" />
      </svg>
    ),
  },
  {
    title: 'Slow-churned Daily',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z" />
      </svg>
    ),
  },
  {
    kicker: String(LOCATIONS.length),
    title: 'Parlours',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    ),
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const reduceRef = useRef(false);
  const pick = (i) => {
    setActive(i);
    setCycle((n) => n + 1);
  };

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    HERO_FLAVORS.forEach((f) => {
      const img = new Image();
      img.src = f.src;
    });
  }, []);

  useEffect(() => {
    if (paused || reduceRef.current) return undefined;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % HERO_FLAVORS.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, cycle]);

  const current = HERO_FLAVORS[active];

  return (
    <section
      className="mm-hero"
      aria-label="Introduction"
      data-flavor={current.id}
      style={{
        '--hero-accent': current.accent,
        '--hero-soft': current.soft,
        '--hero-glow': current.glow,
      }}
    >
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

          <div
            className="mm-hero__flavors"
            role="radiogroup"
            aria-label="Choose a flavour"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {HERO_FLAVORS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={i === active}
                className={`mm-hero__flavor${i === active ? ' is-active' : ''}`}
                style={{ '--swatch': f.color }}
                onClick={() => pick(i)}
              >
                <span className="mm-hero__swatch" aria-hidden="true" />
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <figure
          className="mm-hero__figure"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          <span className="mm-hero__glow" aria-hidden="true" />
          <div className="mm-hero__stage">
            {HERO_FLAVORS.map((f, i) => (
              <img
                key={f.id}
                className={`mm-hero__cup${i === active ? ' is-active' : ''}`}
                src={f.src}
                alt={i === active ? f.alt : ''}
                width="1400"
                height="1236"
                decoding="async"
              />
            ))}
          </div>
          <figcaption className="sr-only" aria-live="polite">
            {current.name}
          </figcaption>
        </figure>
      </div>

      <div className="container">
        <ul className="mm-stats">
          {STATS.map((s) => (
            <li key={s.title} className="mm-stats__item">
              <span className="mm-stats__icon">{s.icon}</span>
              <span className="mm-stats__text">
                {s.kicker && <strong className="mm-stats__num">{s.kicker}</strong>}
                <span className="mm-stats__label">{s.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
