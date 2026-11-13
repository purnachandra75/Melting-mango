import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';

// Hours in 24h; close of 24 means midnight.
const HOURS = {
  weekday: { open: 12, close: 23, label: '12 PM – 11 PM' },
  weekend: { open: 11, close: 24, label: '11 AM – 12 AM' },
};

const LOCATIONS = [
  { city: 'Hyderabad', name: 'Jubilee Hills', address: 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad 500033', exclusive: 'Irani Chai & Osmania' },
  { city: 'Bengaluru', name: 'Indiranagar', address: '812, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560008', exclusive: 'Filter Coffee Fudge' },
  { city: 'Mumbai', name: 'Bandra West', address: '17, Chapel Road, Ranwar Village, Bandra West, Mumbai 400050', exclusive: 'Chikki Crunch' },
];

function isOpenNow(date = new Date()) {
  const day = date.getDay();
  const weekend = day === 0 || day === 5 || day === 6;
  const { open, close } = weekend ? HOURS.weekend : HOURS.weekday;
  const h = date.getHours() + date.getMinutes() / 60;
  return h >= open && h < close;
}

const EMPTY = { name: '', email: '', phone: '', date: '', guests: '20', location: 'Jubilee Hills', message: '' };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.';
  if (!/^[+\d][\d\s-]{7,}$/.test(f.phone)) e.phone = 'Enter a valid phone number.';
  if (!f.date) e.date = 'Pick a date.';
  else if (new Date(f.date) < new Date(new Date().toDateString())) e.date = 'Date must be in the future.';
  return e;
}

function Field({ id, label, error, full, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${full ? 'form__full' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field__err">{error}</span>}
    </div>
  );
}

export default function Visit() {
  const [open, setOpen] = useState(isOpenNow());
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => clearInterval(t);
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      setForm(EMPTY);
    }
  };

  return (
    <>
      <header className="page-head container" style={{ '--head-img': 'url(/images/waffle-bowl.jpg)' }}>
        <span className="eyebrow">Visit us</span>
        <h1>Come for a <em className="accent">scoop</em></h1>
        <p>Three parlours, one recipe book. Each one also serves a city-exclusive flavour you won’t find anywhere else.</p>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container locations">
          {LOCATIONS.map((l, i) => (
            <Reveal className="location" key={l.name} delay={i * 100}>
              <div className="location__map" aria-hidden="true" />
              <div className="location__body">
                <span className={`status ${open ? 'status--open' : 'status--closed'}`}>{open ? 'Open now' : 'Closed now'}</span>
                <span className="eyebrow" style={{ display: 'flex' }}>{l.city}</span>
                <h3 style={{ marginTop: 8 }}>{l.name}</h3>
                <address>{l.address}</address>
                <ul className="hours">
                  <li><span>Mon – Thu</span><strong>{HOURS.weekday.label}</strong></li>
                  <li><span>Fri – Sun</span><strong>{HOURS.weekend.label}</strong></li>
                  <li><span>City exclusive</span><strong>{l.exclusive}</strong></li>
                </ul>
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
              <div className="success">
                <div className="success__icon">✓</div>
                <h3>Thank you!</h3>
                <p>We’ve received your enquiry and will be in touch within one working day.</p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form className="form" onSubmit={submit} noValidate>
                <Field id="name" label="Full name" error={errors.name}>
                  <input id="name" value={form.name} onChange={set('name')} autoComplete="name" />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                </Field>
                <Field id="phone" label="Phone" error={errors.phone}>
                  <input id="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                </Field>
                <Field id="date" label="Event date" error={errors.date}>
                  <input id="date" type="date" value={form.date} onChange={set('date')} />
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
                  <textarea id="message" value={form.message} onChange={set('message')} />
                </Field>
                <div className="form__full">
                  <button className="btn btn--primary btn--block" type="submit">Send enquiry</button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
