import { useCart } from '../context/CartContext';

/** Floating "Order" button, always reachable in the corner. */
export default function OrderFab() {
  const { count, open } = useCart();
  return (
    <button className="order-fab" onClick={open} aria-label={`Open bag, ${count} items`}>
      <span className="order-fab__icon" aria-hidden="true">🍦</span>
      <span>Order now</span>
      {count > 0 && <span className="order-fab__count">{count}</span>}
    </button>
  );
}
