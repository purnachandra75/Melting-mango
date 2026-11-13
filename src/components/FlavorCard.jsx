import Scoop from './Scoop';
import { formatPrice } from '../data/flavors';

export default function FlavorCard({ flavor, onSelect }) {
  const seasonal = flavor.availability === 'Seasonal';
  return (
    <button type="button" className="flavor-card" onClick={() => onSelect(flavor)} aria-label={`View ${flavor.name}, ${formatPrice(flavor.price)} per scoop`}>
      <div className="flavor-card__art" style={{ background: flavor.tint }}>
        {seasonal && <span className="flavor-card__tag flavor-card__tag--seasonal">Seasonal</span>}
        <Scoop scoops={[flavor.color]} vessel={flavor.vessel} topping={flavor.topping} size={150} title="" />
      </div>
      <div className="flavor-card__body">
        <div className="flavor-card__top">
          <h2 className="flavor-card__name">{flavor.name}</h2>
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
