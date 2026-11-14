import { useState } from 'react';
import {
  getAdminContainers,
  getAdminScoops,
  saveAdminContainers,
  saveAdminScoops,
} from '../../data/adminStore';

export default function MenuSettings() {
  const [scoops, setScoops] = useState(() => getAdminScoops());
  const [containers, setContainers] = useState(() => getAdminContainers());
  const [toast, setToast] = useState('');

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1800);
  };

  const updateScoop = (i, key, value) => {
    setScoops((list) => list.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  };

  const addScoop = () => {
    const n = scoops.length + 1;
    setScoops((list) => [...list, { id: `size-${n}`, label: `Size ${n}`, count: n }]);
  };

  const removeScoop = (i) => {
    setScoops((list) => list.filter((_, idx) => idx !== i));
  };

  const updateContainer = (i, key, value) => {
    setContainers((list) => list.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)));
  };

  const addContainer = () => {
    const n = containers.length + 1;
    setContainers((list) => [...list, { id: `container-${n}`, label: `Container ${n}`, note: '' }]);
  };

  const removeContainer = (i) => {
    setContainers((list) => list.filter((_, idx) => idx !== i));
  };

  const saveScoops = (e) => {
    e.preventDefault();
    const cleaned = scoops
      .filter((s) => s.label.trim())
      .map((s, i) => ({
        id: s.id || `size-${i + 1}`,
        label: s.label.trim(),
        count: Math.max(1, Number(s.count) || i + 1),
      }));
    setScoops(cleaned);
    saveAdminScoops(cleaned);
    flash('Scoop sizes saved');
  };

  const saveContainers = (e) => {
    e.preventDefault();
    const cleaned = containers
      .filter((c) => c.label.trim())
      .map((c, i) => ({
        id: c.id || `container-${i + 1}`,
        label: c.label.trim(),
        note: (c.note || '').trim(),
      }));
    setContainers(cleaned);
    saveAdminContainers(cleaned);
    flash('Containers saved');
  };

  return (
    <div className="admin-page">
      <p className="admin-eyebrow">Menu catalog</p>
      <h1>Settings</h1>
      <p className="admin-lead">
        Scoop sizes and containers apply to every flavour. Guests pick these when building an order.
      </p>

      <form className="admin-card" onSubmit={saveScoops}>
        <h2 className="admin-card__title">Scoop sizes</h2>
        <p className="hint" style={{ marginTop: -8, marginBottom: 16 }}>
          From your sheet: One · Two · Three
        </p>
        {scoops.map((s, i) => (
          <div className="admin-grid-2" key={s.id || i} style={{ marginBottom: 12 }}>
            <div className="admin-field" style={{ marginBottom: 0 }}>
              <label>Label</label>
              <input
                className="admin-input"
                value={s.label}
                onChange={(e) => updateScoop(i, 'label', e.target.value)}
                placeholder="One"
              />
            </div>
            <div className="admin-field" style={{ marginBottom: 0 }}>
              <label>Scoop count</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="admin-input"
                  type="number"
                  min="1"
                  value={s.count}
                  onChange={(e) => updateScoop(i, 'count', e.target.value)}
                />
                <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeScoop(i)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={addScoop}>
            + Add size
          </button>
          <button type="submit" className="admin-btn admin-btn--primary">
            Save scoop sizes
          </button>
        </div>
      </form>

      <form className="admin-card" onSubmit={saveContainers}>
        <h2 className="admin-card__title">Container types</h2>
        <p className="hint" style={{ marginTop: -8, marginBottom: 16 }}>
          From your sheet: Waffle Cone · Cup · Sugar Cone
        </p>
        {containers.map((c, i) => (
          <div key={c.id || i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < containers.length - 1 ? '1px solid #e6e6ea' : 'none' }}>
            <div className="admin-grid-2">
              <div className="admin-field">
                <label>Container name</label>
                <input
                  className="admin-input"
                  value={c.label}
                  onChange={(e) => updateContainer(i, 'label', e.target.value)}
                  placeholder="Waffle Cone"
                />
              </div>
              <div className="admin-field">
                <label>Short note</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="admin-input"
                    value={c.note || ''}
                    onChange={(e) => updateContainer(i, 'note', e.target.value)}
                    placeholder="Golden & crisp"
                  />
                  <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeContainer(i)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={addContainer}>
            + Add container
          </button>
          <button type="submit" className="admin-btn admin-btn--primary">
            Save containers
          </button>
        </div>
      </form>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
