import { useEffect, useState } from 'react';

const CORNERS = [
  { src: '/images/hero-cone.jpg', alt: '', className: 'pl-c1' },
  { src: '/images/mango-scoops.jpg', alt: '', className: 'pl-c2' },
  { src: '/images/sprinkle-bowl.jpg', alt: '', className: 'pl-c3' },
  { src: '/images/popsicles.jpg', alt: '', className: 'pl-c4' },
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showMs = reduce ? 400 : 2200;
    const hideMs = reduce ? 200 : 700;

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
      {CORNERS.map((c) => (
        <img key={c.className} className={`pl-clip ${c.className}`} src={c.src} alt={c.alt} />
      ))}

      <div className="pl-inner">
        <div className="pl-card">
          <svg className="pl-logo" viewBox="0 0 360 200" role="img" aria-label="Melting Mango">
            <defs>
              <linearGradient id="pl-scoop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE39A" />
                <stop offset="55%" stopColor="#F6C945" />
                <stop offset="100%" stopColor="#E8971A" />
              </linearGradient>
              <linearGradient id="pl-cone" x1="0" x2="1">
                <stop offset="0%" stopColor="#E9B97A" />
                <stop offset="100%" stopColor="#C88942" />
              </linearGradient>
            </defs>
            <g transform="translate(148 8)">
              <path d="M22 78 L50 78 L36 132 Z" fill="url(#pl-cone)" />
              <path d="M22 78 L50 78 L36 132 Z" fill="none" stroke="#B9783A" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="36" cy="58" r="28" fill="url(#pl-scoop)" />
              <circle cx="36" cy="34" r="22" fill="url(#pl-scoop)" />
              <path d="M42 12c5-5 12-4 14 0-5 4-10 4-14 0Z" fill="#7FA35B" />
              <path
                d="M18 52c2 4 5 3 7 5 1 4 4 5 5 1 2 2 6 2 7-1 3 1 5-1 9-4"
                fill="#F6C945"
              />
            </g>
            <text
              x="180"
              y="168"
              textAnchor="middle"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="42"
              fontWeight="700"
              fill="#2b2b2e"
            >
              Melting Mango
            </text>
            <text
              x="180"
              y="192"
              textAnchor="middle"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="16"
              fontStyle="italic"
              fill="#8a5a00"
            >
              Slow-churned. Sun-ripened.
            </text>
          </svg>
        </div>
        <div className="pl-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
