import { SpaBody } from '../components/SideDecor';
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import { bgImage, images } from '../data/images';
import { HOURS, LOCATIONS } from '../data/locations';
import { usePageTitle } from '../hooks/usePageTitle';

function isOpenNow(date = new Date()) {
  const day = date.getDay();
  const weekend = day === 0 || day === 5 || day === 6;
  const { open, close } = weekend ? HOURS.weekend : HOURS.weekday;
  const h = date.getHours() + date.getMinutes() / 60;
  return h >= open && h < close;
}

/** Parse a yyyy-mm-dd value as a local calendar date, not UTC midnight. */
function parseLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function todayStamp() {
  const n = new Date();
  const mm = String(n.getMonth() + 1).padStart(2, '0');
  const dd = String(n.getDate()).padStart(2, '0');
  return `${n.getFullYear()}-${mm}-${dd}`;
}

const EMPTY = { name: '', email: '', phone: '', date: '', guests: '20', location: 'South Jordan', message: '' };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.';
  if (!/^[+\d][\d\s-]{7,}$/.test(f.phone)) e.phone = 'Enter a valid phone number.';
  if (!f.date) e.date = 'Pick a date.';
  else if (parseLocalDate(f.date) < parseLocalDate(todayStamp())) e.date = 'Date must be today or later.';
  return e;
}

function Field({ id, label, error, full, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${full ? 'form__full' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field__err" id={`${id}-error`} role="alert">{error}</span>}
    </div>
  );
}

export default function Visit() {
  usePageTitle(
    'Visit Us',
    'Visit Melting Mango in South Jordan, UT. Opening hours, directions, and private event enquiries.',
  );
  const [open, setOpen] = useState(isOpenNow());
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => clearInterval(t);
  }, []);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      setForm(EMPTY);
    }
  };

  const fieldProps = (id) => ({
    id,
    'aria-invalid': errors[id] ? 'true' : 'false',
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  });

  return (
    <SpaBody compact>
      <header className="page-head container" style={{ '--head-img': bgImage(images.waffleBowl) }}>
        <span className="eyebrow">Visit us</span>
        <h1>Come for a <em className="accent">scoop</em></h1>
        <p>Find us in South Jordan. Scoop in, or plan a private event with us.</p>
      </header>

      <section className="section section--cream" style={{ paddingTop: 0 }} aria-label="Parlour locations">
        <div className="container locations">
          {LOCATIONS.map((l, i) => (
            <Reveal as="article" className="location" key={l.name} delay={i * 100}>
              <div className="location__map">
                <iframe
                  title={`Map of Melting Mango, ${l.name}`}
                  src={l.mapsEmbed || `https://www.google.com/maps?q=${encodeURIComponent(l.address)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="location__body">
                <span className={`status ${open ? 'status--open' : 'status--closed'}`}>{open ? 'Open now' : 'Closed now'}</span>
                <span className="eyebrow" style={{ display: 'flex' }}>{l.city}</span>
                <h2 className="location__name">{l.name}</h2>
                <address>
                  <a href={l.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`} target="_blank" rel="noopener noreferrer">
                    {l.address}
                  </a>
                </address>
                {l.phone ? (
                  <p className="location__phone">
                    <a href={l.phoneTel || `tel:${l.phone}`}>{l.phone}</a>
                  </p>
                ) : null}
                <ul className="hours">
                  <li><span>Mon - Thu</span><strong>{HOURS.weekday.label}</strong></li>
                  <li><span>Fri - Sun</span><strong>{HOURS.weekend.label}</strong></li>
                  {l.exclusive ? <li><span>City exclusive</span><strong>{l.exclusive}</strong></li> : null}
                </ul>
                <a
                  className="location__directions"
                  href={l.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section--gray" id="events">
        <div className="container split" style={{ alignItems: 'start' }}>
          <Reveal>
            <span className="eyebrow">Private events</span>
            <h2>An ice cream bar for your <em className="accent">celebration</em></h2>
            <p>
              Weddings, birthdays, office parties — we bring a mobile scoop counter, uniformed scoopers and a custom menu
              with up to six flavours. We can even create a one-off flavour just for your day.
            </p>
            <p>Events start at 20 guests. Tell us a little about your plans and we’ll reply within one working day.</p>
          </Reveal>

          <Reveal className="panel" delay={120}>
            {sent ? (
              <div className="success" role="status">
                <div className="success__icon" aria-hidden="true">✓</div>
                <h3>Thank you!</h3>
                <p>We’ve received your enquiry and will be in touch within one working day.</p>
                <button className="btn btn--ghost" type="button" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form className="form" onSubmit={submit} noValidate>
                <Field id="name" label="Full name" error={errors.name}>
                  <input {...fieldProps('name')} value={form.name} onChange={set('name')} autoComplete="name" required />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input {...fieldProps('email')} type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
                </Field>
                <Field id="phone" label="Phone" error={errors.phone}>
                  <input {...fieldProps('phone')} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" required />
                </Field>
                <Field id="date" label="Event date" error={errors.date}>
                  <input {...fieldProps('date')} type="date" value={form.date} onChange={set('date')} min={todayStamp()} required />
                </Field>
                <Field id="guests" label="Guests">
                  <select id="guests" value={form.guests} onChange={set('guests')}>
                    <option value="20">20 – 50</option>
                    <option value="50">50 – 100</option>
                    <option value="100">100 – 250</option>
                    <option value="250">250+</option>
                  </select>
                </Field>
                <Field id="location" label="Nearest parlour">
                  <select id="location" value={form.location} onChange={set('location')}>
                    {LOCATIONS.map((l) => (
                      <option key={l.name}>{l.name}</option>
                    ))}
                  </select>
                </Field>
                <Field id="message" label="Tell us about your event" full>
                  <textarea id="message" value={form.message} onChange={set('message')} rows={4} />
                </Field>
                <div className="form__full">
                  <button className="btn btn--primary btn--block" type="submit">Send enquiry</button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SpaBody>
  );
}
