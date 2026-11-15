import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { CONTACT, HOURS, mapsSearchUrl } from '../data/locations';

const SOCIAL = [
  { name: 'Instagram', d: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".8" fill="currentColor" /></> },
  { name: 'Facebook', d: <path d="M14 8h3V4.5h-3a4 4 0 0 0-4 4V11H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1Z" /> },
  { name: 'YouTube', d: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" /></> },
];

const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6.4 6.4l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v5l3 2" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const year = new Date().getFullYear();
  const mapsUrl = mapsSearchUrl(CONTACT.address);

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email.'); return; }
    setError(''); setDone(true); setEmail('');
  };

  return (
    <footer className="footer r2-footer">
      <svg className="r2-footer__wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 50C180 10 360 10 540 40s360 50 540 20 270-40 360-30v60H0Z" fill="currentColor" />
      </svg>
      <div className="container r2-footer__top">
        <div className="r2-footer__brand">
          <Logo />
          <p>Pure Ice Cream. Real Ingredients. Handcrafted Daily.</p>
          <ul className="r2-footer__social">
            {SOCIAL.map((s) => (
              <li key={s.name}>
                <span className="r2-footer__soc" title={`${s.name} - coming soon`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{s.d}</svg>
                  <span className="sr-only">{s.name} (coming soon)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="r2-footer__h">Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/story">About Us</Link></li>
            <li><Link to="/visit">Visit</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="r2-footer__h">Support</h2>
          <ul>
            <li><a href="mailto:hello@meltingmango.in">Contact Us</a></li>
            <li><Link to="/visit">FAQs</Link></li>
            <li><Link to="/visit">Privacy Policy</Link></li>
            <li><Link to="/visit">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div className="r2-footer__visit">
          <h2 className="r2-footer__h">Visit Us</h2>
          <ul>
            <li>
              <span className="r2-footer__ic" aria-hidden="true"><IconPin /></span>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <span>{CONTACT.streetLine}</span>
                <span>{CONTACT.localityLine}</span>
              </a>
            </li>
            <li>
              <span className="r2-footer__ic" aria-hidden="true"><IconPhone /></span>
              <a href={CONTACT.phoneTel}>{CONTACT.phone}</a>
            </li>
            <li>
              <span className="r2-footer__ic" aria-hidden="true"><IconClock /></span>
              <span>
                <span>Mon - Thu {HOURS.weekday.label}</span>
                <span>Fri - Sun {HOURS.weekend.label}</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="r2-footer__sub">
          <h2 className="r2-footer__h">Subscribe for Offers</h2>
          {done ? (
            <p className="r2-footer__thanks" role="status">Thank you - we will be in touch when we have something sweet to share.</p>
          ) : (
            <form className="r2-footer__form" onSubmit={subscribe} noValidate>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                aria-invalid={error ? 'true' : 'false'}
                autoComplete="email"
              />
              <button type="submit" aria-label="Subscribe">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" /></svg>
              </button>
              {error && <span className="r2-footer__err" role="alert">{error}</span>}
            </form>
          )}
        </div>
      </div>
      <div className="r2-footer__bar">
        <div className="container r2-footer__bar-in">
          <span>{'\u00A9'} {year} Melting Mango Creamery. All rights reserved.</span>
          <span>Photographs via <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a> &amp; <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>.</span>
        </div>
      </div>
    </footer>
  );
}
