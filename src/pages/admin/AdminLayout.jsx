import { NavLink, Outlet, Link } from 'react-router-dom';
import '../../styles/admin.css';

const LINKS = [
  { to: '/admin', end: true, label: 'Flavours' },
  { to: '/admin/flavours/new', end: false, label: 'Add flavour' },
  { to: '/admin/settings', end: false, label: 'Settings' },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-top__inner">
          <Link to="/admin" className="admin-top__brand">
            <img src="/images/logo.jpg" alt="" />
            Melting Mango Admin
          </Link>
          <nav className="admin-top__nav" aria-label="Admin">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/" className="admin-top__exit">
            ← Storefront
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
