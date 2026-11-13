import Scoop from './Scoop';
import { formatPrice } from '../data/flavors';

export default function FlavorCard({ flavor, onSelect }) {
  const seasonal = flavor.availability === 'Seasonal';
  return (
    <button type="button" className="flavor-card" onClick={() => onSelect(flavor)} aria-label={`View ${flavor.name}`}>
      <div className="flavor-card__art" style={{ background: flavor.tint }}>
        <span className={`flavor-card__tag ${seasonal ? 'flavor-card__tag--seasonal' : ''}`}>{flavor.availability}</span>
        <Scoop scoops={[flavor.color]} vessel={flavor.vessel} topping={flavor.topping} size={150} title={flavor.name} />
      </div>
      <div className="flavor-card__body">
        <div className="flavor-card__top">
          <h3 className="flavor-card__name">{flavor.name}</h3>
          <span className="flavor-card__price">
            {formatPrice(flavor.price)}
            <small> / scoop</small>
          </span>
        </div>
        <p className="flavor-card__notes">{flavor.notes}</p>
        <div className="flavor-card__foot">
          <span>{flavor.tags[0]}</span>
          <span className="flavor-card__plus" aria-hidden="true">+</span>
        </div>
      </div>
    </button>
  );
}
