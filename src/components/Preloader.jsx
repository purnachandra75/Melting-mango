import { useEffect, useState } from 'react';

const SEEN_KEY = 'mm-preloader-seen';

export default function Preloader() {
  const [gone, setGone] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (gone) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showMs = reduce ? 350 : 1250;
    const hideMs = reduce ? 200 : 400;

    const t1 = window.setTimeout(() => setDone(true), showMs);
    const t2 = window.setTimeout(() => {
      setGone(true);
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* ignore */
      }
    }, showMs + hideMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [gone]);

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
      <div className="pl-mark">
        <svg className="pl-ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="pl-ring__track" cx="60" cy="60" r="56" fill="none" />
          <circle className="pl-ring__fill" cx="60" cy="60" r="56" fill="none" />
        </svg>
        <img
          className="pl-logo"
          src="/images/melting-logo.webp"
          alt=""
          width="168"
          height="168"
          decoding="async"
        />
      </div>
      <p className="pl-line">Slow-churned. Sun-ripened.</p>
      </div>
    </div>
  );
}
