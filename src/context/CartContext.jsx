import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SCOOP_SIZES, containerById, flavorById } from '../data/flavors';

const CartContext = createContext(null);
const STORAGE_KEY = 'melting-mango-cart-v2';

/** A cart line is a combination: 1–3 scoops (flavour ids) in one container. */
const isValidLine = (i) =>
  i &&
  Array.isArray(i.flavorIds) &&
  i.flavorIds.length >= 1 &&
  i.flavorIds.length <= 3 &&
  i.flavorIds.every(flavorById) &&
  containerById(i.containerId) &&
  Number.isInteger(i.qty) &&
  i.qty > 0;

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isValidLine) : [];
  } catch {
    return [];
  }
}

export function describeLine(flavorIds) {
  const names = flavorIds.map((id) => flavorById(id).name);
  const allSame = names.every((n) => n === names[0]);
  return allSame ? names[0] : names.join(' · ');
}

/* Sprinkle burst at a screen point — a small celebratory "add to bag" effect. */
const BURST_COLORS = ['#F6C945', '#F29F05', '#E8707A', '#BFD39A', '#FFFFFF', '#5B3A2E'];
function sprinkleBurst(x, y) {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'burst';
  layer.style.left = `${x}px`;
  layer.style.top = `${y}px`;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
    const dist = 50 + Math.random() * 60;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.setProperty('--r', `${Math.random() * 360}deg`);
    s.style.background = BURST_COLORS[i % BURST_COLORS.length];
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 900);
}

export function CartProvider({ children }) {
  const lastPointer = useRef(null);

  useEffect(() => {
    const onDown = (e) => (lastPointer.current = { x: e.clientX, y: e.clientY });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart still works in memory */
    }
  }, [items]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const addItem = useCallback(
    ({ flavorIds, containerId, qty = 1 }) => {
      const line = { key: `${flavorIds.join('+')}|${containerId}`, flavorIds, containerId, qty };
      if (!isValidLine(line)) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.key === line.key);
        if (existing) return prev.map((i) => (i.key === line.key ? { ...i, qty: i.qty + qty } : i));
        return [...prev, line];
      });
      notify(`${describeLine(flavorIds)} added to your bag`);
      if (lastPointer.current) sprinkleBurst(lastPointer.current.x, lastPointer.current.y);
    },
    [notify]
  );

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const detailed = useMemo(
    () =>
      items.map((i) => {
        const lineFlavors = i.flavorIds.map(flavorById);
        const size = SCOOP_SIZES.find((s) => s.count === i.flavorIds.length);
        const container = containerById(i.containerId);
        const unit = lineFlavors.reduce((sum, f) => sum + f.price, 0);
        return { ...i, flavors: lineFlavors, size, container, name: describeLine(i.flavorIds), unit, total: unit * i.qty };
      }),
    [items]
  );

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = detailed.reduce((n, i) => n + i.total, 0);

  const value = { items: detailed, count, subtotal, isOpen, open, close, addItem, updateQty, removeItem, clear, toast, notify };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
