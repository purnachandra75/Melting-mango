import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Reveal from '../components/Reveal';
import { Clip } from '../components/ClipArt';
import { images } from '../data/images';
import { REWARDS } from '../data/flavors';
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
const initials = (n) => n.split(' ').filter((p) => !p.endsWith('.')).map((p) => p[0]).join('').slice(0, 2);
const Arrow = () => <span aria-hidden="true">{'\u2192'}</span>;

function Head({ kicker, title, id }) {
  return (
    <Reveal className="r2-head">
      <p className="r2-kicker">{kicker}</p>
      <h2 id={id} className="r2-h2">{title}</h2>
      <span className="r2-squiggle" aria-hidden="true" />
    </Reveal>
  );
}

export default function Home() {
  usePageTitle(
    'Artisan Ice Cream',
    'Melting Mango — small-batch, slow-churned artisan ice cream made every morning with ripe fruit, real cream and nothing artificial. Parlours in Hyderabad, Bengaluru and Mumbai.'
  );

  return (
    <>
      <Hero />

      <section className="r2-section r2-specials" id="gallery" aria-labelledby="specials-title">
        <div className="container">
          <Head kicker="Our Specialities" title="Made for Every Craving" id="specials-title" />
          <ul className="r2-cards">
            {SPECIALS.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 50}>
                <Link to="/menu" className="r2-card">
                  <span className="r2-card__img"><img src={s.src} alt={s.alt} /></span>
                  <span className="r2-card__name">{s.name}</span>
                  <span className="r2-card__note">{s.note}</span>
                  <span className="r2-card__go" aria-hidden="true">{'\u2192'}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="r2-section r2-about" aria-labelledby="about-title">
        <Clip kind="Mango" className="r2-about__art" />
        <div className="container r2-about__grid">
          <Reveal className="r2-about__photo">
            <img src={images.parlourInterior} alt="Sunlit cafe seating with a counter — a warm parlour interior" width="1800" height="1234" />
          </Reveal>
          <Reveal className="r2-about__copy" delay={80}>
            <p className="r2-kicker r2-kicker--left">About Our Parlour</p>
            <h2 id="about-title" className="r2-h2">A Grandmother’s Summer, Bottled.</h2>
            <p>
              Every summer, our founder’s grandmother would turn the season’s best Alphonsos into a
              hand-churned ice cream so smooth it disappeared before it could melt. Melting Mango began
              as an attempt to bottle that feeling.
            </p>
            <p>
              Ten years on we still churn in small batches, still hand-pulp every mango, and still taste
              every tray before the doors open.
            </p>
            <Link to="/story" className="r2-btn r2-btn--solid">Our Story <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      <section className="r2-passport-wrap" aria-labelledby="passport-title" id="rewards">
        <div className="container">
          <Reveal className="r2-passport">
            <div className="r2-passport__visual" aria-hidden="true">
              <div className="r2-pcard">
                <span className="r2-pcard__brand">Melting Mango</span>
                <span className="r2-pcard__title">Flavor Passport</span>
                <span className="r2-pcard__stamps">
                  {Array.from({ length: PASSPORT.stamps - 1 }, (_, i) => (
                    <span key={i} className={i < 3 ? 'is-on' : ''} />
                  ))}
                </span>
              </div>
              <img className="r2-passport__bowl" src={images.heroBowl2} alt="" />
            </div>
            <div className="r2-passport__copy">
              <p className="r2-passport__label">Mango Rewards</p>
              <h2 id="passport-title">{PASSPORT.name}</h2>
              <p>{PASSPORT.highlight}!</p>
            </div>
            <Link to="/visit" className="r2-btn r2-btn--white">Enrol at a Parlour <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      <section className="r2-section r2-reviews" aria-labelledby="reviews-title">
        <div className="container">
          <Head kicker="Kind Words" title="What Our Guests Say" id="reviews-title" />
          <ul className="r2-quotes">
            {REVIEWS.map((r, i) => (
              <Reveal as="li" key={r.name} delay={i * 80}>
                <figure className={`r2-quote${i === 1 ? ' is-featured' : ''}`}>
                  <span className="r2-quote__mark" aria-hidden="true">“</span>
                  <blockquote>{r.quote}</blockquote>
                  <figcaption>
                    <span className="r2-quote__av" aria-hidden="true">{initials(r.name)}</span>
                    <span><strong>{r.name}</strong><small>{r.where}</small></span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="r2-section r2-visit" aria-labelledby="visit-title">
        <img className="r2-visit__blur" src={images.heroMango} alt="" aria-hidden="true" />
        <div className="container r2-visit__grid">
          <Reveal className="r2-visit__card">
            <p className="r2-kicker r2-kicker--left">Visit Us</p>
            <h2 id="visit-title" className="r2-h2">Come in for a Scoop</h2>
            <ul className="r2-visit__list">
              <li>
                <span className="r2-visit__ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.3" /></svg></span>
                <span><strong>{FLAGSHIP.name}, {FLAGSHIP.city}</strong><small>{FLAGSHIP.address}</small></span>
              </li>
              <li>
                <span className="r2-visit__ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5l3 2" /></svg></span>
                <span><strong>Opening Hours</strong><small>Mon – Thu {HOURS.weekday.label}<br />Fri – Sun {HOURS.weekend.label}</small></span>
              </li>
              <li>
                <span className="r2-visit__ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-6h6v6" /></svg></span>
                <span><strong>Also In</strong><small>{LOCATIONS.slice(1).map((l) => `${l.name}, ${l.city}`).join(' · ')}</small></span>
              </li>
            </ul>
            <Link to="/visit" className="r2-btn r2-btn--solid">All Parlours <Arrow /></Link>
          </Reveal>
          <Reveal className="r2-visit__photo" delay={80}>
            <img src={images.parlourDisplay} alt="A gelato display case with tubs of ice cream behind the parlour window" width="1150" height="650" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
