import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/menu', label: 'Our Flavours' },
  { to: '/story', label: 'About Us' },
  { to: '/#gallery', label: 'Gallery', hash: true },
  { to: '/visit', label: 'Contact' },
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`nav ${scrolled || menuOpen || pathname !== '/' ? 'nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Logo onClick={closeMenu} />
          <nav aria-label="Primary">
            <ul className="nav__links">
              {LINKS.map((l) => (
                <li key={l.label}>
                  {l.hash ? (
                    <Link to={l.to} onClick={closeMenu}>{l.label}</Link>
                  ) : (
                    <NavLink to={l.to} end={l.end} onClick={closeMenu}>
                      {l.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__actions">
            <button type="button" className="nav__order" onClick={open}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              Order Now
              {count > 0 && <span className="nav__order-count" aria-hidden="true">{count}</span>}
              <span className="sr-only">{`, ${count} ${count === 1 ? 'item' : 'items'} in bag`}</span>
            </button>
            <button
              type="button"
              className="nav__toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile" hidden={!menuOpen}>
        {LINKS.map((l) =>
          l.hash ? (
            <Link key={l.label} to={l.to} onClick={closeMenu}>{l.label}</Link>
          ) : (
            <NavLink key={l.label} to={l.to} end={l.end} onClick={closeMenu}>
              {l.label}
            </NavLink>
          )
        )}
        <button type="button" className="btn btn--ink mobile-menu__cta" onClick={() => { closeMenu(); open(); }}>
          Order Now
        </button>
      </nav>
    </>
  );
}
