import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

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
      <div className="container footer__content">
        <div className="footer__top">
          <div>
            <Logo />
            <p>Small-batch, slow-churned ice cream made every morning with ripe fruit, real cream and nothing artificial.</p>
          </div>
          <div>
            <h2 className="footer__heading">Quick Links</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/#rewards">Rewards</Link></li>
              <li><Link to="/story">Our Story</Link></li>
              <li><Link to="/visit">Visit</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">Support</h2>
            <ul>
              <li><a href="mailto:hello@meltingmango.in">Contact Us</a></li>
              <li><Link to="/visit#events">Private events</Link></li>
              <li><a href="tel:+914000000000">+91 40 0000 0000</a></li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">Follow Us</h2>
            <ul>
              <li>Instagram · @meltingmango</li>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 12h14M13 6l6 6-6 6" />
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
