import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { flavors } from '../../data/flavors';
import { LOCATIONS } from '../../data/locations';
import { Clip, ClipLayer } from '../ClipArt';

const FACTS = [
  { big: String(flavors.length), small: 'Signature flavours' },
  { big: 'Daily', small: 'Slow-churned fresh' },
  { big: String(LOCATIONS.length), small: 'Parlours in India' },
];

export default function Hero() {
  return (
    <section className="yl-hero" aria-label="Introduction">
      <ClipLayer className="yl-clips yl-clips--hero">
        <Clip kind="Mango" className="yc yc--h1" />
        <Clip kind="Cone" className="yc yc--h2" />
        <Clip kind="Sprinkles" className="yc yc--h3" />
        <Clip kind="Sparkle" className="yc yc--h4" />
        <Clip kind="Heart" className="yc yc--h5" />
      </ClipLayer>

      <div className="container yl-hero__grid">
        <div className="yl-hero__copy">
          <p className="yl-eyebrow">
            <span className="yl-eyebrow__dot" aria-hidden="true" />
            Artisan ice cream · Since day one
          </p>
          <h1 className="yl-hero__title">
            Pure <em>mango</em>
            <br />
            happiness, scooped fresh.
          </h1>
          <p className="yl-hero__lead">
            Small-batch, slow-churned ice cream made every morning with hand-pulped
            Alphonso mangoes, real cream and nothing artificial.
          </p>
          <div className="yl-hero__actions">
            <Link to="/menu" className="yl-btn yl-btn--solid">
              Explore the menu <span aria-hidden="true">{'\u2192'}</span>
            </Link>
            <Link to="/visit" className="yl-btn yl-btn--line">
              Find a parlour
            </Link>
          </div>
          <ul className="yl-facts">
            {FACTS.map((f) => (
              <li key={f.small}>
                <strong>{f.big}</strong>
                <span>{f.small}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="yl-hero__art">
          <span className="yl-hero__sun" aria-hidden="true" />
          <span className="yl-hero__ring" aria-hidden="true" />
          <img
            className="yl-hero__img"
            src={images.heroMango}
            alt="A cup of mango and vanilla ice cream with mango sauce, mango cubes, mint and a wafer roll, beside fresh cut mango"
            width="1006"
            height="882"
            decoding="async"
          />
          <figcaption className="yl-hero__tag">
            <span className="yl-hero__tag-k">House signature</span>
            <span className="yl-hero__tag-v">Alphonso Mango</span>
          </figcaption>
        </figure>
      </div>

      <svg className="yl-wave yl-wave--hero" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 64c160 40 320 46 480 22S800 18 960 30s320 60 480 40v40H0Z" fill="currentColor" />
      </svg>
    </section>
  );
}
