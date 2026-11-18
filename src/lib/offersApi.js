/**
 * Offers, coupon codes and gift cards the restaurant owner set up in Restaurant Admin.
 * Each call returns only live items (the server filters expired / disabled ones).
 */
import { RESTAURANT_API_URL, SITE_SLUG } from '../config';

const siteBase = () =>
  `${RESTAURANT_API_URL.replace(/\/$/, '')}/api/public/website/${encodeURIComponent(SITE_SLUG)}`;

async function getList(path, key, signal) {
  const res = await fetch(`${siteBase()}/${path}`, { signal });
  if (!res.ok) throw new Error(`${path} request failed (${res.status})`);
  const data = await res.json();
  return Array.isArray(data[key]) ? data[key] : [];
}

export const fetchOffers = (signal) => getList('offers', 'offers', signal);
export const fetchCoupons = (signal) => getList('coupons', 'coupons', signal);
export const fetchGiftCards = (signal) => getList('gift-cards', 'giftCards', signal);
export const fetchRewards = (signal) => getList('rewards', 'rewards', signal);

async function readJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `Request failed (${res.status})`);
  return data;
}

/** Start a Stripe Checkout for a gift card. Resolves with { orderId, url } — send the browser to `url`. */
export async function startGiftCardCheckout(payload) {
  const res = await fetch(`${siteBase()}/gift-card-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, returnBase: window.location.origin }),
  });
  return readJson(res);
}

/** After Stripe redirects back: confirms payment with the server and returns the issued cards. */
export async function fetchGiftCardOrder(orderId, sessionId) {
  const res = await fetch(
    `${siteBase()}/gift-card-orders/${encodeURIComponent(orderId)}?session_id=${encodeURIComponent(sessionId)}`,
    { cache: 'no-store' }
  );
  const data = await readJson(res);
  return data.order;
}
