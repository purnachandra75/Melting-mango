import { useState } from 'react';
import Scoop from './Scoop';
import { CONTAINERS, SCOOP_SIZES, formatPrice } from '../data/flavors';
import { useCart } from '../context/CartContext';
import { useDialog } from '../hooks/useDialog';
import { useMenuConfig } from '../context/MenuConfigContext';
import { pointsForPrice } from '../lib/loyalty';

function cycle(list, current, key, getId) {
  if (key !== 'ArrowRight' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowUp') return null;
  const i = list.findIndex((item) => getId(item) === current);
  if (i < 0) return null;
  const next = key === 'ArrowRight' || key === 'ArrowDown'
    ? list[(i + 1) % list.length]
    : list[(i - 1 + list.length) % list.length];
  return getId(next);
}

export default function FlavorModal({ flavor, onClose }) {
  const { addItem } = useCart();
  const menuConfig = useMenuConfig();
  const [count, setCount] = useState(1);
  const [containerId, setContainerId] = useState(flavor.vessel);
  const [qty, setQty] = useState(1);
  const dialogRef = useDialog(true, onClose);

  const total = flavor.price * count * qty;

  const handleAdd = () => {
    addItem({ flavorIds: Array(count).fill(flavor.id), containerId, qty });
    onClose();
  };

  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <div
        className="modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flavor-title"
        tabIndex={-1}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal__art" style={{ background: flavor.tint }}>
          <Scoop scoops={Array(count).fill(flavor.color)} vessel={containerId} topping={flavor.topping} size={220} title={flavor.name} animate />
        </div>
        <div className="modal__body">
          <span className="eyebrow">{flavor.availability === 'Seasonal' ? 'Seasonal flavour' : 'Available daily'}</span>
          <h2 id="flavor-title">{flavor.name}</h2>
          <p>{flavor.description}</p>
          <div className="tags">
            {flavor.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>

          <div>
            <div className="label" id="scoop-size-label">Scoop size</div>
            <div
              className="sizes"
              role="radiogroup"
              aria-labelledby="scoop-size-label"
              onKeyDown={(e) => {
                const next = cycle(SCOOP_SIZES, count, e.key, (s) => s.count);
                if (next != null) {
                  e.preventDefault();
                  setCount(next);
                }
              }}
            >
              {SCOOP_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={s.count === count}
                  tabIndex={s.count === count ? 0 : -1}
                  className={`size ${s.count === count ? 'active' : ''}`}
                  onClick={() => setCount(s.count)}
                >
                  <strong>{s.label}</strong>
                  <span>{formatPrice(flavor.price * s.count)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label" id="container-label">Container</div>
            <div
              className="sizes"
              role="radiogroup"
              aria-labelledby="container-label"
              onKeyDown={(e) => {
                const next = cycle(CONTAINERS, containerId, e.key, (c) => c.id);
                if (next != null) {
                  e.preventDefault();
                  setContainerId(next);
                }
              }}
            >
              {CONTAINERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={c.id === containerId}
                  tabIndex={c.id === containerId ? 0 : -1}
                  className={`size ${c.id === containerId ? 'active' : ''}`}
                  onClick={() => setContainerId(c.id)}
                >
                  <strong>{c.label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="modal__buy">
            <div className="qty">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span aria-live="polite" aria-atomic="true">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className="btn btn--primary" onClick={handleAdd}>
              Add to bag · {formatPrice(total)}
            </button>
            {pointsForPrice(total, menuConfig) != null ? (
              <span className="earn-tag earn-tag--modal">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432z" />
                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
                {`Earn ${pointsForPrice(total, menuConfig)} Points`}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
