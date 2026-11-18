/** Page the card's QR code opens (front and back): shows the card number, expiry date and balance left. */
export function giftCardBalanceUrl(code) {
  const compact = String(code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return `${window.location.origin}/gift-card-balance?c=${compact}`;
}
