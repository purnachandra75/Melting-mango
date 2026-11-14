import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const SOCIAL = [
  { name: 'Instagram', d: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".8" fill="currentColor" /></> },
  { name: 'Facebook', d: <path d="M14 8h3V4.5h-3a4 4 0 0 0-4 4V11H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1Z" /> },
  { name: 'YouTube', d: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" /></> },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

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
          <p>Pure Ice Cream.<br />Real Ingredients.<br />Handcrafted Daily.</p>
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
        <div>
          <h2 className="r2-footer__h">Follow Us</h2>
          <ul className="r2-footer__social">
            {SOCIAL.map((s) => (
              <li key={s.name}>
                <span className="r2-footer__soc" title={`${s.name} — coming soon`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{s.d}</svg>
                  <span className="sr-only">{s.name} (coming soon)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="r2-footer__sub">
          <h2 className="r2-footer__h">Subscribe for Offers</h2>
          {done ? (
            <p role="status">Thank you — we’ll be in touch when we have something sweet to share.</p>
          ) : (
            <form className="r2-footer__form" onSubmit={subscribe} noValidate>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input id="footer-email" type="email" placeholder="Enter your email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                aria-invalid={error ? 'true' : 'false'} autoComplete="email" />
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
          <span>© {new Date().getFullYear()} Melting Mango Creamery. All rights reserved.</span>
          <span>Photographs via <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a> &amp; <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>.</span>
        </div>
      </div>
    </footer>
  );
}
