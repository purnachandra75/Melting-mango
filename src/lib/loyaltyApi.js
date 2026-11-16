/**
 * Website loyalty points: phone OTP → short-lived token → balance / redeem.
 * The balance is never shown without a verified code.
 */
import { RESTAURANT_API_URL, SITE_SLUG } from '../config';

function loyaltyUrl(path) {
  return `${RESTAURANT_API_URL.replace(/\/$/, '')}/api/public/website/${encodeURIComponent(SITE_SLUG)}/loyalty${path}`;
}

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function requestLoyaltyOtp(phone) {
  const res = await fetch(loyaltyUrl('/otp/request'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return parse(res);
}

export async function verifyLoyaltyOtp(phone, otp) {
  const res = await fetch(loyaltyUrl('/otp/verify'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  return parse(res);
}

export function phoneDigits(phone) {
  return String(phone || '').replace(/\D/g, '');
}

export function samePhone(a, b) {
  const x = phoneDigits(a);
  const y = phoneDigits(b);
  if (!x || !y) return false;
  return x.slice(-10) === y.slice(-10);
}

export function pointsToDollars(points, rules) {
  const rate = Number(rules?.redeemPointsPerDollar) >= 1 ? Number(rules.redeemPointsPerDollar) : 100;
  return Math.round(((Number(points) || 0) / rate) * 100) / 100;
}

/** Max points usable on this order: balance, capped so the discount never exceeds the subtotal. */
export function maxRedeemable(balance, subtotal, rules) {
  const rate = Number(rules?.redeemPointsPerDollar) >= 1 ? Number(rules.redeemPointsPerDollar) : 100;
  const bySubtotal = Math.floor(Math.max(0, Number(subtotal) || 0) * rate + 1e-6);
  const max = Math.max(0, Math.min(Math.floor(Number(balance) || 0), bySubtotal));
  const min = Number(rules?.minRedeemPoints) >= 0 ? Number(rules.minRedeemPoints) : 100;
  return max >= min && max > 0 ? max : 0;
}

export function earnFor(amount, menuConfig, rules) {
  const rate = Number(rules?.pointsPerDollar || menuConfig?.pointsPerDollar);
  const ptsPer = Number.isFinite(rate) && rate > 0 ? rate : 10;
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * ptsPer);
}
