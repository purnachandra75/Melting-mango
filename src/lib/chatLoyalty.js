/**
 * Chat checkout add-on: after the phone number, offer "Check my points" →
 * OTP → balance → optional redeem. Pure helpers; the widget runs the API calls.
 */
import { earnFor, maxRedeemable, pointsToDollars, requestLoyaltyOtp, verifyLoyaltyOtp } from './loyaltyApi';

export const LOYALTY_STEPS = {
  OFFER: 'awaiting_points_offer',
  OTP: 'awaiting_points_otp',
  REDEEM: 'awaiting_points_redeem',
};

const NAME_REPLY = 'And your name?';

export function isLoyaltyStep(step) {
  return step === LOYALTY_STEPS.OFFER || step === LOYALTY_STEPS.OTP || step === LOYALTY_STEPS.REDEEM;
}

export function loyaltyChatEnabled(session) {
  return session?.menuConfig?.loyaltyEnabled === true;
}

function cartSubtotal(session) {
  return (session.cart || []).reduce((s, l) => s + (Number(l.price) || 0) * (Number(l.qty) || 1), 0);
}

function money(n) {
  return `$${(Number(n) || 0).toFixed(2)}`;
}

/** Called right after a valid phone number. */
export function startLoyaltyOffer(session) {
  session.loyalty = null;
  session.step = LOYALTY_STEPS.OFFER;
  const earn = earnFor(cartSubtotal(session), session.menuConfig);
  return {
    session,
    reply: `You’ll earn ${earn} points with this order. Want to check your points balance? We’ll send a 6-digit code to ${session.guest.phone}.`,
    actions: [
      { id: 'points:check', label: 'Check my points' },
      { id: 'points:skip', label: 'Skip' },
    ],
  };
}

function toName(session, prefix = '') {
  session.step = 'awaiting_name';
  return { session, reply: prefix ? `${prefix}\n\n${NAME_REPLY}` : NAME_REPLY };
}

/** Handles the loyalty steps. Returns null when the session is not in a loyalty step. */
export function handleLoyaltyStep(session, text) {
  if (!isLoyaltyStep(session.step)) return null;
  const raw = String(text || '').trim();
  const q = raw.toLowerCase();
  const skip = q === 'points:skip' || /^(skip|no|not now|no thanks)$/.test(q);

  if (session.step === LOYALTY_STEPS.OFFER) {
    if (skip) return toName(session);
    if (q === 'points:check' || /check|points|yes/.test(q)) {
      return { session, reply: 'Sending your code…', loyaltyEffect: { type: 'request' } };
    }
    return startLoyaltyOffer(session);
  }

  if (session.step === LOYALTY_STEPS.OTP) {
    if (skip) return toName(session);
    if (q === 'points:resend') return { session, reply: 'Sending a new code…', loyaltyEffect: { type: 'request' } };
    const code = raw.replace(/\D/g, '');
    if (code.length !== 6) {
      return {
        session,
        reply: 'Please enter the 6-digit code.',
        actions: [
          { id: 'points:resend', label: 'Resend code' },
          { id: 'points:skip', label: 'Skip' },
        ],
      };
    }
    return { session, reply: 'Checking your code…', loyaltyEffect: { type: 'verify', otp: code } };
  }

  if (session.step === LOYALTY_STEPS.REDEEM) {
    const l = session.loyalty || {};
    if (q.startsWith('points:use') || /^(use|yes|redeem)/.test(q)) {
      const max = maxRedeemable(l.balance, cartSubtotal(session), l.rules);
      l.redeemPoints = max;
      session.loyalty = l;
      const off = pointsToDollars(max, l.rules);
      const newSub = Math.max(0, cartSubtotal(session) - off);
      return toName(
        session,
        `Done — ${max} points will take ${money(off)} off. New subtotal ${money(newSub)} (before tax). You’ll earn ${earnFor(newSub, session.menuConfig, l.rules)} points on this order.`
      );
    }
    l.redeemPoints = 0;
    session.loyalty = l;
    return toName(session, 'Okay, we’ll save your points for next time.');
  }
  return null;
}

/** Runs the API side of a loyalty turn. Never throws; errors become chat replies. */
export async function runChatLoyaltyEffect(result) {
  const session = { ...result.session };
  const effect = result.loyaltyEffect;
  try {
    if (effect.type === 'request') {
      const r = await requestLoyaltyOtp(session.guest.phone);
      session.step = LOYALTY_STEPS.OTP;
      const demo = r.demoOtp ? `\n\nDemo mode (no SMS is sent yet): your code is ${r.demoOtp}` : '';
      return {
        session,
        reply: `Enter the 6-digit code sent to ${session.guest.phone}.${demo}`,
        actions: [
          { id: 'points:resend', label: 'Resend code' },
          { id: 'points:skip', label: 'Skip' },
        ],
        loyaltyDemoOtp: r.demoOtp || '',
      };
    }
    if (effect.type === 'verify') {
      const r = await verifyLoyaltyOtp(session.guest.phone, effect.otp);
      const rules = r.rules || {};
      session.loyalty = { token: r.token, phone: session.guest.phone, balance: Number(r.balance) || 0, rules, redeemPoints: 0 };
      const sub = cartSubtotal(session);
      const earn = earnFor(sub, session.menuConfig, rules);
      const max = maxRedeemable(session.loyalty.balance, sub, rules);
      const head = `You have ${session.loyalty.balance} points (≈ ${money(pointsToDollars(session.loyalty.balance, rules))}). You’ll earn ${earn} points with this order.`;
      if (max > 0) {
        session.step = LOYALTY_STEPS.REDEEM;
        return {
          session,
          reply: `${head}\n\nUse ${max} points for ${money(pointsToDollars(max, rules))} off now?`,
          actions: [
            { id: 'points:use', label: `Use ${max} pts (−${money(pointsToDollars(max, rules))})` },
            { id: 'points:keep', label: 'Save for later' },
          ],
        };
      }
      const min = Number(rules.minRedeemPoints) || 0;
      return toName(session, min > session.loyalty.balance ? `${head} You can redeem from ${min} points.` : head);
    }
  } catch (err) {
    if (err?.status === 401 && effect.type === 'verify') {
      session.step = LOYALTY_STEPS.OTP;
      return {
        session,
        reply: `${String(err.message || 'Wrong code').replace(/\.?$/, '.')} Try again, or skip.`,
        actions: [
          { id: 'points:resend', label: 'Resend code' },
          { id: 'points:skip', label: 'Skip' },
        ],
      };
    }
    return toName(session, `${err?.message || 'Could not check points right now'}. You can still place the order.`);
  }
  return toName(session);
}

/** Line shown in the order summary before "Place this order?". */
export function loyaltyConfirmLine(session) {
  const l = session?.loyalty;
  if (!loyaltyChatEnabled(session)) return '';
  const sub = cartSubtotal(session);
  if (l?.redeemPoints > 0) {
    const off = pointsToDollars(l.redeemPoints, l.rules);
    return `\nPoints: −${l.redeemPoints} pts (−${money(off)}) · you’ll earn ${earnFor(Math.max(0, sub - off), session.menuConfig, l.rules)} pts`;
  }
  return `\nYou’ll earn ${earnFor(sub, session.menuConfig, l?.rules)} points with this order`;
}

/** Extra fields for the order payload (only when redeeming with a verified token). */
export function loyaltyOrderFields(session) {
  const l = session?.loyalty;
  if (!l?.token || !(l.redeemPoints > 0)) return {};
  return { redeemPoints: l.redeemPoints, loyaltyToken: l.token };
}

/** Text for the chat confirmation after the order is placed. */
export function loyaltyPlacedText(order, session) {
  const info = order?.loyalty;
  if (!info) return '';
  const parts = [];
  if (info.pointsRedeemed > 0) parts.push(`${info.pointsRedeemed} points redeemed (−${money(info.discount)}).`);
  if (info.pointsToEarn > 0) parts.push(`You’ll earn ${info.pointsToEarn} points when your order is completed.`);
  const known = info.balance != null ? info.balance : session?.loyalty ? session.loyalty.balance : null;
  if (known != null) parts.push(`Points balance: ${known}.`);
  return parts.join(' ');
}
