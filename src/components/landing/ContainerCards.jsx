import Reveal from '../Reveal';
import Scoop from '../Scoop';
import { CONTAINERS } from '../../data/flavors';
import { images } from '../../data/images';

const PHOTOS = {
  waffle: { src: images.heroCone, alt: 'Ice cream in a crisp waffle cone' },
  cup: { src: images.mangoScoops, alt: 'Mango ice cream scoops served in a cup' },
  sugar: { src: images.chocolateCones, alt: 'Chocolate ice cream in cones' },
};

export default function ContainerCards() {
  return (
    <div className="cont-cards">
      {CONTAINERS.map((c, i) => (
        <Reveal key={c.id} delay={i * 120}>
          <a href="#builder" className="cont-card">
            <div className="cont-card__photo">
              <img src={PHOTOS[c.id].src} alt={PHOTOS[c.id].alt} width="800" height="600" loading="lazy" decoding="async" />
            </div>
            <div className="cont-card__badge" aria-hidden="true">
              <Scoop scoops={['#F6B93B']} vessel={c.id} size={46} title="" />
            </div>
            <div className="cont-card__body">
              <h3>{c.label}</h3>
              <p>{c.note}</p>
              <span className="cont-card__link">Build yours →</span>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
