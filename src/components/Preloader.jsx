import { useEffect, useState } from 'react';

/** Organic scoop silhouette at origin. */
function scoopOutline(r) {
  return [
    `M ${-r * 0.88} ${r * 0.04}`,
    `C ${-r * 1.02} ${-r * 0.22} ${-r * 0.82} ${-r * 0.68} ${-r * 0.52} ${-r * 0.76}`,
    `C ${-r * 0.4} ${-r * 1.0} ${-r * 0.16} ${-r * 0.96} ${-r * 0.06} ${-r * 0.8}`,
    `C ${r * 0.08} ${-r * 1.08} ${r * 0.3} ${-r * 0.92} ${r * 0.4} ${-r * 0.7}`,
    `C ${r * 0.6} ${-r * 0.86} ${r * 0.86} ${-r * 0.52} ${r * 0.9} ${-r * 0.16}`,
    `C ${r * 1.05} ${r * 0.08} ${r * 0.92} ${r * 0.26} ${r * 0.76} ${r * 0.2}`,
    `C ${r * 0.7} ${r * 0.52} ${r * 0.5} ${r * 0.72} ${r * 0.36} ${r * 0.38}`,
    `C ${r * 0.26} ${r * 0.68} ${r * 0.06} ${r * 0.86} ${-r * 0.02} ${r * 0.42}`,
    `C ${-r * 0.12} ${r * 0.72} ${-r * 0.3} ${r * 0.8} ${-r * 0.4} ${r * 0.4}`,
    `C ${-r * 0.52} ${r * 0.62} ${-r * 0.7} ${r * 0.56} ${-r * 0.76} ${r * 0.28}`,
    `C ${-r * 0.92} ${r * 0.36} ${-r * 0.98} ${r * 0.18} ${-r * 0.88} ${r * 0.04}`,
    'Z',
  ].join(' ');
}

function Scoop({ cx, cy, r, grad, shade, ridge }) {
  const d = scoopOutline(r);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx="0" cy={r * 0.45} rx={r * 0.72} ry={r * 0.18} fill="#5a3200" opacity="0.12" />
      <path d={d} fill={`url(#${grad})`} />
      <path d={d} fill={`url(#${shade})`} />
      <path
        d={`M ${-r * 0.48} ${-r * 0.18} C ${-r * 0.26} ${-r * 0.58} ${r * 0.02} ${-r * 0.64} ${r * 0.2} ${-r * 0.36}`}
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth={r * 0.08}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${-r * 0.4} ${-r * 0.08} Q ${r * 0.05} ${r * 0.12} ${r * 0.42} ${-r * 0.12}`}
        fill="none"
        stroke={ridge}
        strokeWidth={r * 0.035}
        strokeLinecap="round"
        opacity="0.28"
      />
    </g>
  );
}

/** Melting cream drip that stretches downward — the loader motion. */
function MeltDrip({ x, delay, duration, maxH, color }) {
  return (
    <g>
      <rect
        className="pl-melt__body"
        x={x - 6.5}
        y="248"
        width="13"
        height={maxH}
        rx="6.5"
        fill={color}
        style={{ animationDelay: delay, animationDuration: duration }}
      />
      <circle
        className="pl-melt__drop"
        cx={x}
        cy="256"
        r="7"
        fill={color}
        style={{
          animationDelay: delay,
          animationDuration: duration,
          '--fall': `${maxH - 8}px`,
        }}
      />
    </g>
  );
}

const DRIPS = [
  { x: 178, delay: '0.4s', duration: '2.4s', maxH: 72, color: '#F6C945' },
  { x: 210, delay: '0.55s', duration: '2.6s', maxH: 110, color: '#E8A812' },
  { x: 242, delay: '0.7s', duration: '2.5s', maxH: 88, color: '#F6C945' },
  { x: 195, delay: '0.9s', duration: '2.3s', maxH: 54, color: '#FFE08A' },
  { x: 228, delay: '1.05s', duration: '2.45s', maxH: 64, color: '#E09210' },
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showMs = reduce ? 500 : 3400;
    const hideMs = reduce ? 250 : 800;

    const t1 = window.setTimeout(() => setDone(true), showMs);
    const t2 = window.setTimeout(() => setGone(true), showMs + hideMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="preloader"
      className={done ? 'is-done' : ''}
      aria-hidden={done}
      role="status"
      aria-label="Loading Melting Mango"
    >
      <div className="pl-inner">
        <p className="pl-eyebrow">Artisan Creamery · Since 2016</p>

        <div className="pl-stage" aria-hidden="true">
          <svg className="pl-scene" viewBox="0 0 420 460" role="presentation">
            <defs>
              <pattern id="pl-waffle" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="18" height="18" fill="#E9B97A" />
                <path d="M0 0 H18 M0 0 V18" stroke="#C88942" strokeWidth="3.2" />
              </pattern>
              <linearGradient id="pl-cone-shade" x1="0" x2="1">
                <stop offset="0" stopColor="#5a3200" stopOpacity="0.22" />
                <stop offset="0.5" stopColor="#5a3200" stopOpacity="0" />
                <stop offset="1" stopColor="#5a3200" stopOpacity="0.26" />
              </linearGradient>
              <radialGradient id="pl-mango" cx="0.32" cy="0.28" r="0.78">
                <stop offset="0" stopColor="#FFE9A8" />
                <stop offset="0.5" stopColor="#F6C945" />
                <stop offset="1" stopColor="#E09210" />
              </radialGradient>
              <radialGradient id="pl-mango-s" cx="0.75" cy="0.7" r="0.7">
                <stop offset="0" stopColor="#C87800" stopOpacity="0" />
                <stop offset="1" stopColor="#8A4E00" stopOpacity="0.3" />
              </radialGradient>
              <radialGradient id="pl-choco" cx="0.32" cy="0.28" r="0.78">
                <stop offset="0" stopColor="#8B5E45" />
                <stop offset="0.5" stopColor="#5B3A2E" />
                <stop offset="1" stopColor="#3A2218" />
              </radialGradient>
              <radialGradient id="pl-choco-s" cx="0.75" cy="0.7" r="0.7">
                <stop offset="0" stopColor="#2A150E" stopOpacity="0" />
                <stop offset="1" stopColor="#1A0C08" stopOpacity="0.4" />
              </radialGradient>
              <radialGradient id="pl-pista" cx="0.32" cy="0.28" r="0.78">
                <stop offset="0" stopColor="#E4F0C8" />
                <stop offset="0.5" stopColor="#BFD39A" />
                <stop offset="1" stopColor="#7FA35B" />
              </radialGradient>
              <radialGradient id="pl-pista-s" cx="0.75" cy="0.7" r="0.7">
                <stop offset="0" stopColor="#5A7A38" stopOpacity="0" />
                <stop offset="1" stopColor="#3F5A28" stopOpacity="0.3" />
              </radialGradient>
              <filter id="pl-soft" x="-25%" y="-15%" width="150%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#2b2b2e" floodOpacity="0.1" />
              </filter>
              <clipPath id="pl-cone-clip">
                <path d="M 152 248 L 268 248 L 210 412 Z" />
              </clipPath>
            </defs>

            {/* Cone */}
            <g className="pl-cone" filter="url(#pl-soft)">
              <path d="M 152 248 L 268 248 L 210 412 Z" fill="url(#pl-waffle)" />
              <path d="M 152 248 L 268 248 L 210 412 Z" fill="url(#pl-cone-shade)" />
              <path d="M 152 248 L 268 248 L 210 412 Z" fill="none" stroke="#B9783A" strokeWidth="2" strokeLinejoin="round" />
              <ellipse cx="210" cy="248" rx="59" ry="8" fill="#C88942" opacity="0.35" />
            </g>

            {/* Cream melting down the cone — loader */}
            <g clipPath="url(#pl-cone-clip)">
              {DRIPS.map((d) => (
                <MeltDrip key={d.x + d.delay} {...d} />
              ))}
            </g>

            {/* Scoops stacked on rim (width matched to cone) */}
            <g className="pl-scoops">
              <Scoop cx={210} cy={228} r={62} grad="pl-mango" shade="pl-mango-s" ridge="#C87800" />
              <Scoop cx={210} cy={178} r={54} grad="pl-choco" shade="pl-choco-s" ridge="#2A150E" />
              <Scoop cx={210} cy={136} r={44} grad="pl-pista" shade="pl-pista-s" ridge="#5A7A38" />
            </g>

            {/* Extra melt from bottom of first scoop over the rim */}
            <g className="pl-rim-melt">
              <ellipse className="pl-rim-melt__pool" cx="210" cy="250" rx="52" ry="7" fill="#F6C945" opacity="0.85" />
            </g>
          </svg>
        </div>

        <div className="pl-brand">
          <h1>
            Melting <em>Mango</em>
          </h1>
          <div className="pl-rule" aria-hidden="true" />
          <p>Slow-churned. Sun-ripened.</p>
        </div>

        <p className="pl-status">Preparing your scoop…</p>
      </div>
    </div>
  );
}
