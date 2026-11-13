import { useEffect, useRef, useState } from 'react';
import { flavors } from '../../data/flavors';

/* Marketing figures — edit these to match the real business. */
const STATS = [
  { icon: '🍦', value: flavors.length, suffix: '', label: 'Signature flavours' },
  { icon: '🏪', value: 3, suffix: '', label: 'Parlours' },
  { icon: '😊', value: 4.9, suffix: '★', label: 'Customer rating', decimals: 1 },
  { icon: '💛', value: 100, suffix: 'K+', label: 'Happy customers' },
];

function useInView(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

function CountUp({ to, decimals = 0, run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setN(to);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1600);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return n.toFixed(decimals);
}

export default function StatsBar() {
  const ref = useRef(null);
  const run = useInView(ref);
  return (
    <div className="stats-bar" ref={ref}>
      {STATS.map((s) => (
        <div className="stat" key={s.label}>
          <span className="stat__icon" aria-hidden="true">{s.icon}</span>
          <div>
            <strong>
              <CountUp to={s.value} decimals={s.decimals} run={run} />
              {s.suffix}
            </strong>
            <span>{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
