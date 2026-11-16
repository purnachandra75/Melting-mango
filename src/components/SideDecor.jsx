import { images } from '../data/images';
import { ScrollCone, MeltingScoop, TopScoop, DropCone } from './SideDecorCore';

/* Same placement tables as the reference build: [side, top %, flavour/kind, delay] (right side only). */
/* Home: big melting mango scoops removed from the right edge (user request) */
const SCOOPS = [];
const CONES = [['r', 20, 'pista', 1.2], ['r', 46, 'mango', 0.6], ['r', 72, 'strawberry', 3]];
const TOPPINGS = [['r', 10, 'sprinkles', 0], ['r', 36, 'chocolate', 2.5], ['r', 62, 'sprinkles', 3], ['r', 88, 'chocolate', 2]];

/* Shorter pages (Menu, Visit) get one of each so the right edge isn't crowded. */
const COMPACT = {
  scoops: [['r', 6, 'mango']],
  toppings: [['r', 36, 'sprinkles', 0]],
  cones: [['r', 70, 'pista', 1.2]],
};

/** Wraps page content below the hero and draws the decorative scoops/cones down the right edge. */
export function SpaBody({ children, compact = false }) {
  const scoops = compact ? COMPACT.scoops : SCOOPS;
  const toppings = compact ? COMPACT.toppings : TOPPINGS;
  const cones = compact ? COMPACT.cones : CONES;
  return (
    <div className="spa-body">
      <div className="bg-scoops" aria-hidden="true">
        {scoops.map(([side, top], i) => (
          <span key={`s${i}`} className={`bg-scoop bg-scoop--${side}`} style={{ top: `${top}%`, '--melt-delay': `${(i % 4) * 0.9}s` }}>
            <MeltingScoop src={images.mangoScoopsStack} delay={(i % 4) * 1.7} />
          </span>
        ))}
        {toppings.map(([side, top, kind, delay], i) => (
          <span key={`t${i}`} className={`bg-topping bg-topping--${side}`} style={{ top: `${top}%` }}>
            <TopScoop kind={kind} delay={delay} />
          </span>
        ))}
        {cones.map(([side, top, flavour, delay], i) => (
          <span key={`c${i}`} className={`bg-cone bg-cone--${side}`} style={{ top: `${top}%` }}>
            <DropCone flavour={flavour} delay={delay} />
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

export { ScrollCone };
