import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SpaBody } from '../components/SideDecor';
import { bgImage, images } from '../data/images';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCoupons, fetchGiftCards, fetchOffers, fetchRewards } from '../lib/offersApi';
import { resolveMenuImage } from '../lib/restaurantApi';
import GiftCardGrid from '../components/GiftCardGrid';
import Rewards from '../components/landing/Rewards';
import { REWARDS } from '../data/flavors';

const CHANNEL_LABEL = {
  kiosk: 'At the kiosk',
  admin: 'At the counter',
  delivery: 'Delivery',
};

const SECTIONS = [
  { id: 'offers', label: 'Offers' },
  { id: 'coupons', label: 'Coupon codes' },
  { id: 'gift-cards', label: 'Gift cards' },
  { id: 'rewards', label: 'Rewards' },
];

function formatDay(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function endsIn(iso) {
  const ms = new Date(iso).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return '';
  const hours = Math.floor(ms / 3_600_000);
  if (hours < 24) return hours <= 1 ? 'Ends within the hour' : `Ends in ${hours} hours`;
  const days = Math.ceil(hours / 24);
  return days === 1 ? 'Ends tomorrow' : `Ends in ${days} days`;
}

/** Loads one list from the server; `ok` is false when the request failed. */
function useList(fetcher) {
  const [state, setState] = useState({ status: 'loading', items: [] });
  useEffect(() => {
    const ctrl = new AbortController();
    fetcher(ctrl.signal)
      .then((items) => setState({ status: 'ready', items }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', items: [] });
      });
    return () => ctrl.abort();
  }, [fetcher]);
  return state;
}

function SectionHead({ id, eyebrow, title, text }) {
  return (
    <div className="promo-section__head" id={id}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function SectionNote({ state, empty }) {
  if (state.status === 'loading') return <p className="offers-note" role="status">Loading...</p>;
  if (state.status === 'error') return <p className="offers-note" role="alert">Couldn't load this right now. Please try again shortly.</p>;
  return <p className="offers-empty-text">{empty}</p>;
}

function OfferCard({ offer }) {
  const [imgOk, setImgOk] = useState(true);
  const image = offer.imageUrl && imgOk ? resolveMenuImage(offer.imageUrl) : '';
  const until = formatDay(offer.endAt);
  const left = endsIn(offer.endAt);
  const channels = (offer.channels || []).map((c) => CHANNEL_LABEL[c]).filter(Boolean);

  return (
    <article className="offer-card">
      <div className="offer-card__top">
        {image ? (
          <img src={image} alt="" loading="lazy" onError={() => setImgOk(false)} />
        ) : null}
        <span className="offer-card__badge">{offer.badge}</span>
        {left ? <span className="offer-card__timer">{left}</span> : null}
      </div>
      <div className="offer-card__body">
        <h3 className="offer-card__name">{offer.name}</h3>
        <p className="offer-card__headline">{offer.headline}</p>
        {offer.appliesTo ? (
          <p className="offer-card__applies">
            <span>Applies to</span> {offer.appliesTo}
          </p>
        ) : null}
        {channels.length ? (
          <ul className="chip-list" aria-label="Where this offer is available">
            {channels.map((c) => <li key={c}>{c}</li>)}
          </ul>
        ) : null}
        <div className="offer-card__foot">
          <span className="offer-card__valid">{until ? `Valid until ${until}` : ''}</span>
          <Link to="/menu" className="promo-cta">
            Order now <span aria-hidden="true">{'\u2192'}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);
  const until = formatDay(coupon.endAt);
  const channels = (coupon.channels || []).map((c) => CHANNEL_LABEL[c]).filter(Boolean);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="coupon-card">
      <div className="coupon-card__main">
        <p className="coupon-card__headline">{coupon.headline}</p>
        {coupon.terms?.length ? (
          <ul className="coupon-card__terms">
            {coupon.terms.map((t) => <li key={t}>{t}</li>)}
          </ul>
        ) : null}
        {channels.length ? (
          <ul className="chip-list" aria-label="Where this coupon can be used">
            {channels.map((c) => <li key={c}>{c}</li>)}
          </ul>
        ) : null}
      </div>
      <div className="coupon-card__stub">
        <span className="coupon-card__label">Coupon code</span>
        <code className="coupon-card__code">{coupon.code}</code>
        <button type="button" className="coupon-card__copy" onClick={onCopy} aria-live="polite">
          {copied ? 'Copied' : 'Copy code'}
        </button>
        {until ? <span className="coupon-card__valid">Till {until}</span> : null}
      </div>
    </article>
  );
}

export default function Offers() {
  usePageTitle(
    'Offers',
    'Current offers, coupon codes and gift cards at Melting Mango.',
  );
  const offers = useList(fetchOffers);
  const coupons = useList(fetchCoupons);
  const giftCards = useList(fetchGiftCards);
  const rewards = useList(fetchRewards);

  // One section at a time: the URL hash picks it (#offers, #coupons, #gift-cards).
  const { hash } = useLocation();
  const active = SECTIONS.find((s) => s.id === hash.replace('#', ''))?.id || 'offers';
  const navRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Keep the tabs in view after a switch, so the new section starts right below them.
    const top = navRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight) {
      navRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [active]);

  return (
    <SpaBody compact>
      <header className="page-head container" style={{ '--head-img': bgImage(images.waffleBowl) }}>
        <span className="eyebrow">Offers</span>
        <h1>Sweet <em className="accent">deals</em></h1>
        <p>Offers, coupon codes and gift cards from our kitchen. Grab them while they last.</p>
      </header>

      <div className="container">
        <nav className="promo-jump" aria-label="Sections" ref={navRef}>
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/offers#${s.id}`}
              aria-current={s.id === active ? "page" : undefined}
              className={s.id === active ? "is-active" : undefined}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      {active === 'offers' ? (
      <section className="section section--cream promo-section" style={{ paddingTop: 0 }} aria-labelledby="offers">
        <div className="container">
          <SectionHead id="offers" eyebrow="Offers" title="Current offers" />
          {offers.status === 'ready' && offers.items.length > 0 ? (
            <div className="offers-grid">
              {offers.items.map((o) => <OfferCard key={o.id} offer={o} />)}
            </div>
          ) : (
            <SectionNote state={offers} empty="No offers right now. New deals show up here as soon as we add them." />
          )}
        </div>
      </section>
      ) : null}

      {active === 'coupons' ? (
      <section className="section section--cream promo-section" style={{ paddingTop: 0 }} aria-labelledby="coupons">
        <div className="container">
          <SectionHead
            id="coupons"
            eyebrow="Coupons"
            title="Coupon codes"
            text="Copy a code and enter it at the kiosk or the counter."
          />
          {coupons.status === 'ready' && coupons.items.length > 0 ? (
            <div className="coupons-grid">
              {coupons.items.map((c) => <CouponCard key={c.id} coupon={c} />)}
            </div>
          ) : (
            <SectionNote state={coupons} empty="No coupon codes right now." />
          )}
        </div>
      </section>
      ) : null}

      {active === 'gift-cards' ? (
      <section className="section section--cream promo-section" style={{ paddingTop: 0 }} aria-labelledby="gift-cards">
        <div className="container">
          <SectionHead
            id="gift-cards"
            eyebrow="Gift cards"
            title="Gift cards"
            text="Share the joy of ice cream! Perfect for birthdays, celebrations, or a sweet surprise."
          />
          {giftCards.status === 'ready' && giftCards.items.length > 0 ? (
            <GiftCardGrid cards={giftCards.items} />
          ) : (
            <SectionNote state={giftCards} empty="No gift cards available right now." />
          )}
        </div>
      </section>
      ) : null}

      {active === 'rewards' ? (
      <section className="section section--cream promo-section" style={{ paddingTop: 0 }} aria-labelledby="rewards">
        <div className="container">
          <SectionHead
            id="rewards"
            eyebrow="Rewards"
            title="Mango rewards"
            text="Free scoops and points for our regulars. Ask us at the counter to get started."
          />
          {rewards.status === 'error' ? (
            // Could not reach the server: show the built-in programme details instead of an empty page.
            <Rewards rewards={REWARDS} />
          ) : rewards.status === 'ready' && rewards.items.length > 0 ? (
            <Rewards rewards={rewards.items} />
          ) : (
            <SectionNote state={rewards} empty="No reward programmes right now." />
          )}
        </div>
      </section>
      ) : null}
    </SpaBody>
  );
}
