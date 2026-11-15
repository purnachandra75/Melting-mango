import { useState } from 'react';
import Scoop from '../Scoop';
import { CONTAINERS, SCOOP_SIZES, flavorById, formatPrice } from '../../data/flavors';
import { useLiveFlavors } from '../../hooks/useLiveFlavors';
import { useCart } from '../../context/CartContext';

const NUMERALS = ['I', 'II', 'III'];

export default function ScoopBuilder() {
  const { addItem } = useCart();
  const flavors = useLiveFlavors();
  const [count, setCount] = useState(2);
  const [slots, setSlots] = useState(['mango', 'pista', 'chocolate']);
  const [containerId, setContainerId] = useState('waffle');

  const chosen = slots.slice(0, count).map(flavorById);
  const price = chosen.reduce((sum, f) => sum + f.price, 0);
  const top = chosen[chosen.length - 1];

  const setSlot = (index, id) => setSlots((s) => s.map((v, i) => (i === index ? id : v)));

  return (
    <div className="builder">
      <div className="builder__stage">
        <div className="builder__halo" />
        <div className="builder__frame">
          <Scoop scoops={chosen.map((f) => f.color)} vessel={containerId} topping={top.topping} size={250} title="Your custom ice cream" animate />
        </div>
        <div className="builder__plinth" />
        <p className="builder__caption">
          {chosen.map((f) => f.name).join(' · ')}
          <span>in a {CONTAINERS.find((c) => c.id === containerId).label}</span>
        </p>
      </div>

      <div className="builder__panel">
        <fieldset className="builder__step">
          <legend><span className="builder__num">I</span> Scoop size</legend>
          <div className="pill-row">
            {SCOOP_SIZES.map((s) => (
              <button key={s.id} type="button" className={`pill ${s.count === count ? 'active' : ''}`} aria-pressed={s.count === count} onClick={() => setCount(s.count)}>
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="builder__step">
          <legend><span className="builder__num">II</span> Flavours</legend>
          {Array.from({ length: count }, (_, i) => (
            <div className="slot" key={i}>
              <span className="slot__label">Scoop {NUMERALS[i]}</span>
              <div
                className="swatches"
                role="radiogroup"
                aria-label={`Flavour for scoop ${i + 1}`}
                onKeyDown={(e) => {
                  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
                  e.preventDefault();
                  const ids = flavors.map((f) => f.id);
                  const cur = ids.indexOf(slots[i]);
                  const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
                  setSlot(i, ids[(cur + dir + ids.length) % ids.length]);
                }}
              >
                {flavors.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={slots[i] === f.id}
                    tabIndex={slots[i] === f.id ? 0 : -1}
                    className={`swatch ${slots[i] === f.id ? 'active' : ''}`}
                    onClick={() => setSlot(i, f.id)}
                    title={`${f.name} · ${formatPrice(f.price)}`}
                  >
                    <span className="swatch__dot" style={{ background: f.color }} />
                    <span className="swatch__name">{f.name}</span>
                    {f.availability === 'Seasonal' && <span className="swatch__badge">Seasonal</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="builder__step">
          <legend><span className="builder__num">III</span> Container</legend>
          <div className="pill-row">
            {CONTAINERS.map((c) => (
              <button key={c.id} type="button" className={`pill ${c.id === containerId ? 'active' : ''}`} aria-pressed={c.id === containerId} onClick={() => setContainerId(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="builder__total">
          <div>
            <span className="label">Your creation</span>
            <strong>{formatPrice(price)}</strong>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => addItem({ flavorIds: chosen.map((f) => f.id), containerId })}>
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
