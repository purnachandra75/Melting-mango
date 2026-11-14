import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { images } from '../data/images';

const SOCIAL = [
  {
    name: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.2s0-3.2-.4-4.6c-.2-.8-.9-1.5-1.7-1.7C18.4 5.5 12 5.5 12 5.5s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.4.4-4.6.4-4.6ZM10 15.5v-6.6l5.2 3.3L10 15.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email.');
      return;
    }
    setError('');
    setDone(true);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path d="M0 48C180 90 360 8 540 40c180 32 300 50 480 8 180-42 300-8 420 16v26H0V48Z" fill="currentColor" />
        </svg>
      </div>

      <img
        className="footer__scoops"
        src={images.mangoScoops}
        alt=""
        width="640"
        height="480"
        aria-hidden="true"
      />

      <svg className="footer__cone" viewBox="0 0 120 180" aria-hidden="true">
        <path d="M60 8c-16 18-24 38-24 54 0 18 10 32 24 32s24-14 24-32C84 46 76 26 60 8Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M40 90 60 172 80 90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M46 112h28M50 134h20M54 154h12" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>

      <div className="container footer__content">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
          </div>
          <div>
            <h2 className="footer__heading">Quick Links</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/menu">Our Flavours</Link></li>
              <li><Link to="/story">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">Support</h2>
            <ul>
              <li><a href="mailto:hello@meltingmango.in">Contact Us</a></li>
              <li><Link to="/visit">FAQs</Link></li>
              <li><Link to="/visit">Privacy Policy</Link></li>
              <li><Link to="/visit">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">Follow Us</h2>
            <ul className="footer__social" aria-label="Social">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <span className="footer__soc" title={`${s.name} — coming soon`} aria-label={`${s.name}, coming soon`}>
                    {s.icon}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__subscribe">
            <h2 className="footer__heading">Subscribe for Offers</h2>
            {done ? (
              <p className="footer__thanks" role="status">Thank you — we’ll be in touch when we have something sweet to share.</p>
            ) : (
              <form className="footer__form" onSubmit={subscribe} noValidate>
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'footer-email-error' : undefined}
                  autoComplete="email"
                />
                <button type="submit" className="footer__send" aria-label="Subscribe">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                  </svg>
                </button>
                {error && <span id="footer-email-error" className="field__err" role="alert">{error}</span>}
              </form>
            )}
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Melting Mango Creamery. All rights reserved.</span>
          <span>
            Parlour photographs via{' '}
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a>
            {' '}(Lê Quốc Hùng; Fatma Zehra Kekeç) and{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>
            . Made slowly, with love &amp; cream.
          </span>
        </div>
      </div>
    </footer>
  );
}
