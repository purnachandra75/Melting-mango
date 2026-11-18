function money(n, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(n) || 0);
  } catch {
    return `$${(Number(n) || 0).toFixed(2)}`;
  }
}

function dateLabel(iso) {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';
}

/** Back of a gift card: the number and PIN the customer shows at the counter. Same size as GiftCardArt. */
export default function GiftCardBack({ code, pin, value, currency, expiresAt, restaurantName = 'Melting Mango' }) {
  const until = dateLabel(expiresAt);
  return (
    <div className="gcard gcard--back">
      <span className="gcard__stripe" aria-hidden="true" />
      <div className="gcard__back">
        <div className="gcard__field">
          <span className="gcard__label">Card number</span>
          <span className="gcard__number">{code}</span>
        </div>
        <div className="gcard__row">
          {pin ? (
            <div className="gcard__field">
              <span className="gcard__label">PIN</span>
              <span className="gcard__pin">{pin}</span>
            </div>
          ) : null}
          <div className="gcard__field">
            <span className="gcard__label">Value</span>
            <span className="gcard__pin">{money(value, currency)}</span>
          </div>
          <div className="gcard__field">
            <span className="gcard__label">{until ? 'Valid until' : 'Validity'}</span>
            <span className="gcard__pin gcard__pin--small">{until || 'No expiry'}</span>
          </div>
        </div>
        <p className="gcard__fine">
          Show this number{pin ? ' and PIN' : ''} at {restaurantName} to use your balance.
        </p>
      </div>
    </div>
  );
}
