/* Mango leaves, mango cubes and sprinkles drifting down behind the hero. */

const KINDS = ['leaf', 'cube', 'sprinkle', 'leaf', 'sprinkle', 'cube', 'dot'];
const SPRINKLE_COLORS = ['#F6C945', '#FFFFFF', '#E8707A', '#BFD39A', '#F29F05'];

const ITEMS = Array.from({ length: 22 }, (_, i) => {
  const r = (n) => (Math.sin(i * 91.7 + n * 17.3) + 1) / 2; // deterministic 0..1
  return {
    kind: KINDS[i % KINDS.length],
    left: `${(r(1) * 100).toFixed(2)}%`,
    delay: `${(-r(2) * 18).toFixed(2)}s`,
    duration: `${(12 + r(3) * 12).toFixed(2)}s`,
    rot: `${Math.round(r(4) * 360)}deg`,
    scale: (0.6 + r(5) * 0.7).toFixed(2),
    color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
  };
});

function LeafIcon() {
  return (
    <svg viewBox="0 0 40 20" width="30" height="15" aria-hidden="true">
      <path d="M0 10 C 8 0 26 -2 40 6 C 28 16 12 18 0 10 Z" fill="#6FA845" />
      <path d="M2 10 C 14 8 26 7 38 6" stroke="#3F7F2A" strokeWidth="1" fill="none" />
    </svg>
  );
}

export default function FallingTreats() {
  return (
    <div className="treats" aria-hidden="true">
      {ITEMS.map((t, i) => (
        <span
          key={i}
          className={`treat treat--${t.kind}`}
          style={{
            left: t.left,
            animationDelay: t.delay,
            animationDuration: t.duration,
            '--rot': t.rot,
            '--scale': t.scale,
            '--c': t.color,
          }}
        >
          {t.kind === 'leaf' && <LeafIcon />}
        </span>
      ))}
    </div>
  );
}
