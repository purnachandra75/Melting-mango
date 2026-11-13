import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Flavours' },
  { to: '/#rewards', label: 'Rewards', hash: true },
  { to: '/story', label: 'Our Story' },
  { to: '/visit', label: 'Visit' },
];

export default function Navbar() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  return (
    <>
      <header className={`nav ${scrolled || menuOpen ? 'nav--scrolled' : ''}`} style={{ zIndex: 60 }}>
        <div className="container nav__inner">
          <Logo />
          <nav aria-label="Primary">
            <ul className="nav__links">
              {LINKS.map((l) => (
                <li key={l.to}>
                  {l.hash ? (
                    <Link to={l.to}>{l.label}</Link>
                  ) : (
                    <NavLink to={l.to} end={l.end}>
                      {l.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__actions">
            <Link to="/menu" className="btn btn--primary">
              Order now
            </Link>
            <button className="cart-btn" onClick={open} aria-label={`Open bag, ${count} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {count > 0 && <span className="cart-btn__count">{count}</span>}
            </button>
            <button className="nav__toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {LINKS.map((l) =>
          l.hash ? (
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ) : (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          )
        )}
        <Link to="/menu" className="btn btn--primary" style={{ marginTop: 24, fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          Order now
        </Link>
      </div>
    </>
  );
}
