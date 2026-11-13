import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Reveal from '../components/Reveal';
import { images } from '../data/images';
import { REWARDS } from '../data/flavors';
import { FLAGSHIP, HOURS, LOCATIONS } from '../data/locations';
import { usePageTitle } from '../hooks/usePageTitle';

const SPECIALS = [
  { name: 'Ice Cream Scoops', src: images.mangoScoops, alt: 'Scoops of mango ice cream' },
  { name: 'Sundaes', src: images.sundae, alt: 'An ice cream sundae' },
  { name: 'Waffle Cones', src: images.chocolateCones, alt: 'Chocolate ice cream in waffle cones' },
  { name: 'Parfaits', src: images.parfait, alt: 'A chocolate parfait in a glass' },
  { name: 'Popsicles', src: images.popsicles, alt: 'Fruit popsicles' },
];

const REVIEWS = [
  { quote: 'The Mango tastes like biting into the fruit on a summer afternoon. Nothing else comes close.', name: 'Ananya R.', where: 'Regular since day one' },
  { quote: 'Three scoops in a waffle cone — Pista, Chickoo and Chocolate. Pure, old-fashioned happiness.', name: 'Karthik S.', where: 'Flavor Passport member' },
  { quote: 'An elegant little parlour with gracious staff. The Banana Split scoop is worth the trip alone.', name: 'Meher D.', where: 'Mango Points member' },
];

const PASSPORT = REWARDS.find((r) => r.id === 'flavor-passport');

function initials(name) {
  return name
    .split(' ')
    .filter((p) => !p.endsWith('.'))
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
}

export default function Home() {
  usePageTitle(
    'Artisan Ice Cream',
    'Melting Mango — small-batch, slow-churned artisan ice cream made every morning with ripe fruit, real cream and nothing artificial. Parlours in Hyderabad, Bengaluru and Mumbai.'
  );

  const [review, setReview] = useState(0);
  const current = REVIEWS[review];
  const prev = () => setReview((i) => (i === 0 ? REVIEWS.length - 1 : i - 1));
  const next = () => setReview((i) => (i === REVIEWS.length - 1 ? 0 : i + 1));

  return (
    <>
      <Hero />

      <section className="lp-specials section" aria-labelledby="specials-title">
        <div className="container">
          <Reveal className="lp-heading">
            <h2 id="specials-title" className="lp-title">Our Specialities</h2>
            <p>Scoops, sundaes, cones and more — made fresh in our parlours every day.</p>
          </Reveal>
          <ul className="lp-specials__grid">
            {SPECIALS.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 60}>
                <Link to="/menu" className="lp-special">
                  <span className="lp-special__media">
                    <img src={s.src} alt={s.alt} />
                  </span>
                  <span className="lp-special__name">{s.name}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="lp-about-row section" aria-label="About and rewards">
        <div className="container lp-about-row__grid">
          <Reveal as="article" className="lp-about">
            <div className="lp-about__photo">
              <img
                src={images.parlourInterior}
                alt="Sunlit cafe seating with a counter — a warm parlour interior"
                width="1800"
                height="1234"
              />
            </div>
            <div className="lp-about__copy">
              <h2 className="lp-title">About Our Parlour</h2>
              <p>
                Every summer, our founder’s grandmother would turn the season’s best Alphonsos into a
                hand-churned ice cream so smooth it disappeared before it could melt. Melting Mango began
                as an attempt to bottle that feeling.
              </p>
              <p>
                Ten years on we still churn in small batches, still hand-pulp every mango, and still taste
                every tray before the doors open.
              </p>
              <Link to="/story" className="btn btn--ink">
                Know More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal as="article" className="lp-offer" id="rewards" delay={120}>
            <div className="lp-offer__copy">
              <p className="lp-offer__label">Mango Rewards</p>
              <h2>{PASSPORT.name}</h2>
              <p className="lp-offer__highlight">{PASSPORT.highlight}</p>
              <p>
                Taste your way around the menu. Enrol once at the counter or online, and we’ll keep track.
              </p>
              <Link to="/visit" className="btn btn--ink">
                Enrol at a parlour
              </Link>
            </div>
            <div className="lp-offer__media">
              <img
                src={images.waffleBowl}
                alt="A waffle bowl filled with scoops of ice cream"
                width="800"
                height="800"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="lp-bottom section" aria-label="Reviews and visit">
        <div className="container lp-bottom__grid">
          <Reveal as="article" className="lp-reviews" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="lp-title">What Our Customers Say</h2>
            <div className="lp-reviews__card">
              <button type="button" className="lp-reviews__nav" onClick={prev} aria-label="Previous review">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 5 8 12l7 7" />
                </svg>
              </button>
              <blockquote>
                <span className="lp-reviews__avatar" aria-hidden="true">{initials(current.name)}</span>
                <p>“{current.quote}”</p>
                <footer>
                  <cite>{current.name}</cite>
                  <span>{current.where}</span>
                </footer>
              </blockquote>
              <button type="button" className="lp-reviews__nav" onClick={next} aria-label="Next review">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="lp-reviews__dots" role="tablist" aria-label="Reviews">
              {REVIEWS.map((r, i) => (
                <button
                  key={r.name}
                  type="button"
                  role="tab"
                  aria-selected={i === review}
                  aria-label={`Review by ${r.name}`}
                  className={i === review ? 'is-active' : ''}
                  onClick={() => setReview(i)}
                />
              ))}
            </div>
          </Reveal>

          <Reveal as="article" className="lp-visit" delay={100} aria-labelledby="visit-title">
            <div className="lp-visit__copy">
              <h2 id="visit-title" className="lp-title">Visit Our Parlour</h2>
              <p className="lp-visit__row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                <span>
                  {FLAGSHIP.name}, {FLAGSHIP.city}
                  <small>{FLAGSHIP.address}</small>
                </span>
              </p>
              <p className="lp-visit__row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8v5l3 2" />
                </svg>
                <span>
                  Mon – Thu <strong>{HOURS.weekday.label}</strong>
                  <small>Fri – Sun {HOURS.weekend.label}</small>
                </span>
              </p>
              <p className="lp-visit__fine">Also in {LOCATIONS.slice(1).map((l) => `${l.name}, ${l.city}`).join(' and ')}.</p>
              <Link to="/visit" className="btn btn--ghost">Find a parlour</Link>
            </div>
            <div className="lp-visit__photo">
              <img
                src={images.parlourDisplay}
                alt="A gelato display case with tubs of ice cream behind the parlour window"
                width="1150"
                height="650"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
