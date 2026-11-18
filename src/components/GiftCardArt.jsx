import { backgroundFor } from '../data/giftCardDesigns';

function money(n) {
  const x = Number(n) || 0;
  return `$${Number.isInteger(x) ? x : x.toFixed(2)}`;
}

/**
 * One gift card face: logo in the corner, the occasion in the middle with "Gift Card" under it,
 * over the owner's uploaded background (or a colour). Set up by the owner in Restaurant Admin.
 */
export default function GiftCardArt({ card, value, mini = false }) {
  const image = String(card.designImage || '').trim();
  const occasion = String(card.occasion || '').trim();
  const bonus = value && value.bonusAmount > 0 ? value.bonusAmount : 0;

  return (
    <div className={`gcard ${mini ? 'gcard--mini' : ''} ${card.designTextTone === 'dark' ? 'gcard--dark' : ''}`}>
      {image ? (
        <img className="gcard__art" src={image} alt="" loading="lazy" decoding="async" draggable={false} />
      ) : (
        <div className="gcard__art" style={{ background: backgroundFor(card) }} />
      )}
      <span className="gcard__logo">
        <img src="/images/melting-logo.png" alt="Melting Mango" width="64" height="64" decoding="async" />
      </span>
      <div className="gcard__mid">
        {occasion ? <span className="gcard__occ">{occasion}</span> : null}
        <span className={occasion ? 'gcard__word' : 'gcard__occ'}>Gift Card</span>
      </div>
      {value && !mini ? (
        <div className="gcard__foot">
          <span className="gcard__amount">{money(value.amount)}</span>
          {bonus ? <span className="gcard__bonus">+{money(bonus)} bonus</span> : null}
        </div>
      ) : null}
    </div>
  );
}
