import { formatPrice } from '../data/flavors';

function Stars({ rating }) {
  return (
    <span className="flavor-card__stars" aria-label={`${rating} out of 5 stars`}>
      <span className="flavor-card__stars-icons" aria-hidden="true">
        ★★★★★
      </span>
      <span className="flavor-card__rating">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function FlavorCard({ flavor, onSelect }) {
  const seasonal = flavor.availability === 'Seasonal';
  return (
    <button
      type="button"
      className="flavor-card"
      onClick={() => onSelect(flavor)}
      aria-label={`View ${flavor.name}, ${formatPrice(flavor.price)} per scoop, rated ${flavor.rating} out of 5`}
    >
      <div className="flavor-card__art">
        <img
          src={flavor.photo}
          alt=""
          width="640"
          height="480"
          loading="lazy"
          decoding="async"
        />
        {seasonal && <span className="flavor-card__tag flavor-card__tag--seasonal">Seasonal</span>}
      </div>
      <div className="flavor-card__body">
        <Stars rating={flavor.rating} />
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
