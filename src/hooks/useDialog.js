import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(node) {
  if (!node) return [];
  return [...node.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.getAttribute('aria-hidden') !== 'true' && !el.hasAttribute('data-focus-exclude')
  );
}

/**
 * Locks scroll, closes on Escape, traps Tab focus, and restores
 * the previously focused element when the dialog closes.
 * Returns a ref to attach to the dialog container.
 */
export function useDialog(active, onClose) {
  const ref = useRef(null);
  const previous = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;

    previous.current = document.activeElement;
    const node = ref.current;
    const frame = requestAnimationFrame(() => {
      const first = getFocusable(node)[0];
      (first || node)?.focus?.();
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable(node);
      if (!items.length) {
        e.preventDefault();
        node?.focus?.();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      const restore = previous.current;
      if (restore && typeof restore.focus === 'function' && document.contains(restore)) {
        restore.focus();
      }
    };
  }, [active]);

  return ref;
}
