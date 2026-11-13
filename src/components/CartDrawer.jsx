import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Scoop from './Scoop';
import { formatPrice } from '../data/flavors';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, subtotal, isOpen, close, updateQty, removeItem, clear } = useCart();
  const [placed, setPlaced] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) setPlaced(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const checkout = () => {
    setPlaced({ id: `MM-${Math.floor(1000 + Math.random() * 9000)}`, total: subtotal });
    clear();
  };

  return (
    <>
      <div className="overlay" onClick={close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="drawer__head">
          <h3>Your bag</h3>
          <button className="modal__close" style={{ position: 'static' }} onClick={close} aria-label="Close bag">
            ×
          </button>
        </div>

        {placed ? (
          <div className="drawer__items">
            <div className="success">
              <div className="success__icon">✓</div>
              <h3>Order placed!</h3>
              <p>
                Order <strong>{placed.id}</strong> · {formatPrice(placed.total)}. We’re scooping it now — ready for pickup in about 15 minutes.
              </p>
              <button className="btn btn--ghost" onClick={close}>Back to the site</button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="drawer__items">
            <div className="drawer__empty">
              <Scoop scoops={['#ECECEE']} size={90} />
              <h4>Your bag is empty</h4>
              <p>Something sweet is only a scoop away.</p>
              <Link to="/menu" className="btn btn--primary" onClick={close}>Browse flavours</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="drawer__items">
              {items.map((i) => (
                <div className="drawer__item" key={i.key}>
                  <div className="drawer__thumb" style={{ background: i.flavors[0].tint }}>
                    <Scoop scoops={i.flavors.map((f) => f.color)} vessel={i.container.id} size={44} />
                  </div>
                  <div>
                    <h4>{i.name}</h4>
                    <small>
                      {i.size.label} scoop{i.size.count > 1 ? 's' : ''} · {i.container.label} · {formatPrice(i.unit)}
                    </small>
                    <div className="qty">
                      <button onClick={() => updateQty(i.key, i.qty - 1)} aria-label={`Decrease ${i.name}`}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => updateQty(i.key, i.qty + 1)} aria-label={`Increase ${i.name}`}>+</button>
                    </div>
                  </div>
                  <div className="drawer__price">
                    {formatPrice(i.total)}
                    <br />
                    <button className="drawer__remove" onClick={() => removeItem(i.key)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer__foot">
              <div className="drawer__row drawer__row--total"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
              <p className="drawer__fine">Rewards are applied at the counter — one free scoop reward per transaction.</p>
              <button className="btn btn--mango btn--block" onClick={checkout}>Checkout for pickup</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
