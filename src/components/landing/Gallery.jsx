import { useCallback, useEffect, useState } from 'react';
import Reveal from '../Reveal';

const SHOTS = [
  { src: '/images/sprinkle-bowl.jpg', tag: 'Party favourite', title: 'Sprinkle Celebration', alt: 'Vanilla scoops in a sprinkle-covered bowl' },
  { src: '/images/mango-scoops.jpg', tag: 'House signature', title: 'Fresh Mango Scoops', alt: 'Scoops of mango ice cream' },
  { src: '/images/sundae.jpg', tag: 'Sundaes', title: 'Chocolate Drizzle', alt: 'A sundae with chocolate drizzle' },
  { src: '/images/cones-flatlay.jpg', tag: 'Made to order', title: 'Cones for Everyone', alt: 'Ice cream cones with berries and flowers' },
  { src: '/images/waffle-bowl.jpg', tag: 'Waffle cones', title: 'Rolled In-house', alt: 'Ice cream in a waffle bowl' },
  { src: '/images/parfait.jpg', tag: 'Parlour classic', title: 'Fudge Parfait', alt: 'A chocolate parfait in a glass' },
  { src: '/images/popsicles.jpg', tag: 'Summer', title: 'Berry Pops', alt: 'Strawberry popsicles with raspberries' },
];

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir) => setOpen((i) => (i + dir + SHOTS.length) % SHOTS.length), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <>
      <div className="gallery">
        {SHOTS.map((s, i) => (
          <Reveal key={s.src} className={`gallery__item gallery__item--${i}`} delay={(i % 4) * 90}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${s.title}`}>
              <img src={s.src} alt={s.alt} loading="lazy" />
              <span className="gallery__cap">
                <small>{s.tag}</small>
                {s.title}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={SHOTS[open].title} onClick={close}>
          <button className="lightbox__btn lightbox__btn--close" onClick={close} aria-label="Close" autoFocus>×</button>
          <button className="lightbox__btn lightbox__btn--prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">‹</button>
          <figure onClick={(e) => e.stopPropagation()} key={open}>
            <img src={SHOTS[open].src} alt={SHOTS[open].alt} />
            <figcaption>{SHOTS[open].title}</figcaption>
          </figure>
          <button className="lightbox__btn lightbox__btn--next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">›</button>
        </div>
      )}
    </>
  );
}
