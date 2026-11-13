import { useCart } from '../context/CartContext';

/** Floating bag button, shown on small screens where the nav "Order now" control is hidden. */
export default function OrderFab() {
  const { count, open } = useCart();
  return (
    <button type="button" className="order-fab" onClick={open} aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
      <span className="order-fab__icon" aria-hidden="true">🍦</span>
      <span>Order now</span>
      {count > 0 && <span className="order-fab__count" aria-hidden="true">{count}</span>}
    </button>
  );
}
