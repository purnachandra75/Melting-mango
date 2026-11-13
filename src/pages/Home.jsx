import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import FlavorModal from '../components/FlavorModal';
import Reveal from '../components/Reveal';
import Hero from '../components/landing/Hero';
import { flavors } from '../data/flavors';
import { images } from '../data/images';
import { usePageTitle } from '../hooks/usePageTitle';

const WHY = [
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

function WhyIcon({ name }) {
  const props = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  if (name === 'fruit') {
    return (
      <svg {...props}>
        <path d="M12 21c5 0 8-4.2 8-9.2C20 6.5 16.5 3 12 3S4 6.5 4 11.8C4 16.8 7 21 12 21Z" />
        <path d="M12 3c1.2-1.8 3.4-2 4.6-1" />
        <path d="M12 8v13" />
      </svg>
    );
  }
  if (name === 'churn') {
    return (
      <svg {...props}>
        <path d="M8 3h8" />
        <path d="M12 3v6" />
        <path d="M7 9h10l-1.2 10.2A2 2 0 0 1 13.8 21h-3.6a2 2 0 0 1-2-1.8L7 9Z" />
        <path d="M9.5 13h5" />
      </svg>
    );
  }
  if (name === 'leaf') {
    return (
      <svg {...props}>
        <path d="M5 19c8-1 13-8 14-15-8 1-14 7-14 15Z" />
        <path d="M5 19c2-4 6-8 12-10" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 21s7-5.6 7-11.2A7 7 0 0 0 5 9.8C5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

export default function Home() {
  usePageTitle();
  const [selected, setSelected] = useState(null);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <Hero />

      <section className="section lp-scoops" id="menu">
        <div className="container">
          <div className="lp-rowhead">
            <h2>Our <em className="accent">flavours</em></h2>
            <Link to="/menu" className="lp-rowhead__link">
              View all flavours
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <ul className="scoop-row">
            {flavors.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className="scoop-row__item"
                  onClick={() => setSelected(f)}
                  aria-label={`View ${f.name}`}
                >
                  <span className="scoop-row__photo">
                    <img src={f.scoop} alt="" width="440" height="440" loading="lazy" decoding="async" />
                  </span>
                  <span className="scoop-row__name">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section lp-promos">
        <div className="container lp-promos__grid">
          <article className="promo" id="rewards">
            <div className="promo__copy">
              <p className="promo__label">Mango Rewards</p>
              <h2>More scoops, more smiles</h2>
              <p>
                Collect six stamps on your Flavor Passport and earn a free scoop. Enrol once at the counter or online, and we’ll keep track.
              </p>
              <Link to="/visit" className="btn btn--ink">Enrol at a parlour</Link>
            </div>
            <div className="promo__media">
              <img
                src={images.waffleBowl}
                alt="A waffle cone with two scoops of ice cream"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>

          <article className="promo promo--alt">
            <div className="promo__copy">
              <p className="promo__label">Made to order</p>
              <h2>Build your perfect scoop</h2>
              <p>
                Mix any of our flavours, in one, two or three scoops, served in a waffle cone, cup or sugar cone.
              </p>
              <Link to="/menu" className="btn btn--ink">Explore the menu</Link>
            </div>
            <div className="promo__media">
              <img
                src={images.parfait}
                alt="A chocolate parfait in a glass"
                width="800"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="section lp-why">
        <div className="container">
          <Reveal className="lp-title">
            <p className="mm-hero__label">The creamery</p>
            <h2>Why <em className="accent">Melting Mango</em>?</h2>
          </Reveal>
          <ul className="why-grid">
            {WHY.map((w, i) => (
              <Reveal as="li" className="why-card" key={w.title} delay={i * 70}>
                <span className="why-card__icon" aria-hidden="true">
                  <WhyIcon name={w.icon} />
                </span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section lp-story">
        <div className="container lp-story__grid">
          <Reveal className="lp-story__photo">
            <img
              src={images.conesFlatlay}
              alt="Ice cream cones with berries and flowers, photographed from above"
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal className="lp-story__copy" delay={100}>
            <p className="mm-hero__label">Our story</p>
            <h2>It started with <em className="accent">one mango</em></h2>
            <p>
              Every summer, our founder’s grandmother would turn the season’s best Alphonsos into a hand-churned ice cream so smooth it disappeared before it could melt. Melting Mango began as an attempt to bottle that feeling.
            </p>
            <p>
              Ten years on we still churn in small batches, still hand-pulp every mango, and still taste every tray before the doors open.
            </p>
            <Link to="/story" className="btn btn--ghost">Read our story</Link>
          </Reveal>
        </div>
      </section>

      {selected && <FlavorModal flavor={selected} onClose={closeModal} />}
    </>
  );
}
