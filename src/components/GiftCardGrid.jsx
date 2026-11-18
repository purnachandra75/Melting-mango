import { Link } from 'react-router-dom';
import GiftCardArt from './GiftCardArt';

function money(n) {
  const x = Number(n) || 0;
  return `$${Number.isInteger(x) ? x : x.toFixed(2)}`;
}

function priceRange(card) {
  const prices = card.values.map((v) => Number(v.payAmount)).filter((n) => Number.isFinite(n));
  if (!prices.length) return '';
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return low === high ? money(low) : `${money(low)} \u2013 ${money(high)}`;
}

/** The gift cards the owner set up in Restaurant Admin, one tile each. "Buy" opens the card's page. */
export default function GiftCardGrid({ cards }) {
  return (
    <div className="gtiles">
      {cards.map((card) => (
        <article key={card.id} className="gtile">
          <Link to={`/gift-cards/${card.id}`} className="gtile__art" aria-label={`${card.name} gift card`}>
            <GiftCardArt card={card} />
          </Link>
          <h3 className="gtile__name">{card.name}</h3>
          {card.description ? <p className="gtile__desc">{card.description}</p> : null}
          <div className="gtile__foot">
            <span className="gtile__price">{priceRange(card)}</span>
            <Link to={`/gift-cards/${card.id}`} className="gtile__buy">
              Buy Gift Card
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
