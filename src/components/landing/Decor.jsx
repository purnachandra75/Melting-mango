/* Small decorative building blocks for the classic landing page. */

export function Ornament({ className = '', light = false, style }) {
  const c = light ? 'var(--mango)' : 'var(--mango-deep)';
  return (
    <svg className={`ornament ${className}`} style={style} viewBox="0 0 220 24" width="220" height="24" aria-hidden="true">
      <path d="M0 12 H78" stroke={c} strokeWidth="1" />
      <path d="M142 12 H220" stroke={c} strokeWidth="1" />
      <path d="M78 12 c8 0 10 -8 18 -8 c-6 2 -6 8 0 8" fill="none" stroke={c} strokeWidth="1.2" />
      <path d="M142 12 c-8 0 -10 -8 -18 -8 c6 2 6 8 0 8" fill="none" stroke={c} strokeWidth="1.2" />
      <path d="M78 12 c8 0 10 8 18 8 c-6 -2 -6 -8 0 -8" fill="none" stroke={c} strokeWidth="1.2" />
      <path d="M142 12 c-8 0 -10 8 -18 8 c6 -2 6 -8 0 -8" fill="none" stroke={c} strokeWidth="1.2" />
      <path d="M110 3 L118 12 L110 21 L102 12 Z" fill={c} />
    </svg>
  );
}

export function Seal({ className = '' }) {
  return (
    <div className={`seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="seal-path" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--ink)" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="var(--mango)" strokeWidth="1" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="var(--mango)" strokeWidth="1" />
        <g className="seal__spin">
          <text fill="var(--cream)" fontSize="13" fontFamily="Manrope, sans-serif" fontWeight="600" letterSpacing="3">
            <textPath href="#seal-path" textLength="460" lengthAdjust="spacing">
              HANDCRAFTED ✦ SMALL BATCH ✦ SINCE 2016 ✦
            </textPath>
          </text>
        </g>
        <text x="100" y="98" textAnchor="middle" fill="var(--mango)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="38" fontWeight="600">
          MM
        </text>
        <text x="100" y="122" textAnchor="middle" fill="var(--cream)" fontFamily="Manrope, sans-serif" fontSize="9" letterSpacing="3">
          CREAMERY
        </text>
      </svg>
    </div>
  );
}

/* A melting edge: a solid band with drips that slowly stretch and recover. */
const DRIPS = [
  { x: 60, w: 26, h: 46 }, { x: 170, w: 18, h: 70 }, { x: 260, w: 30, h: 38 }, { x: 390, w: 20, h: 84 },
  { x: 520, w: 34, h: 52 }, { x: 640, w: 18, h: 64 }, { x: 760, w: 28, h: 40 }, { x: 880, w: 22, h: 90 },
  { x: 1000, w: 30, h: 50 }, { x: 1120, w: 18, h: 72 }, { x: 1230, w: 26, h: 44 }, { x: 1350, w: 22, h: 66 },
];

export function DripEdge({ color = 'var(--ink)', className = '' }) {
  return (
    <div className={`drip-edge ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
        <path d="M0 0 H1440 V18 C1300 30 1200 10 1080 22 C960 34 860 12 720 24 C580 36 470 12 340 22 C220 32 100 14 0 24 Z" fill={color} />
        {DRIPS.map((d, i) => (
          <rect
            key={i}
            className="drip"
            x={d.x}
            y="8"
            width={d.w}
            height={d.h}
            rx={d.w / 2}
            fill={color}
            style={{ animationDelay: `${(i % 5) * 0.7}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
