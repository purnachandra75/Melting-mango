import { formatPrice } from '../data/flavors';
import { useMenuConfig } from '../context/MenuConfigContext';
import { pointsForPrice } from '../lib/loyalty';

function TagIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

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
  const menuConfig = useMenuConfig();
  const pts = pointsForPrice(flavor.price, menuConfig);
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
        {pts != null ? (
          <span className="earn-tag">
            <TagIcon />
            {`Earn ${pts} Points`}
          </span>
        ) : null}
        <div className="flavor-card__foot">
          <span>{flavor.tags[0]}</span>
          <span className="flavor-card__plus" aria-hidden="true">+</span>
        </div>
      </div>
    </button>
  );
}
