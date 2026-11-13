import { scoopPath } from '../Scoop';

/**
 * Large animated mango cone for the hero:
 * glossy scoops, mango sauce drips, floating mango cubes, swaying leaves
 * and a mango splash that draws itself around the cone.
 */

function Cube({ x, y, s, r = 0, className = '', delay = 0 }) {
  const d = s * 0.32;
  return (
    <g className={className} style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) rotate(${r})`}>
        <polygon points={`0,${d} ${s},${d} ${s},${s + d} 0,${s + d}`} fill="url(#hx-cube-front)" />
        <polygon points={`0,${d} ${d},0 ${s + d},0 ${s},${d}`} fill="#FFE08A" />
        <polygon points={`${s},${d} ${s + d},0 ${s + d},${s} ${s},${s + d}`} fill="#E58E00" />
        <rect x={s * 0.12} y={d + s * 0.12} width={s * 0.28} height={s * 0.16} rx={s * 0.08} fill="#fff" opacity="0.35" />
      </g>
    </g>
  );
}

function Leaf({ x, y, scale = 1, r = 0, className = '' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${scale})`}>
      <g className={className}>
        <path d="M0 0 C 26 -40 92 -52 140 -26 C 96 4 40 16 0 0 Z" fill="url(#hx-leaf)" />
        <path d="M4 -1 C 50 -14 96 -22 136 -25" stroke="#2F6A1F" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
    </g>
  );
}

const SCOOPS = [
  { cy: 352, r: 120, fill: 'url(#hx-scoop-pale)', drip: 1 },
  { cy: 252, r: 106, fill: 'url(#hx-scoop)', drip: 3 },
  { cy: 166, r: 92, fill: 'url(#hx-scoop)', drip: 2 },
];

const SAUCE_DRIPS = [
  { x: 226, h: 34, w: 16 },
  { x: 264, h: 62, w: 18 },
  { x: 322, h: 44, w: 16 },
  { x: 358, h: 76, w: 18 },
];

const DROPLETS = [
  { cx: 96, cy: 520, r: 7 }, { cx: 70, cy: 470, r: 4 }, { cx: 556, cy: 430, r: 8 },
  { cx: 584, cy: 384, r: 4 }, { cx: 540, cy: 300, r: 5 }, { cx: 120, cy: 600, r: 5 },
];

export default function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 640 680" role="img" aria-label="A three-scoop mango ice cream cone with mango cubes and a mango splash">
      <defs>
        <radialGradient id="hx-glow" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hx-scoop" cx="0.35" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFE39A" />
          <stop offset="0.45" stopColor="#F8BE45" />
          <stop offset="1" stopColor="#E8971A" />
        </radialGradient>
        <radialGradient id="hx-scoop-pale" cx="0.35" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFF3C8" />
          <stop offset="0.5" stopColor="#FAD785" />
          <stop offset="1" stopColor="#EDB24A" />
        </radialGradient>
        <linearGradient id="hx-sauce" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC02E" />
          <stop offset="1" stopColor="#F59000" />
        </linearGradient>
        <pattern id="hx-waffle" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="30" height="30" fill="#E9B97A" />
          <path d="M0 0 H30 M0 0 V30" stroke="#C88942" strokeWidth="5" />
        </pattern>
        <linearGradient id="hx-cone-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#5a3200" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#5a3200" stopOpacity="0" />
          <stop offset="1" stopColor="#5a3200" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="hx-cube-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC437" />
          <stop offset="1" stopColor="#F59A00" />
        </linearGradient>
        <linearGradient id="hx-leaf" x1="0" x2="1">
          <stop offset="0" stopColor="#3F7F2A" />
          <stop offset="1" stopColor="#86BC4E" />
        </linearGradient>
        <linearGradient id="hx-splash" x1="0" x2="1">
          <stop offset="0" stopColor="#FFB000" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#F59000" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <circle className="hx-glow" cx="330" cy="300" r="262" fill="url(#hx-glow)" />

      <Leaf x={470} y={110} scale={1.05} r={-28} className="hx-sway" />
      <Leaf x={40} y={640} scale={0.9} r={-40} className="hx-sway hx-sway--slow" />

      <path className="hx-splash hx-splash--back" d="M 548 470 C 600 380 560 300 500 290" stroke="url(#hx-splash)" strokeWidth="16" fill="none" strokeLinecap="round" />

      <path d="M 196 378 L 404 378 L 300 664 Z" fill="url(#hx-waffle)" />
      <path d="M 196 378 L 404 378 L 300 664 Z" fill="url(#hx-cone-shade)" />
      <path d="M 196 378 L 404 378 L 300 664 Z" fill="none" stroke="#B9783A" strokeWidth="3" strokeLinejoin="round" />

      {SCOOPS.map((s, i) => {
        const d = scoopPath(300, s.cy, s.r, s.drip);
        return (
          <g key={i}>
            <path d={d} fill="#7a4300" opacity="0.12" transform="translate(0 8)" />
            <path d={d} fill={s.fill} />
            <path d={`M ${300 - s.r * 0.72} ${s.cy - s.r * 0.1} A ${s.r * 0.8} ${s.r * 0.8} 0 0 1 ${300 + s.r * 0.1} ${s.cy - s.r * 0.8}`} stroke="#fff" strokeOpacity="0.55" strokeWidth={s.r * 0.09} strokeLinecap="round" fill="none" />
          </g>
        );
      })}

      <path d="M 210 166 A 92 92 0 0 1 390 166 C 384 196 360 186 344 204 C 330 220 306 196 290 210 C 272 226 252 198 236 206 C 222 212 212 196 210 166 Z" fill="url(#hx-sauce)" />
      {SAUCE_DRIPS.map((d, i) => (
        <rect key={i} className="hx-drip" x={d.x} y="186" width={d.w} height={d.h} rx={d.w / 2} fill="#F7A100" style={{ animationDelay: `${i * 0.8}s` }} />
      ))}
      <path d="M 232 130 A 72 72 0 0 1 300 92" stroke="#fff" strokeOpacity="0.6" strokeWidth="7" strokeLinecap="round" fill="none" />

      <Cube x={262} y={44} s={58} r={-12} className="hx-bob" />
      <Cube x={334} y={92} s={38} r={18} className="hx-bob" delay={0.6} />

      <path className="hx-splash" d="M 110 500 C 150 610 290 650 420 610 C 500 586 548 532 552 470" stroke="url(#hx-splash)" strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.92" />
      <path className="hx-splash hx-splash--thin" d="M 150 560 C 240 640 380 650 470 600" stroke="#FFD25E" strokeWidth="8" fill="none" strokeLinecap="round" />

      {DROPLETS.map((p, i) => (
        <circle key={i} className="hx-drop" cx={p.cx} cy={p.cy} r={p.r} fill="#FFB31A" style={{ animationDelay: `${i * 0.45}s` }} />
      ))}

      <Cube x={70} y={300} s={60} r={-14} className="hx-float" />
      <Cube x={150} y={440} s={30} r={22} className="hx-float hx-float--b" delay={1.1} />
      <Cube x={520} y={180} s={50} r={10} className="hx-float hx-float--b" delay={0.4} />
      <Cube x={540} y={560} s={26} r={-20} className="hx-float" delay={1.6} />

      <Leaf x={500} y={640} scale={0.8} r={-30} className="hx-sway" />
    </svg>
  );
}
