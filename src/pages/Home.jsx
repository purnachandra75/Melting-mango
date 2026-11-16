import { Link } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Reveal from '../components/Reveal';
import { SpaBody } from '../components/SideDecor';
import { Clip } from '../components/ClipArt';
import { images } from '../data/images';
import { REWARDS } from '../data/flavors';
import { CONTACT, FLAGSHIP, HOURS, mapsSearchUrl } from '../data/locations';
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
  { quote: "The Mango tastes like biting into the fruit on a summer afternoon. Nothing else comes close.", name: 'Ananya R.', where: 'Regular since day one' },
  { quote: "Three scoops in a waffle cone — Pista, Chickoo and Chocolate. Pure, old-fashioned happiness.", name: 'Karthik S.', where: 'Flavor Passport member' },
  { quote: "An elegant little parlour with gracious staff. The Banana Split scoop is worth the trip alone.", name: 'Meher D.', where: 'Mango Points member' },
  { quote: "Creamy, not too sweet, and you can actually taste real fruit. My kids ask for it every weekend.", name: 'Priya K.', where: 'Weekend family visits' },
  { quote: "The chocolate is rich and silky. I came for one scoop and left with a tub for home.", name: 'Rahul M.', where: 'First-time visitor' },
  { quote: "Ordered for a birthday party and every single cup was gone in minutes. Fresh and lovely.", name: 'Sneha P.', where: 'Party order' },
  { quote: "Pista with real nuts in every bite. Easily the best ice cream I have had in years.", name: 'Arjun V.', where: 'Pista loyalist' },
  { quote: "Friendly staff who let you taste before you choose. The seasonal mango is a must-try.", name: 'Divya N.', where: 'Seasonal fan' },
  { quote: "Cosy spot for a late-night treat. Chickoo scoop is my new favourite comfort food.", name: 'Vikram T.', where: 'Night-owl regular' },
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
    'Melting Mango - small-batch, slow-churned artisan ice cream in South Jordan, UT. Ripe fruit, real cream, and nothing artificial.',
  );

  return (
    <>
      <Hero />
      <SpaBody>

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
            <h2 id="about-title" className="r2-h2">Real Alphonso Mangoes, Churned Fresh Daily.</h2>
            <p>
              We handcraft our ice cream in small batches from real Alphonso mangoes, slow-churned until it is bright, lush and smooth. Each batch is made fresh, so every scoop tastes like the fruit at its best.
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
        <svg className="r2-leaf r2-leaf--passport" viewBox="0 0 80 50" aria-hidden="true"><path d="M2 40C20 6 52-2 78 8 62 34 34 48 2 40Z" fill="#4E8E30" /><path d="M2 40C28 28 52 16 78 8" stroke="#2F6020" strokeWidth="1.5" fill="none" /></svg>
        <div className="container">
          <Reveal className="r2-passport">
            <div className="r2-passport__visual" aria-hidden="true">
              <div className="r2-pcard">
                <span className="r2-pcard__brand">Melting Mango</span>
                <span className="r2-pcard__title">Flavor Passport</span>
                <span className="r2-pcard__stamps">
                  {Array.from({ length: PASSPORT.stamps - 1 }, (_, i) => (
                    <span key={i} className={i < 3 ? 'is-on' : ''}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 20c-5-3-6-10-3-14s10-5 13-1c3 5-2 17-10 15Z" /></svg>
                    </span>
                  ))}
                </span>
              </div>
              <img className="r2-passport__bowl" src={images.heroBowl2} alt="" />
            </div>
            <div className="r2-passport__copy">
              <p className="r2-passport__label">Mango Rewards</p>
              <h2 id="passport-title">{PASSPORT.name}</h2>
              <p className="r2-passport__hl">Collect {PASSPORT.stamps} stamps, earn a free scoop!</p>
              <p className="r2-passport__desc">{PASSPORT.tagline}. Enrol once at the counter or online, and we’ll keep track.</p>
            </div>
            <Link to="/visit" className="r2-btn r2-btn--white">Enrol at a Parlour <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      <section className="r2-section r2-reviews" aria-labelledby="reviews-title">
        <div className="container">
          <Head kicker="Kind Words" title="What Our Guests Say" id="reviews-title" />
          <Reveal className="kw-marquee">
            <ul className="kw-track" aria-label="Guest reviews">
              {[...REVIEWS, ...REVIEWS].map((r, i) => (
                <li key={`${r.name}-${i}`} className={`kw-card kw-c${(i % REVIEWS.length) % 4}`} aria-hidden={i >= REVIEWS.length || undefined}>
                  <figure>
                    <span className="kw-card__mark" aria-hidden="true">{'\u201C'}</span>
                    <blockquote>{r.quote}</blockquote>
                    <figcaption>
                      <span className="kw-card__av" aria-hidden="true">{initials(r.name)}</span>
                      <span><strong>{r.name}</strong><small>{r.where}</small></span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Reveal>
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
                <span><strong>{FLAGSHIP.name}, {FLAGSHIP.city}</strong><small><a href={mapsSearchUrl(FLAGSHIP.address)} target="_blank" rel="noopener noreferrer">{FLAGSHIP.address}</a></small></span>
              </li>
              <li>
                <span className="r2-visit__ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5l3 2" /></svg></span>
                <span><strong>Opening Hours</strong><small>Mon – Thu {HOURS.weekday.label}<br />Fri – Sun {HOURS.weekend.label}</small></span>
              </li>
              <li>
                <span className="r2-visit__ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6.4 6.4l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg></span>
                <span><strong>Phone</strong><small><a href={CONTACT.phoneTel}>{CONTACT.phone}</a></small></span>
              </li>
            </ul>
            <Link to="/visit" className="r2-btn r2-btn--solid">Visit us <Arrow /></Link>
          </Reveal>
          <Reveal className="r2-visit__photo" delay={80}>
            <img src={images.parlourDisplay} alt="A gelato display case with tubs of ice cream behind the parlour window" width="1150" height="650" />
          </Reveal>
        </div>
      </section>
      </SpaBody>
    </>
  );
}
