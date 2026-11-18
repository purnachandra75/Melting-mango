import QrCode from './QrCode';
import { giftCardBalanceUrl } from '../lib/giftCardUrl';

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
    ? d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : '';
}

/**
 * Back of a gift card: the number the customer shows at the counter, plus a QR code that opens the
 * balance page. The PIN is never printed on the card; it is sent separately (email attachment).
 * Same size as GiftCardArt.
 */
export default function GiftCardBack({ code, value, currency, expiresAt, restaurantName = 'Melting Mango' }) {
  const until = dateLabel(expiresAt);
  return (
    <div className="gcard gcard--back">
      <span className="gcard__stripe" aria-hidden="true" />
      <div className="gcard__back">
        <div className="gcard__main">
          <div className="gcard__field">
            <span className="gcard__label">Card number</span>
            <span className="gcard__number">{code}</span>
          </div>
          <div className="gcard__row">
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
            Show this number and your PIN at {restaurantName} to use your balance.
          </p>
        </div>
        <div className="gcard__qr">
          <QrCode value={giftCardBalanceUrl(code)} label="Scan to see this card's balance and expiry date" />
          <span className="gcard__qrtext">Scan for balance</span>
        </div>
      </div>
    </div>
  );
}
