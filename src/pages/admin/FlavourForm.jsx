import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AVAILABILITY_OPTIONS,
  DIET_OPTIONS,
  emptyFlavour,
  getAdminContainers,
  getAdminFlavors,
  saveAdminFlavors,
  slugify,
} from '../../data/adminStore';

export default function FlavourForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const existing = useMemo(() => {
    if (isNew) return null;
    return getAdminFlavors().find((f) => f.id === id) || null;
  }, [id, isNew]);

  const [form, setForm] = useState(() => (existing ? { ...emptyFlavour(), ...existing } : emptyFlavour()));
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const containers = getAdminContainers();

  useEffect(() => {
    if (existing) setForm({ ...emptyFlavour(), ...existing });
  }, [existing]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleDiet = (tag) => {
    setForm((f) => {
      const has = f.diet?.includes(tag);
      const diet = has ? f.diet.filter((t) => t !== tag) : [...(f.diet || []), tag];
      return { ...f, diet };
    });
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set('photo', String(reader.result || ''));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Flavour name is required.');
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid rate per scoop.');
      return;
    }

    const list = getAdminFlavors();
    const nextId = isNew ? slugify(form.name) : form.id;
    if (isNew && list.some((f) => f.id === nextId)) {
      setError('A flavour with this name already exists.');
      return;
    }

    const tags = [
      ...(form.diet || []),
      form.availability === 'Seasonal' ? 'Seasonal' : null,
    ].filter(Boolean);

    const payload = {
      ...form,
      id: nextId,
      name: form.name.trim(),
      price,
      tags: [...new Set([...(form.tags || []).filter((t) => !DIET_OPTIONS.includes(t) && t !== 'Seasonal'), ...tags])],
      notes: form.notes.trim(),
      description: form.description.trim(),
    };

    const next = isNew ? [...list, payload] : list.map((f) => (f.id === id ? payload : f));
    saveAdminFlavors(next);
    setToast(isNew ? 'Flavour added to catalog' : 'Flavour saved');
    window.setTimeout(() => navigate('/admin'), 700);
  };

  return (
    <div className="admin-page">
      <p className="admin-eyebrow">Menu catalog</p>
      <h1>{isNew ? 'Add flavour' : 'Edit flavour'}</h1>
      <p className="admin-lead">
        Add a scoop flavour to your catalog. Guests will see this on the menu and scoop builder.
      </p>

      <form onSubmit={save}>
        {/* Photo */}
        <section className="admin-card">
          <h2 className="admin-card__title">Flavour photo</h2>
          <div className="admin-photo">
            <div className="admin-photo__preview">
              {form.photo ? <img src={form.photo} alt="" /> : (
                <>
                  <div>No photo</div>
                </>
              )}
            </div>
            <div className="admin-photo__actions">
              <input ref={fileRef} className="admin-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => fileRef.current?.click()}>
                Upload photo
              </button>
              <p className="hint">JPEG, PNG, or WebP — max 2 MB</p>
              <input
                className="admin-input"
                placeholder="Or paste image URL…"
                value={form.photo?.startsWith('data:') ? '' : form.photo}
                onChange={(e) => set('photo', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="admin-card">
          <h2 className="admin-card__title">Flavour details</h2>

          <div className="admin-field">
            <label htmlFor="fname">
              Flavour name<span className="req">*</span>
            </label>
            <input
              id="fname"
              className="admin-input"
              placeholder="e.g. Mango"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Availability</label>
              <div className="admin-chips" role="group" aria-label="Availability">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`admin-chip ${form.availability === opt ? 'is-on' : ''}`}
                    onClick={() => set('availability', opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="hint">Seasonal flavours can be limited while the harvest lasts.</p>
            </div>

            <div className="admin-field">
              <label htmlFor="price">
                Rate per scoop ($)<span className="req">*</span>
              </label>
              <input
                id="price"
                className="admin-input"
                inputMode="decimal"
                placeholder="5"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                required
              />
              <p className="hint">Charged per scoop. Two scoops of a $5 flavour = $10.</p>
            </div>
          </div>

          <div className="admin-field">
            <label>Diet tags</label>
            <div className="admin-chips" role="group" aria-label="Diet tags">
              {DIET_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`admin-chip is-ok ${form.diet?.includes(opt) ? 'is-on' : ''}`}
                  onClick={() => toggleDiet(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="hint">Select all that apply for allergens and diet filters.</p>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label htmlFor="vessel">Default container</label>
              <select
                id="vessel"
                className="admin-select"
                value={form.vessel}
                onChange={(e) => set('vessel', e.target.value)}
              >
                {containers.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="color">Scoop colour</label>
              <div className="admin-color-row">
                <input
                  id="color"
                  type="color"
                  value={form.color || '#F6C945'}
                  onChange={(e) => set('color', e.target.value)}
                />
                <span className="admin-swatch" style={{ background: form.color }} />
                <input
                  className="admin-input"
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  aria-label="Colour hex"
                />
              </div>
              <p className="hint">Used for the illustrated scoop on the storefront.</p>
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="notes">Notes / ingredients line</label>
            <input
              id="notes"
              className="admin-input"
              placeholder="e.g. Alphonso mango · fresh cream · sea salt"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              className="admin-textarea"
              placeholder="Short description for the menu and parlour board…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Visibility</label>
            <div className="admin-chips">
              <button
                type="button"
                className={`admin-chip ${form.active !== false ? 'is-on' : ''}`}
                onClick={() => set('active', true)}
              >
                Active on menu
              </button>
              <button
                type="button"
                className={`admin-chip ${form.active === false ? 'is-on' : ''}`}
                onClick={() => set('active', false)}
              >
                Hidden
              </button>
            </div>
          </div>
        </section>

        {error && (
          <p style={{ color: '#b33b32', fontWeight: 600, margin: '0 0 12px' }}>{error}</p>
        )}

        <div className="admin-actions">
          <Link to="/admin" className="admin-btn admin-btn--ghost">Cancel</Link>
          <button type="submit" className="admin-btn admin-btn--primary">
            {isNew ? 'Add flavour' : 'Save changes'}
          </button>
        </div>
      </form>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
