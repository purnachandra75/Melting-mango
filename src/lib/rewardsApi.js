/**
 * Website rewards: phone OTP → short-lived token → programmes, progress, free scoops.
 * Nothing about a customer is shown without a verified code.
 */
import { RESTAURANT_API_URL, SITE_SLUG } from '../config';

const url = (path) =>
  `${RESTAURANT_API_URL.replace(/\/$/, '')}/api/public/website/${encodeURIComponent(SITE_SLUG)}/rewards${path}`;

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function post(path, body, token) {
  return fetch(url(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body || {}),
  }).then(parse);
}

export const requestRewardsOtp = (phone) => post('/otp/request', { phone });
export const verifyRewardsOtp = (phone, otp) => post('/otp/verify', { phone, otp });
export const fetchMyRewards = (token) => post('/me', {}, token);
export const enrollInProgram = (token, programId, name) => post('/enroll', { programId, name }, token);
