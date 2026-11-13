import { useEffect, useState } from 'react';
import Scoop from './Scoop';
import { CONTAINERS, SCOOP_SIZES, formatPrice } from '../data/flavors';
import { useCart } from '../context/CartContext';

export default function FlavorModal({ flavor, onClose }) {
  const { addItem } = useCart();
  const [count, setCount] = useState(1);
  const [containerId, setContainerId] = useState(flavor.vessel);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const total = flavor.price * count * qty;

  const handleAdd = () => {
    addItem({ flavorIds: Array(count).fill(flavor.id), containerId, qty });
    onClose();
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="flavor-title">
        <button className="modal__close" onClick={onClose} aria-label="Close" autoFocus>
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
            <div className="label">Scoop size</div>
            <div className="sizes" role="radiogroup" aria-label="Scoop size">
              {SCOOP_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={s.count === count}
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
            <div className="label">Container</div>
            <div className="sizes" role="radiogroup" aria-label="Container">
              {CONTAINERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={c.id === containerId}
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
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn--primary" onClick={handleAdd}>
              Add to bag · {formatPrice(total)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
