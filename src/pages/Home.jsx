import { useCallback, useState } from 'react';
import Scoop from '../components/Scoop';
import FlavorModal from '../components/FlavorModal';
import Reveal from '../components/Reveal';
import { DripEdge, Ornament, Seal } from '../components/landing/Decor';
import Hero from '../components/landing/Hero';
import ContainerCards from '../components/landing/ContainerCards';
import Gallery from '../components/landing/Gallery';
import ScoopBuilder from '../components/landing/ScoopBuilder';
import Rewards from '../components/landing/Rewards';
import { CONTAINERS, SCOOP_SIZES, flavors, formatPrice } from '../data/flavors';
import { bgImage, images } from '../data/images';
import { usePageTitle } from '../hooks/usePageTitle';

const MARQUEE = ['Slow-churned daily', 'Fresh cream', 'Hand-pulped fruit', 'Waffle cones rolled in-house', 'No artificial colours', 'Small batches'];

const CRAFT = [
  { title: 'Sourced', text: 'Fruit bought ripe from growers we know by name — mango, chickoo and banana at their seasonal best.' },
  { title: 'Steeped', text: 'Bases rest overnight so cacao, pistachio and cream fully bloom before a single churn.' },
  { title: 'Slow-churned', text: 'Churned at low speed in small batches for less air, a denser texture and a cleaner finish.' },
];

const REVIEWS = [
  { quote: 'The Mango tastes like biting into the fruit on a summer afternoon. Nothing else comes close.', name: 'Ananya R.', where: 'Regular since day one' },
  { quote: 'Three scoops in a waffle cone — Pista, Chickoo and Chocolate. Pure, old-fashioned happiness.', name: 'Karthik S.', where: 'Flavor Passport member' },
  { quote: 'An elegant little parlour with gracious staff. The Banana Split scoop is worth the trip alone.', name: 'Meher D.', where: 'Mango Points member' },
];

export default function Home() {
  usePageTitle();
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [emailError, setEmailError] = useState('');
  const closeModal = useCallback(() => setSelected(null), []);

  const join = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setJoined(true);
    setEmail('');
  };

  return (
    <>
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span className="marquee__item" key={`${m}-${i}`}>{m}</span>
          ))}
        </div>
      </div>
      <DripEdge />

      <section className="section lp-containers">
        <div className="container">
          <Reveal className="lp-title">
            <span className="eyebrow">Served your way</span>
            <h2>Cone, cup or <em className="accent">sugar cone?</em></h2>
            <Ornament />
            <p>Every flavour comes in one, two or three scoops — pick the way you love to eat it.</p>
          </Reveal>
          <ContainerCards />
        </div>
      </section>

      <section className="section lp-menu lp-menu--after bg-photo bg-photo--cream" id="menu" style={{ '--img': bgImage(images.mangoScoops) }}>
        <div className="container">
          <Reveal className="lp-title">
            <span className="eyebrow">The Menu</span>
            <h2>Our <em className="accent">Flavours</em></h2>
            <Ornament />
          </Reveal>

          <div className="menu-board">
            <Reveal className="menu-board__list">
              <ul>
                {flavors.map((f) => (
                  <li key={f.id}>
                    <button type="button" className="menu-row" onClick={() => setSelected(f)}>
                      <span className="menu-row__icon">
                        <Scoop scoops={[f.color]} vessel={f.vessel} topping="none" size={44} title="" />
                      </span>
                      <span className="menu-row__text">
                        <span className="menu-row__line">
                          <span className="menu-row__name">
                            {f.name}
                            {f.availability === 'Seasonal' && <span className="badge-seasonal">Seasonal</span>}
                          </span>
                          <span className="menu-row__dots" aria-hidden="true" />
                          <span className="menu-row__price">{formatPrice(f.price)}</span>
                        </span>
                        <span className="menu-row__notes">{f.notes}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="menu-board__meta">
                <div>
                  <h4>Scoop sizes</h4>
                  <p>{SCOOP_SIZES.map((s) => s.label).join(' · ')}</p>
                </div>
                <div>
                  <h4>Served in</h4>
                  <p>{CONTAINERS.map((c) => c.label).join(' · ')}</p>
                </div>
              </div>
              <p className="menu-board__fine">Prices are per scoop. Seasonal flavours are available while the harvest lasts.</p>
            </Reveal>

            <Reveal className="menu-board__photo" delay={150}>
              <figure className="frame">
                <img
                  src={images.waffleBowl}
                  alt="Two scoops of ice cream in a crisp waffle bowl"
                  width="800"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Churned fresh every morning</figcaption>
              </figure>
              <Seal className="menu-board__seal" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="parallax" style={{ '--img': bgImage(images.chocolateCones) }}>
        <div className="container parallax__inner">
          <Reveal>
            <Ornament light />
            <blockquote>
              “Every scoop begins at dawn — with ripe fruit, fresh cream and a great deal of patience.”
            </blockquote>
            <cite>The Melting Mango Creamery</cite>
          </Reveal>
        </div>
      </section>

      <section className="section lp-builder bg-photo bg-photo--cream" id="builder" style={{ '--img': bgImage(images.sprinkleBowl) }}>
        <div className="container">
          <Reveal className="lp-title">
            <span className="eyebrow">Made to order</span>
            <h2>Build your <em className="accent">perfect scoop</em></h2>
            <Ornament />
            <p>Choose one, two or three scoops, mix any flavours you like, and pick your container.</p>
          </Reveal>
          <Reveal>
            <ScoopBuilder />
          </Reveal>
        </div>
      </section>

      <section className="section lp-rewards bg-photo bg-photo--gray" id="rewards" style={{ '--img': bgImage(images.popsicles) }}>
        <div className="container">
          <Reveal className="lp-title">
            <span className="eyebrow">Mango Rewards Club</span>
            <h2>Rewards worth <em className="accent">savouring</em></h2>
            <Ornament />
            <p>Three ways to earn a free scoop. Enrol once at the counter or online, and we’ll keep track for you.</p>
          </Reveal>
          <Rewards />
          <p className="rewards__fine">
            <span>✦</span> Only one free scoop reward may be redeemed per transaction across all programmes.
          </p>
        </div>
      </section>

      <section className="section lp-gallery" id="gallery">
        <div className="container">
          <Reveal className="lp-title">
            <span className="eyebrow">Moments from the parlour</span>
            <h2>Our <em className="accent">Gallery</em></h2>
            <Ornament />
          </Reveal>
          <Gallery />
        </div>
      </section>

      <section className="section lp-craft" style={{ '--img': bgImage(images.conesFlatlay) }}>
        <div className="container">
          <Reveal className="lp-title lp-title--light">
            <span className="eyebrow">The craft</span>
            <h2>Good ice cream is <em className="accent">patient</em></h2>
            <Ornament light />
          </Reveal>
          <Reveal className="craft-grid">
            {CRAFT.map((c, i) => (
              <div className="craft-step" key={c.title}>
                <div className="craft-step__num">{['I', 'II', 'III'][i]}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section bg-photo bg-photo--cream" style={{ '--img': bgImage(images.sundae) }}>
        <div className="container">
          <Reveal className="lp-title">
            <span className="eyebrow">Kind words</span>
            <h2>Loved, <em className="accent">one scoop</em> at a time</h2>
            <Ornament />
          </Reveal>
          <div className="reviews">
            {REVIEWS.map((r, i) => (
              <Reveal as="article" className="review" key={r.name} delay={i * 100}>
                <div className="review__stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“{r.quote}”</blockquote>
                <div className="review__who">
                  <span className="review__avatar" aria-hidden="true">{r.name[0]}</span>
                  <div>{r.name}<span>{r.where}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="join">
        <div className="container">
          <Reveal className="cta bg-photo" style={{ '--img': bgImage(images.parfait) }}>
            <div>
              <span className="eyebrow">Join the club</span>
              <h2>Your first stamp is <em className="accent">on us</em></h2>
              <p>Enrol in Mango Rewards to start your Flavor Passport and collect Mango Points from your very first visit.</p>
            </div>
            <div>
              {joined ? (
                <p className="form-note form-note--ok" role="status">Welcome to the Mango Rewards Club! Check your inbox to finish enrolling.</p>
              ) : (
                <form className="newsletter" onSubmit={join} noValidate>
                  <input
                    type="email"
                    id="newsletter-email"
                    placeholder="Your email address"
                    aria-label="Email address"
                    aria-invalid={emailError ? 'true' : 'false'}
                    aria-describedby={emailError ? 'newsletter-error' : undefined}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                  />
                  <button className="btn btn--primary" type="submit">Enrol</button>
                </form>
              )}
              {emailError && <p className="form-note form-note--error" id="newsletter-error" role="alert">{emailError}</p>}
            </div>
          </Reveal>
        </div>
      </section>

      {selected && <FlavorModal flavor={selected} onClose={closeModal} />}
    </>
  );
}
