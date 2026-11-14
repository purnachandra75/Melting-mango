import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/menu#flavours', label: 'Our Flavours', hash: true },
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
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const item = (l) =>
    l.hash ? (
      <Link to={l.to} onClick={closeMenu}>{l.label}</Link>
    ) : (
      <NavLink to={l.to} end={l.end} onClick={closeMenu}>{l.label}</NavLink>
    );

  return (
    <>
      <header className={`nav ${scrolled || menuOpen ? 'nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Logo onClick={closeMenu} />
          <nav aria-label="Primary">
            <ul className="nav__links">
              {LINKS.map((l) => <li key={l.label}>{item(l)}</li>)}
            </ul>
          </nav>
          <div className="nav__actions">
            <Link to="/menu" className="nav__icon" aria-label="Search the menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" />
              </svg>
            </Link>
            <button type="button" className="nav__icon" onClick={open} aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <span className="nav__badge" aria-hidden="true">{count}</span>
            </button>
            <Link to="/menu" className="nav__cta">
              Order Now <span aria-hidden="true">{'\u2192'}</span>
            </Link>
            <button
              type="button"
              className="nav__toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile" hidden={!menuOpen}>
        {LINKS.map((l) => <span key={l.label} style={{ display: 'contents' }}>{item(l)}</span>)}
        <Link to="/menu" className="nav__cta mobile-menu__cta" onClick={closeMenu}>Order Now</Link>
      </nav>
    </>
  );
}
