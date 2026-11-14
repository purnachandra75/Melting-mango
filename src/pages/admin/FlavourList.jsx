import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/flavors';
import { getAdminFlavors, saveAdminFlavors } from '../../data/adminStore';

export default function FlavourList() {
  const [list, setList] = useState(() => getAdminFlavors());
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (f) =>
        f.name.toLowerCase().includes(needle) ||
        f.availability?.toLowerCase().includes(needle)
    );
  }, [list, q]);

  const toggleActive = (id) => {
    const next = list.map((f) => (f.id === id ? { ...f, active: !f.active } : f));
    setList(next);
    saveAdminFlavors(next);
    setToast('Flavour updated');
    window.setTimeout(() => setToast(''), 1800);
  };

  const remove = (id) => {
    if (!window.confirm('Remove this flavour from the catalog?')) return;
    const next = list.filter((f) => f.id !== id);
    setList(next);
    saveAdminFlavors(next);
    setToast('Flavour removed');
    window.setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="admin-page">
      <p className="admin-eyebrow">Menu catalog</p>
      <h1>Flavours</h1>
      <p className="admin-lead">Manage scoop flavours guests see on the menu and scoop builder.</p>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          style={{ maxWidth: 280 }}
          placeholder="Search flavours…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search flavours"
        />
        <Link to="/admin/flavours/new" className="admin-btn admin-btn--primary">
          + Add flavour
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="admin-empty">No flavours yet. Add your first scoop.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Flavour</th>
                <th>Availability</th>
                <th>Rate / scoop</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id}>
                  <td>
                    {f.photo ? (
                      <img className="admin-row-thumb" src={f.photo} alt="" />
                    ) : (
                      <span className="admin-row-thumb" style={{ background: f.color || '#eee' }} />
                    )}
                  </td>
                  <td>
                    <strong>{f.name}</strong>
                    {f.notes && (
                      <div style={{ color: '#6b6c74', fontSize: '0.8rem', marginTop: 2 }}>{f.notes}</div>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge ${f.availability === 'Seasonal' ? 'admin-badge--seasonal' : ''}`}>
                      {f.availability || 'Normal'}
                    </span>
                  </td>
                  <td>{formatPrice(Number(f.price) || 0)}</td>
                  <td>
                    <span className={`admin-badge ${f.active === false ? 'admin-badge--off' : ''}`}>
                      {f.active === false ? 'Hidden' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/flavours/${f.id}`} className="admin-btn admin-btn--ghost" style={{ padding: '8px 12px' }}>
                        Edit
                      </Link>
                      <button type="button" className="admin-btn admin-btn--ghost" style={{ padding: '8px 12px' }} onClick={() => toggleActive(f.id)}>
                        {f.active === false ? 'Show' : 'Hide'}
                      </button>
                      <button type="button" className="admin-btn admin-btn--danger" style={{ padding: '8px 12px' }} onClick={() => remove(f.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
