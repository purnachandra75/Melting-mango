import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { SpaBody } from '../components/SideDecor';
import GiftCardArt from '../components/GiftCardArt';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchGiftCards, startGiftCardCheckout } from '../lib/offersApi';

const DELIVERY = [
  { id: 'email', label: 'Email', hint: 'Send via email' },
  { id: 'whatsapp', label: 'WhatsApp', hint: 'Send via WhatsApp' },
  { id: 'print', label: 'Print', hint: 'Download & print' },
];

const STEPS = [
  { title: 'Choose amount', text: 'Select a value or enter a custom amount.' },
  { title: 'Add recipient details', text: "Enter the recipient's name, email or mobile, and a personal message." },
  { title: 'Send instantly or schedule', text: 'Deliver it now or pick a future date that suits you.' },
];

const MAX_QTY = 10;
const MAX_MESSAGE = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function money(n) {
  const x = Number(n) || 0;
  return `$${Number.isInteger(x) ? x : x.toFixed(2)}`;
}

function todayIso() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function digits(s) {
  return String(s).replace(/\D/g, '');
}

/* Small inline icons (the website has no icon library). */
const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const IconTag = () => <Icon><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1" /></Icon>;
const IconLayers = () => <Icon><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></Icon>;
const IconSend = () => <Icon><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>;
const IconUser = () => <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Icon>;
const IconMessage = () => <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>;
const IconCalendar = () => <Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icon>;
const IconStore = () => <Icon size={20}><path d="M4 9l1.5-5h13L20 9" /><path d="M4 9h16v11H4z" /><path d="M9 20v-6h6v6" /></Icon>;
const IconCard = () => <Icon size={20}><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19" /></Icon>;
const IconEmail = () => <Icon size={20}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Icon>;
const IconChat = () => <Icon size={20}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></Icon>;
const IconPrint = () => <Icon size={20}><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7H6z" /></Icon>;
const IconLock = () => <Icon size={14}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Icon>;
const OPTION_ICONS = { email: IconEmail, whatsapp: IconChat, print: IconPrint };

export default function GiftCardBuy() {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', cards: [] });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchGiftCards(ctrl.signal)
      .then((cards) => setState({ status: 'ready', cards }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', cards: [] });
      });
    return () => ctrl.abort();
  }, []);

  const card = state.cards.find((c) => c.id === id);
  usePageTitle(card ? card.name : 'Gift card', 'Buy a Melting Mango gift card.');

  const [amountIndex, setAmountIndex] = useState(0);
  const [custom, setCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState('email');
  const [recipient, setRecipient] = useState('');
  const [contact, setContact] = useState('');
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [schedule, setSchedule] = useState(false);
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const cancelled = new URLSearchParams(useLocation().search).get('cancelled') === '1';

  // Another gift card starts a fresh form.
  useEffect(() => {
    setAmountIndex(0);
    setCustom(false);
    setCustomAmount('');
    setQty(1);
    setErrors({});
    setPayError('');
    setPaying(false);
  }, [id]);

  // Coming back from Stripe with the browser's Back button restores this page from cache.
  useEffect(() => {
    const onShow = (e) => {
      if (e.persisted) setPaying(false);
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  let body;
  if (state.status === 'loading') {
    body = <p className="offers-note" role="status">Loading...</p>;
  } else if (state.status === 'error') {
    body = <p className="offers-note" role="alert">Couldn't load this gift card right now. Please try again shortly.</p>;
  } else if (!card) {
    body = (
      <div className="gbuy__missing">
        <p className="offers-empty-text">This gift card isn't available right now.</p>
        <Link to="/offers#gift-cards" className="gtile__buy">See all gift cards</Link>
      </div>
    );
  } else {
    const minAmount = Math.min(...card.values.map((v) => Number(v.amount)));
    const value = card.values[Math.min(amountIndex, card.values.length - 1)];
    const customNum = Number(customAmount);
    const customValid = custom && Number.isFinite(customNum) && customNum >= minAmount && customNum < 10000;

    const unitPay = custom ? (customValid ? customNum : 0) : Number(value.payAmount);
    const unitBonus = custom ? 0 : Number(value.bonusAmount) || 0;
    const total = unitPay * qty;
    const bonusTotal = unitBonus * qty;

    const validate = () => {
      const e = {};
      if (custom && !customValid) e.amount = `Enter an amount of ${money(minAmount)} or more.`;
      if (!recipient.trim()) e.recipient = "Enter the recipient's name.";
      if (delivery === 'email' && !EMAIL_RE.test(contact.trim())) e.contact = 'Enter a valid email address.';
      if (delivery === 'whatsapp' && digits(contact).length < 7) e.contact = 'Enter a valid mobile number.';
      if (delivery === 'print' && contact.trim() && !EMAIL_RE.test(contact.trim()) && digits(contact).length < 7) {
        e.contact = 'Enter a valid email or mobile number.';
      }
      if (!sender.trim()) e.sender = 'Enter your name.';
      if (schedule && !date) e.date = 'Pick a delivery date.';
      return e;
    };

    const submit = async (e) => {
      e.preventDefault();
      if (paying) return;
      const errs = validate();
      setErrors(errs);
      setPayError('');
      if (Object.keys(errs).length > 0) return;

      setPaying(true);
      try {
        // The server re-prices the card from the saved gift card, then returns a Stripe Checkout address.
        const { url } = await startGiftCardCheckout({
          programId: card.id,
          amount: unitPay,
          quantity: qty,
          recipientName: recipient.trim(),
          recipientContact: contact.trim(),
          senderName: sender.trim(),
          message: message.trim(),
          deliveryMethod: delivery,
          deliverOn: schedule ? date : '',
        });
        window.location.assign(url);
      } catch (err) {
        setPayError(err.message || 'We couldn\u2019t start the payment. Please try again.');
        setPaying(false);
      }
    };

    const contactLabel = delivery === 'email' ? 'Recipient Email' : delivery === 'whatsapp' ? 'Recipient Mobile' : 'Recipient Email or Mobile';

    body = (
      <div className="gbuy">
        <div className="gbuy__left">
          <div className="gbuy__art">
            <GiftCardArt card={card} value={custom ? undefined : value} />
          </div>
          <div className="gbuy__how">
            <h2>How it works</h2>
            <ol>
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="gbuy__step" aria-hidden="true">{i + 1}</span>
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <form className="gbuy__panel" onSubmit={submit} noValidate>
          <header className="gbuy__head">
            <h2 className="gbuy__title">{card.name}</h2>
            {card.description ? <p className="gbuy__sub">{card.description}</p> : null}
          </header>

          <section className="gbuy__sec" aria-labelledby="gb-amount">
            <h3 id="gb-amount" className="gbuy__legend"><IconTag /> Select Amount</h3>
            <div className="gbuy__chips">
              {card.values.map((v, i) => (
                <button
                  key={`${v.amount}-${i}`}
                  type="button"
                  className={`gbuy__chip ${!custom && i === amountIndex ? 'is-active' : ''}`}
                  aria-pressed={!custom && i === amountIndex}
                  onClick={() => {
                    setCustom(false);
                    setAmountIndex(i);
                  }}
                >
                  {money(v.amount)}
                  {v.bonusAmount > 0 ? <small>+{money(v.bonusAmount)} bonus</small> : null}
                </button>
              ))}
              <button
                type="button"
                className={`gbuy__chip ${custom ? 'is-active' : ''}`}
                aria-pressed={custom}
                onClick={() => setCustom(true)}
              >
                Custom
              </button>
            </div>
            {custom ? (
              <label className="gbuy__line">
                <span className="gbuy__line-label">Amount <em>*</em></span>
                <span className="gbuy__line-field">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={minAmount}
                    step="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`Minimum ${minAmount}`}
                  />
                </span>
              </label>
            ) : null}
            {errors.amount ? <p className="gbuy__error gbuy__error--block" role="alert">{errors.amount}</p> : null}
          </section>

          <section className="gbuy__sec gbuy__sec--row" aria-labelledby="gb-qty">
            <h3 id="gb-qty" className="gbuy__legend"><IconLayers /> Quantity</h3>
            <div className="gbuy__qty">
              <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                {'\u2212'}
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" aria-label="Increase quantity" disabled={qty >= MAX_QTY} onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}>
                +
              </button>
            </div>
          </section>

          <section className="gbuy__sec" aria-labelledby="gb-delivery">
            <h3 id="gb-delivery" className="gbuy__legend"><IconSend /> Delivery Option</h3>
            <div className="gbuy__options" role="radiogroup" aria-labelledby="gb-delivery">
              {DELIVERY.map((d) => {
                const Ico = OPTION_ICONS[d.id];
                return (
                  <label key={d.id} className={`gbuy__option ${delivery === d.id ? 'is-active' : ''}`}>
                    <span className="gbuy__option-ico"><Ico /></span>
                    <span className="gbuy__option-text">
                      <span className="gbuy__option-label">{d.label}</span>
                      <small>{d.hint}</small>
                    </span>
                    <input
                      type="radio"
                      name="delivery"
                      value={d.id}
                      checked={delivery === d.id}
                      onChange={() => {
                        setDelivery(d.id);
                        setErrors((e) => ({ ...e, contact: undefined }));
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <section className="gbuy__sec" aria-labelledby="gb-recipient">
            <h3 id="gb-recipient" className="gbuy__legend"><IconUser /> Recipient Details</h3>
            <label className="gbuy__line">
              <span className="gbuy__line-label">Recipient Name <em>*</em></span>
              <span className="gbuy__line-field">
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g., Priya Sharma" autoComplete="off" />
                {errors.recipient ? <span className="gbuy__error" role="alert">{errors.recipient}</span> : null}
              </span>
            </label>
            <label className="gbuy__line">
              <span className="gbuy__line-label">{contactLabel} {delivery !== 'print' ? <em>*</em> : null}</span>
              <span className="gbuy__line-field">
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={delivery === 'whatsapp' ? 'e.g., +91 98765 43210' : 'e.g., priya@example.com'}
                  inputMode={delivery === 'whatsapp' ? 'tel' : 'email'}
                  autoComplete="off"
                />
                {errors.contact ? <span className="gbuy__error" role="alert">{errors.contact}</span> : null}
              </span>
            </label>
            <label className="gbuy__line">
              <span className="gbuy__line-label">Sender Name <em>*</em></span>
              <span className="gbuy__line-field">
                <input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g., Rahul" autoComplete="name" />
                {errors.sender ? <span className="gbuy__error" role="alert">{errors.sender}</span> : null}
              </span>
            </label>
          </section>

          <label className="gbuy__sec">
            <span className="gbuy__legend"><IconMessage /> Personal Message</span>
            <textarea
              rows={2}
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a sweet message... (optional)"
            />
            <small className="gbuy__count">{message.length} / {MAX_MESSAGE}</small>
          </label>

          <section className="gbuy__sec gbuy__sec--row gbuy__sec--when" aria-labelledby="gb-date">
            <h3 id="gb-date" className="gbuy__legend"><IconCalendar /> Delivery Date</h3>
            <div className="gbuy__options gbuy__options--two" role="radiogroup" aria-labelledby="gb-date">
              <label className={`gbuy__option gbuy__option--compact ${!schedule ? 'is-active' : ''}`}>
                <span className="gbuy__option-text"><span className="gbuy__option-label">Send now</span></span>
                <input type="radio" name="when" checked={!schedule} onChange={() => setSchedule(false)} />
              </label>
              <label className={`gbuy__option gbuy__option--compact ${schedule ? 'is-active' : ''}`}>
                <span className="gbuy__option-text"><span className="gbuy__option-label">Schedule for later</span></span>
                <input type="radio" name="when" checked={schedule} onChange={() => setSchedule(true)} />
              </label>
            </div>
            {schedule ? (
              <label className="gbuy__line gbuy__line--full">
                <span className="gbuy__line-label">Send on <em>*</em></span>
                <span className="gbuy__line-field">
                  <input type="date" min={todayIso()} value={date} onChange={(e) => setDate(e.target.value)} />
                  {errors.date ? <span className="gbuy__error" role="alert">{errors.date}</span> : null}
                </span>
              </label>
            ) : null}
          </section>

          <div className="gbuy__bottom">
            <div className="gbuy__summary">
              <h3>Purchase Summary</h3>
              <dl>
                <div><dt>Amount</dt><dd>{money(unitPay)}</dd></div>
                <div><dt>Quantity</dt><dd>{'\u00d7'} {qty}</dd></div>
                {bonusTotal > 0 ? <div><dt>Bonus value</dt><dd className="gbuy__bonus">+{money(bonusTotal)}</dd></div> : null}
                <div><dt>Delivery Fee</dt><dd className="gbuy__free">Free</dd></div>
              </dl>
              <p className="gbuy__total"><span>Total</span><strong>{money(total)}</strong></p>
            </div>

            <div className="gbuy__actions">
              <button type="submit" className="gbuy__btn gbuy__btn--primary" disabled={paying}>
                {paying ? 'Redirecting to secure payment\u2026' : `Buy Now \u2014 Pay ${money(total)}`}
              </button>
              <p className="gbuy__secure"><IconLock /> Secure card payment by Stripe</p>
              <ul className="gbuy__policy">
                <li><IconCalendar /><span>{card.validity}</span></li>
                <li><IconStore /><span>{card.redemptionLabel}</span></li>
                <li><IconCard /><span>{card.cardTypeLabel}</span></li>
              </ul>
            </div>
          </div>

          {cancelled && !payError ? (
            <p className="gbuy__notice" role="status">
              Payment was cancelled &mdash; you haven't been charged. You can review your details and try again.
            </p>
          ) : null}
          {payError ? (
            <p className="gbuy__notice gbuy__notice--error" role="alert">
              {payError} <Link to="/visit">Find us</Link> if you'd rather buy in person.
            </p>
          ) : null}
        </form>
      </div>
    );
  }

  return (
    <SpaBody compact>
      <section className="section section--cream gbuy-page">
        <div className="container">
          <nav className="gbuy__crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/offers#gift-cards">Gift Cards</Link>
            {card ? (
              <>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{card.name}</span>
              </>
            ) : null}
          </nav>
          <h1 className="gbuy__h1">Buy Gift Card</h1>
          {body}
        </div>
      </section>
    </SpaBody>
  );
}
