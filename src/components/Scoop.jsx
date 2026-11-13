import { useId } from 'react';

/**
 * Ice cream illustration rendered as SVG.
 *
 * props:
 *  scoops  – array of 1–3 colours, bottom → top
 *  vessel  – 'waffle' | 'sugar' | 'cup'   ('cone' is an alias of 'waffle')
 *  topping – 'mango' | 'cherry' | 'leaf' | 'pistachio' | 'none'
 *  size    – rendered width in px
 *  animate – drop each scoop in with a soft bounce (re-runs when a colour changes)
 */

const CONE_LAYOUT = { cy: [138, 92, 54], r: [48, 42, 36] };
const CUP_LAYOUT = { cy: [150, 106, 68], r: [52, 44, 37] };

export function scoopPath(cx, cy, r, dripIndex) {
  const n = 5;
  const w = (2 * r) / n;
  const base = cy + r * 0.22;
  let d = `M ${cx - r} ${cy + 2} A ${r} ${r} 0 0 1 ${cx + r} ${cy + 2} L ${cx + r} ${base}`;
  for (let i = 0; i < n; i++) {
    const x1 = cx + r - w * i;
    const x2 = x1 - w;
    const depth = i === dripIndex ? r * 0.7 : r * 0.2;
    d += ` C ${x1 - w * 0.05} ${base + depth} ${x2 + w * 0.05} ${base + depth} ${x2} ${base}`;
  }
  return `${d} Z`;
}

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amount);
  const g = clamp(((n >> 8) & 0xff) + amount);
  const b = clamp((n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function Topping({ type, x, y }) {
  switch (type) {
    case 'mango':
      return (
        <g transform={`translate(${x - 11} ${y - 16}) rotate(-12 11 11)`}>
          <rect width="22" height="20" rx="5" fill="#F29F05" />
          <rect x="3" y="3" width="8" height="6" rx="2" fill="#FFD27A" opacity="0.8" />
        </g>
      );
    case 'cherry':
      return (
        <g>
          <path d={`M ${x} ${y - 14} q 6 -16 16 -20`} stroke="#3E3E42" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y - 6} r="10" fill="#C8243B" />
          <circle cx={x - 3} cy={y - 9} r="3" fill="#fff" opacity="0.55" />
        </g>
      );
    case 'leaf':
      return (
        <g transform={`translate(${x} ${y - 4})`}>
          <path d="M0 0 C -4 -16 8 -24 20 -22 C 18 -10 10 -2 0 0 Z" fill="#7FA35B" />
          <path d="M0 0 C -2 -14 -14 -20 -22 -16 C -18 -6 -8 -1 0 0 Z" fill="#94B86E" />
        </g>
      );
    case 'pistachio':
      return (
        <g fill="#8DB255">
          <ellipse cx={x - 12} cy={y + 6} rx="5" ry="3" transform={`rotate(-30 ${x - 12} ${y + 6})`} />
          <ellipse cx={x + 6} cy={y + 2} rx="5" ry="3" transform={`rotate(20 ${x + 6} ${y + 2})`} />
          <ellipse cx={x + 16} cy={y + 14} rx="4" ry="2.5" />
          <ellipse cx={x - 2} cy={y + 16} rx="4" ry="2.5" transform={`rotate(50 ${x - 2} ${y + 16})`} />
        </g>
      );
    default:
      return null;
  }
}

function WaffleCone({ uid }) {
  return (
    <>
      <path d="M 56 150 L 144 150 L 100 250 Z" fill={`url(#waffle-${uid})`} />
      <path d="M 56 150 L 144 150 L 100 250 Z" fill="none" stroke="#C9A365" strokeWidth="2" strokeLinejoin="round" />
    </>
  );
}

function SugarCone({ uid }) {
  return (
    <>
      <path d="M 62 158 L 138 158 L 100 252 Z" fill={`url(#sugar-${uid})`} />
      <path d="M 62 158 L 138 158 L 100 252 Z" fill="none" stroke="#9A6430" strokeWidth="2" strokeLinejoin="round" />
      <rect x="54" y="142" width="92" height="20" rx="6" fill="#B97A3E" />
      <path d="M 60 152 H 140" stroke="#D69A5B" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Cup({ uid }) {
  return (
    <>
      <path d="M 50 172 L 150 172 L 136 248 L 64 248 Z" fill={`url(#cup-${uid})`} />
      <rect x="44" y="164" width="112" height="14" rx="7" fill="#2B2B2E" />
      <path d="M 70 196 H 130" stroke="#F6C945" strokeWidth="3" strokeLinecap="round" />
      <text x="100" y="220" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="15" fill="#FFF3C4">
        mm
      </text>
    </>
  );
}

export default function Scoop({ scoops = ['#F6C945'], vessel = 'waffle', topping = 'none', size = 200, title, animate = false }) {
  const uid = useId().replace(/:/g, '');
  const kind = vessel === 'cone' ? 'waffle' : vessel;
  const layout = kind === 'cup' ? CUP_LAYOUT : CONE_LAYOUT;
  const stack = scoops.slice(0, 3);
  const cx = 100;
  const topIndex = stack.length - 1;
  const topY = layout.cy[topIndex] - layout.r[topIndex];

  const scoopEls = stack.map((color, i) => {
    const cy = layout.cy[i];
    const r = layout.r[i];
    const d = scoopPath(cx, cy, r, (i + 2) % 5);
    return (
      <g
        key={animate ? `${i}-${color}` : i}
        className={animate ? 'scoop-drop' : undefined}
        style={animate ? { animationDelay: `${i * 90}ms` } : undefined}
      >
        <path d={d} fill="#000" opacity="0.07" transform="translate(0 5)" />
        <path d={d} fill={color} />
        <path d={`M ${cx - r * 0.75} ${cy - r * 0.05} A ${r * 0.8} ${r * 0.8} 0 0 1 ${cx + r * 0.2} ${cy - r * 0.78}`} stroke="#fff" strokeOpacity="0.45" strokeWidth={r * 0.12} strokeLinecap="round" fill="none" />
        <path d={`M ${cx + r * 0.2} ${cy + r * 0.05} A ${r} ${r} 0 0 0 ${cx + r * 0.9} ${cy - r * 0.25}`} stroke={shade(color, -28)} strokeOpacity="0.35" strokeWidth={r * 0.1} strokeLinecap="round" fill="none" />
      </g>
    );
  });

  const a11y = title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': true, role: 'presentation' };

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 200 260" {...a11y}>
      <defs>
        <pattern id={`waffle-${uid}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="#E3C58E" />
          <path d="M0 0 H14 M0 0 V14" stroke="#C9A365" strokeWidth="2.5" />
        </pattern>
        <pattern id={`sugar-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#C98B4E" />
          <path d="M0 0 H10 M0 0 V10" stroke="#A86E35" strokeWidth="1.6" />
        </pattern>
        <linearGradient id={`cup-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#3A3A3E" />
          <stop offset="1" stopColor="#55565C" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="252" rx="46" ry="6" fill="#000" opacity="0.08" />

      {kind === 'waffle' && <WaffleCone uid={uid} />}
      {kind === 'sugar' && <SugarCone uid={uid} />}
      {scoopEls}
      {kind === 'cup' && <Cup uid={uid} />}

      <Topping type={topping} x={cx + 4} y={topY + 4} />
    </svg>
  );
}
