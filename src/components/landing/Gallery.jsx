import { useCallback, useState } from 'react';
import Reveal from '../Reveal';
import { images } from '../../data/images';
import { useDialog } from '../../hooks/useDialog';

const SHOTS = [
  { src: images.sprinkleBowl, tag: 'Party favourite', title: 'Sprinkle Celebration', alt: 'Vanilla scoops in a sprinkle-covered bowl' },
  { src: images.mangoScoops, tag: 'House signature', title: 'Fresh Mango Scoops', alt: 'Scoops of mango ice cream' },
  { src: images.sundae, tag: 'Sundaes', title: 'Chocolate Drizzle', alt: 'A sundae with chocolate drizzle' },
  { src: images.conesFlatlay, tag: 'Made to order', title: 'Cones for Everyone', alt: 'Ice cream cones with berries and flowers' },
  { src: images.waffleBowl, tag: 'Waffle cones', title: 'Rolled In-house', alt: 'Ice cream in a waffle bowl' },
  { src: images.parfait, tag: 'Parlour classic', title: 'Fudge Parfait', alt: 'A chocolate parfait in a glass' },
  { src: images.popsicles, tag: 'Summer', title: 'Berry Pops', alt: 'Strawberry popsicles with raspberries' },
];

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir) => setOpen((i) => (i + dir + SHOTS.length) % SHOTS.length), []);
  const dialogRef = useDialog(open !== null, close);

  const onLightboxKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <>
      <div className="gallery">
        {SHOTS.map((s, i) => (
          <Reveal key={s.src} className={`gallery__item gallery__item--${i}`} delay={(i % 4) * 90}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${s.title}`}>
              <img src={s.src} alt={s.alt} width="1200" height="900" loading="lazy" decoding="async" />
              <span className="gallery__cap">
                <small>{s.tag}</small>
                {s.title}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open !== null && (
        <div
          className="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={SHOTS[open].title}
          tabIndex={-1}
          onClick={close}
          onKeyDown={onLightboxKey}
        >
          <button type="button" className="lightbox__btn lightbox__btn--close" onClick={close} aria-label="Close">×</button>
          <button type="button" className="lightbox__btn lightbox__btn--prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">‹</button>
          <figure onClick={(e) => e.stopPropagation()} key={open}>
            <img src={SHOTS[open].src} alt={SHOTS[open].alt} />
            <figcaption>{SHOTS[open].title}</figcaption>
          </figure>
          <button type="button" className="lightbox__btn lightbox__btn--next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">›</button>
        </div>
      )}
    </>
  );
}
