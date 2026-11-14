import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Reveal from '../components/Reveal';
import { Clip, ClipLayer, Blob } from '../components/ClipArt';
import { images } from '../data/images';
import { flavors, REWARDS } from '../data/flavors';
import { FLAGSHIP, HOURS, LOCATIONS } from '../data/locations';
import { usePageTitle } from '../hooks/usePageTitle';

const SPECIALS = [
  { name: 'Ice Cream Scoops', note: 'Single, double or triple', src: images.mangoScoops, alt: 'Scoops of mango ice cream' },
  { name: 'Sundaes', note: 'Layered with sauces', src: images.sundae, alt: 'An ice cream sundae' },
  { name: 'Waffle Cones', note: 'Rolled in-house', src: images.chocolateCones, alt: 'Chocolate ice cream in waffle cones' },
  { name: 'Parfaits', note: 'Cream, crumble, fudge', src: images.parfait, alt: 'A chocolate parfait in a glass' },
  { name: 'Waffle Bowls', note: 'Golden & crisp', src: images.waffleBowl, alt: 'A waffle bowl of ice cream' },
  { name: 'Popsicles', note: 'Real fruit, frozen', src: images.popsicles, alt: 'Fruit popsicles' },
];

const REVIEWS = [
  { quote: 'The Mango tastes like biting into the fruit on a summer afternoon. Nothing else comes close.', name: 'Ananya R.', where: 'Regular since day one' },
  { quote: 'Three scoops in a waffle cone — Pista, Chickoo and Chocolate. Pure, old-fashioned happiness.', name: 'Karthik S.', where: 'Flavor Passport member' },
  { quote: 'An elegant little parlour with gracious staff. The Banana Split scoop is worth the trip alone.', name: 'Meher D.', where: 'Mango Points member' },
];

const PASSPORT = REWARDS.find((r) => r.id === 'flavor-passport');

const initials = (name) =>
  name.split(' ').filter((p) => !p.endsWith('.')).map((p) => p[0]).join('').slice(0, 2);

export default function Home() {
  usePageTitle(
    'Artisan Ice Cream',
    'Melting Mango — small-batch, slow-churned artisan ice cream made every morning with ripe fruit, real cream and nothing artificial. Parlours in Hyderabad, Bengaluru and Mumbai.'
  );
  const [active, setActive] = useState(0);

  return (
    <>
      <Hero />

      {/* Flavour ribbon */}
      <section className="yl-ribbon" aria-label="Our flavours">
        <div className="yl-ribbon__track">
          {[...flavors, ...flavors].map((f, i) => (
            <span key={`${f.id}-${i}`} className="yl-ribbon__item" aria-hidden={i >= flavors.length}>
              <span className="yl-ribbon__dot" style={{ background: f.color }} />
              {f.name}
            </span>
          ))}
        </div>
      </section>

      {/* Specialities */}
      <section className="yl-section yl-specials" id="gallery" aria-labelledby="specials-title">
        <ClipLayer className="yl-clips">
          <Blob className="yb yb--s1" />
          <Clip kind="Sundae" className="yc yc--s1" />
          <Clip kind="Popsicle" className="yc yc--s2" />
          <Clip kind="Sparkle" className="yc yc--s3" />
        </ClipLayer>
        <div className="container">
          <Reveal className="yl-head">
            <p className="yl-kicker">Our specialities</p>
            <h2 id="specials-title" className="yl-h2">Made for every craving</h2>
            <p className="yl-sub">Scoops, sundaes, cones and more — made fresh in our parlours every day.</p>
          </Reveal>
          <ul className="yl-cards">
            {SPECIALS.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 50}>
                <Link to="/menu" className="yl-card">
                  <span className="yl-card__img"><img src={s.src} alt={s.alt} /></span>
                  <span className="yl-card__body">
                    <span className="yl-card__name">{s.name}</span>
                    <span className="yl-card__note">{s.note}</span>
                  </span>
                  <span className="yl-card__go" aria-hidden="true">{'\u2192'}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* About + Passport */}
      <section className="yl-section yl-story" aria-label="About and rewards">
        <svg className="yl-wave yl-wave--top" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40c200-40 400-40 600-10s440 50 640 20 200-20 200-20V0H0Z" fill="currentColor" />
        </svg>
        <ClipLayer className="yl-clips">
          <Clip kind="Scoop" className="yc yc--a1" />
          <Clip kind="Mango" className="yc yc--a2" />
          <Clip kind="Heart" className="yc yc--a3" />
        </ClipLayer>
        <div className="container yl-story__grid">
          <Reveal className="yl-story__media">
            <img src={images.parlourInterior} alt="Sunlit cafe seating with a counter — a warm parlour interior" width="1800" height="1234" />
            <span className="yl-story__badge">
              <strong>Small</strong>
              <span>batch, every morning</span>
            </span>
          </Reveal>
          <Reveal className="yl-story__copy" delay={80}>
            <p className="yl-kicker">About our parlour</p>
            <h2 className="yl-h2">A grandmother’s summer, bottled.</h2>
            <p>
              Every summer, our founder’s grandmother would turn the season’s best Alphonsos into a
              hand-churned ice cream so smooth it disappeared before it could melt. Melting Mango began
              as an attempt to bottle that feeling.
            </p>
            <p>
              Ten years on we still churn in small batches, still hand-pulp every mango, and still taste
              every tray before the doors open.
            </p>
            <Link to="/story" className="yl-btn yl-btn--solid">Read our story <span aria-hidden="true">{'\u2192'}</span></Link>
          </Reveal>
        </div>

        <div className="container">
          <Reveal as="article" className="yl-passport" id="rewards">
            <div className="yl-passport__copy">
              <p className="yl-passport__label">Mango Rewards</p>
              <h2>{PASSPORT.name}</h2>
              <p className="yl-passport__hi">{PASSPORT.highlight}</p>
              <p>Taste your way around the menu. Enrol once at the counter or online, and we’ll keep track.</p>
              <Link to="/visit" className="yl-btn yl-btn--mango">Enrol at a parlour</Link>
            </div>
            <ol className="yl-stamps" aria-label={`${PASSPORT.stamps} stamps to a free scoop`}>
              {Array.from({ length: PASSPORT.stamps }, (_, i) => (
                <li key={i} className={i < PASSPORT.stamps - 1 ? 'is-on' : 'is-goal'}>
                  {i < PASSPORT.stamps - 1 ? (flavors[i % flavors.length].name) : 'Free scoop'}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="yl-section yl-reviews" aria-labelledby="reviews-title">
        <ClipLayer className="yl-clips">
          <Blob className="yb yb--r1" />
          <Clip kind="Cone" className="yc yc--r1" />
          <Clip kind="Sprinkles" className="yc yc--r2" />
        </ClipLayer>
        <div className="container">
          <Reveal className="yl-head">
            <p className="yl-kicker">Kind words</p>
            <h2 id="reviews-title" className="yl-h2">What our guests say</h2>
          </Reveal>
          <ul className="yl-quotes">
            {REVIEWS.map((r, i) => (
              <Reveal as="li" key={r.name} delay={i * 80}>
                <figure
                  className={`yl-quote${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="yl-quote__mark" aria-hidden="true">“</span>
                  <blockquote>{r.quote}</blockquote>
                  <figcaption>
                    <span className="yl-quote__av" aria-hidden="true">{initials(r.name)}</span>
                    <span>
                      <strong>{r.name}</strong>
                      <small>{r.where}</small>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Visit */}
      <section className="yl-section yl-visit" aria-labelledby="visit-title">
        <div className="container">
          <Reveal className="yl-visit__card">
            <div className="yl-visit__copy">
              <p className="yl-kicker">Visit us</p>
              <h2 id="visit-title" className="yl-h2">Come in for a scoop</h2>
              <dl className="yl-visit__list">
                <div>
                  <dt>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>
                    {FLAGSHIP.name}, {FLAGSHIP.city}
                  </dt>
                  <dd>{FLAGSHIP.address}</dd>
                </div>
                <div>
                  <dt>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5l3 2" /></svg>
                    Opening hours
                  </dt>
                  <dd>Mon – Thu {HOURS.weekday.label}<br />Fri – Sun {HOURS.weekend.label}</dd>
                </div>
                <div>
                  <dt>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-6h6v6" /></svg>
                    Also in
                  </dt>
                  <dd>{LOCATIONS.slice(1).map((l) => `${l.name}, ${l.city}`).join(' · ')}</dd>
                </div>
              </dl>
              <Link to="/visit" className="yl-btn yl-btn--solid">All parlours <span aria-hidden="true">{'\u2192'}</span></Link>
            </div>
            <div className="yl-visit__media">
              <img src={images.parlourDisplay} alt="A gelato display case with tubs of ice cream behind the parlour window" width="1150" height="650" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
