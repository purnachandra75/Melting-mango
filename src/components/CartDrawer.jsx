import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Scoop from './Scoop';
import { catalogFlavors, formatPrice } from '../data/flavors';
import { useCart } from '../context/CartContext';
import { useDialog } from '../hooks/useDialog';
import { createOrder } from '../lib/restaurantApi';
import { checkGiftCardForBag } from '../lib/offersApi';
import { maxRedeemable, pointsToDollars, samePhone } from '../lib/loyaltyApi';
import { useRewards } from '../context/RewardsContext';
import RewardsVerify from './RewardsVerify';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/** One order line per scoop flavour (by menu item id) so the server prices them from the live menu. */
function toOrderLines(items) {
  const lines = [];
  for (const item of items) {
    const container = item.container.label;
    for (const f of item.flavors) {
      const found = lines.find(
        (l) => l.container === container && (f.menuItemId ? l.menuItemId === f.menuItemId : l.name === f.name),
      );
      if (found) found.qty += item.qty;
      else lines.push({ menuItemId: f.menuItemId || undefined, name: f.name, qty: item.qty, container });
    }
  }
  return lines;
}

export default function CartDrawer() {
  const { items, subtotal, isOpen, close, updateQty, removeItem, clear } = useCart();
  const [placed, setPlaced] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Gift card applied to this bag. Lives only in memory (the PIN is never stored in the browser).
  const [gift, setGift] = useState(null);
  const [gcOpen, setGcOpen] = useState(false);
  const [gcCode, setGcCode] = useState('');
  const [gcPin, setGcPin] = useState('');
  const [gcBusy, setGcBusy] = useState(false);
  const [gcError, setGcError] = useState('');
  // Rewards (verified by phone code): Mango Points discount and one free reward per order.
  const rw = useRewards();
  const [rwOpen, setRwOpen] = useState(false);
  const [usePts, setUsePts] = useState(false);
  const [claimKey, setClaimKey] = useState('');
  const [claimItemId, setClaimItemId] = useState('');
  const dialogRef = useDialog(isOpen, close);

  useEffect(() => {
    if (!isOpen) setPlaced(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const points = rw.data?.points || {};
  const phoneMatches = rw.verified && samePhone(rw.phone, phone);
  const grants = rw.data?.rewards || [];
  const counterRewards = grants.filter((g) => !g.redeemableOnOrder);
  const rewardChoices = [
    ...grants
      .filter((g) => g.redeemableOnOrder)
      .map((g) => ({ key: `grant:${g.id}`, type: 'grant', grantId: g.id, programType: g.programType, label: g.label })),
    ...(points.freeItem?.enabled
      ? [{
          key: 'points_item',
          type: 'points_item',
          label: `Free scoop for ${points.freeItem.points} Mango Points`,
          disabled: (points.balance || 0) < points.freeItem.points,
        }]
      : []),
  ];
  const claim = phoneMatches ? rewardChoices.find((c) => c.key === claimKey && !c.disabled) || null : null;
  const reserve = claim?.type === 'points_item' ? points.freeItem.points : 0;
  const maxPts = phoneMatches && points.enabled ? maxRedeemable(Math.max(0, (points.balance || 0) - reserve), subtotal, points) : 0;
  const ptsToUse = usePts ? maxPts : 0;
  const pointsDiscount = ptsToUse > 0 ? pointsToDollars(ptsToUse, points) : 0;
  const scoopChoices = catalogFlavors().filter((f) => f.menuItemId);
  const claimedItem = claim && claimItemId ? scoopChoices.find((f) => f.menuItemId === claimItemId) || null : null;
  const showBreakdown = Boolean(gift) || pointsDiscount > 0 || Boolean(claimedItem);
  const taxRate = gift?.taxRate ?? rw.data?.taxRate ?? 0;
  const netSub = round2(Math.max(0, subtotal - pointsDiscount));
  const tax = showBreakdown ? round2(netSub * taxRate) : 0;
  const orderTotal = round2(netSub + tax);
  const giftApplied = gift ? Math.min(gift.balance, orderTotal) : 0;
  const amountDue = round2(orderTotal - giftApplied);

  const applyGift = async () => {
    if (!gcCode.trim()) {
      setGcError('Enter the gift card number.');
      return;
    }
    setGcBusy(true);
    setGcError('');
    try {
      const card = await checkGiftCardForBag({ code: gcCode.trim(), pin: gcPin.trim(), subtotal });
      setGift({ number: gcCode.trim(), pin: gcPin.trim(), display: card.code, balance: card.balance, taxRate: card.taxRate });
      setGcOpen(false);
      setGcCode('');
      setGcPin('');
    } catch (err) {
      setGcError(err instanceof Error ? err.message : 'Could not check this gift card.');
    } finally {
      setGcBusy(false);
    }
  };

  const removeGift = () => {
    setGift(null);
    setGcError('');
  };

  const checkout = async () => {
    if (!name.trim() || !phone.trim()) {
      setError('Add your name and phone so the parlour can call the order.');
      return;
    }
    if (claim && !claimedItem) {
      setError('Pick the scoop you want for your free reward.');
      return;
    }
    if (claim?.programType === 'founding' && pointsDiscount >= subtotal) {
      setError('Founding 50 free scoops need a paid purchase on the same order. Use fewer points.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const order = await createOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        notes: 'Pickup from the Melting Mango website',
        lineItems: toOrderLines(items),
        ...(gift ? { giftCardCode: gift.number, giftCardPin: gift.pin } : {}),
        ...(phoneMatches && (ptsToUse > 0 || claimedItem)
          ? {
              loyaltyToken: rw.token,
              ...(ptsToUse > 0 ? { redeemPoints: ptsToUse } : {}),
              ...(claimedItem
                ? { rewardClaim: { type: claim.type, grantId: claim.grantId, menuItemId: claimItemId } }
                : {}),
            }
          : {}),
      });
      setPlaced({
        id: order.code || order.orderId,
        total: order.total ?? subtotal,
        giftCard: order.giftCard || null,
        reward: order.reward || null,
        pointsUsed: order.loyalty?.pointsRedeemed || 0,
      });
      setGift(null);
      setUsePts(false);
      setClaimKey('');
      setClaimItemId('');
      rw.refresh().catch(() => {});
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place the order.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="overlay" onClick={close} aria-hidden="true" />
      <aside
        className="drawer"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        tabIndex={-1}
      >
        <div className="drawer__head">
          <h2 id="bag-title">Your bag</h2>
          <button type="button" className="modal__close modal__close--static" onClick={close} aria-label="Close bag">
            ×
          </button>
        </div>

        {placed ? (
          <div className="drawer__items">
            <div className="success" role="status">
              <div className="success__icon" aria-hidden="true">✓</div>
              <h3>Order placed!</h3>
              <p>
                Order <strong>{placed.id}</strong> · {formatPrice(placed.total)}. We’re scooping it now — ready for pickup in about 15 minutes.
              </p>
              {placed.reward ? <p>Free reward: <strong>{placed.reward.name}</strong>.</p> : null}
              {placed.pointsUsed > 0 ? <p>Mango Points used: <strong>{placed.pointsUsed.toLocaleString()}</strong>.</p> : null}
              {placed.giftCard ? (
                <p>
                  Gift card …{placed.giftCard.last4} paid <strong>{formatPrice(placed.giftCard.applied)}</strong>.{' '}
                  {placed.giftCard.covered
                    ? 'Nothing left to pay at pickup.'
                    : <>Please pay <strong>{formatPrice(placed.giftCard.amountDue)}</strong> at pickup.</>}{' '}
                  Card balance left: {formatPrice(placed.giftCard.balanceAfter)}.
                </p>
              ) : null}
              <button type="button" className="btn btn--ghost" onClick={close}>Back to the site</button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="drawer__items">
            <div className="drawer__empty">
              <Scoop scoops={['#ECECEE']} size={90} title="" />
              <h3>Your bag is empty</h3>
              <p>Something sweet is only a scoop away.</p>
              <Link to="/menu" className="btn btn--primary" onClick={close}>Browse flavours</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="drawer__items">
              {items.map((i) => (
                <div className="drawer__item" key={i.key}>
                  <div className="drawer__thumb" style={{ background: i.flavors[0].tint }}>
                    <Scoop scoops={i.flavors.map((f) => f.color)} vessel={i.container.id} size={44} title="" />
                  </div>
                  <div>
                    <h3>{i.name}</h3>
                    <small>
                      {i.size.label} scoop{i.size.count > 1 ? 's' : ''} · {i.container.label} · {formatPrice(i.unit)}
                    </small>
                    <div className="qty">
                      <button type="button" onClick={() => updateQty(i.key, i.qty - 1)} aria-label={`Decrease ${i.name}`}>−</button>
                      <span aria-live="polite" aria-atomic="true">{i.qty}</span>
                      <button type="button" onClick={() => updateQty(i.key, i.qty + 1)} aria-label={`Increase ${i.name}`}>+</button>
                    </div>
                  </div>
                  <div className="drawer__price">
                    {formatPrice(i.total)}
                    <br />
                    <button type="button" className="drawer__remove" onClick={() => removeItem(i.key)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer__foot">
              {showBreakdown ? (
                <>
                  <div className="drawer__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {pointsDiscount > 0 ? (
                    <div className="drawer__row drawer__row--gift">
                      <span>Mango Points ({ptsToUse.toLocaleString()} pts)</span>
                      <span>−{formatPrice(pointsDiscount)}</span>
                    </div>
                  ) : null}
                  {claimedItem ? (
                    <div className="drawer__row drawer__row--gift">
                      <span>{claimedItem.name} (free reward)</span>
                      <span>{formatPrice(0)}</span>
                    </div>
                  ) : null}
                  <div className="drawer__row"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                  {gift ? (
                    <div className="drawer__row drawer__row--gift">
                      <span>Gift card …{gift.display.slice(-4)}</span>
                      <span>−{formatPrice(giftApplied)}</span>
                    </div>
                  ) : null}
                  <div className="drawer__row drawer__row--total">
                    <span>{gift ? (amountDue > 0 ? 'To pay at pickup' : 'Left to pay') : 'Total'}</span>
                    <span>{formatPrice(amountDue)}</span>
                  </div>
                </>
              ) : (
                <div className="drawer__row drawer__row--total"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
              )}
              {gift ? (
                <p className="drawer__gcnote">
                  Card balance {formatPrice(gift.balance)}
                  {gift.balance > giftApplied ? ` · ${formatPrice(round2(gift.balance - giftApplied))} stays on the card` : ''}.{' '}
                  <button type="button" className="drawer__gclink" onClick={removeGift}>Remove</button>
                </p>
              ) : (
                <>
                  {gcOpen ? (
                    <div className="drawer__gc">
                      <label className="drawer__field">
                        Gift card number
                        <input
                          value={gcCode}
                          onChange={(e) => setGcCode(e.target.value.toUpperCase())}
                          autoComplete="off"
                          spellCheck={false}
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                        />
                      </label>
                      <label className="drawer__field">
                        PIN
                        <input
                          value={gcPin}
                          onChange={(e) => setGcPin(e.target.value)}
                          type="password"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="From your gift card email"
                        />
                      </label>
                      {gcError ? <p className="drawer__gcerr" role="alert">{gcError}</p> : null}
                      <div className="drawer__gcbtns">
                        <button type="button" className="btn btn--ghost" onClick={applyGift} disabled={gcBusy}>
                          {gcBusy ? 'Checking…' : 'Apply gift card'}
                        </button>
                        <button type="button" className="drawer__gclink" onClick={() => { setGcOpen(false); setGcError(''); }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="drawer__gclink drawer__gcopen" onClick={() => setGcOpen(true)}>
                      Have a gift card? Apply it
                    </button>
                  )}
                </>
              )}
              {!rw.verified ? (
                rwOpen ? (
                  <div className="drawer__gc">
                    <RewardsVerify
                      initialPhone={phone}
                      submitLabel="Send code"
                      onDone={(out) => {
                        setRwOpen(false);
                        if (!phone.trim()) setPhone(out.phone || '');
                      }}
                    />
                    <button type="button" className="drawer__gclink" onClick={() => setRwOpen(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className="drawer__gclink drawer__gcopen" onClick={() => setRwOpen(true)}>
                    Have rewards or points? Use them
                  </button>
                )
              ) : !phoneMatches ? (
                <p className="drawer__gcnote">
                  Rewards are linked to {rw.phone}. Enter that number below to use them.{' '}
                  <button type="button" className="drawer__gclink" onClick={rw.signOut}>Not you?</button>
                </p>
              ) : rw.data ? (
                <div className="drawer__rw">
                  <p className="drawer__rwhead">
                    Your rewards <button type="button" className="drawer__gclink" onClick={rw.signOut}>Sign out</button>
                  </p>
                  {points.enabled && points.balance > 0 ? (
                    maxPts > 0 ? (
                      <label className="drawer__check">
                        <input type="checkbox" checked={usePts} onChange={(e) => setUsePts(e.target.checked)} />
                        <span>
                          Use {maxPts.toLocaleString()} Mango Points (−{formatPrice(pointsToDollars(maxPts, points))})
                          <small> · balance {points.balance.toLocaleString()}</small>
                        </span>
                      </label>
                    ) : (
                      <p className="drawer__gcnote">
                        Mango Points balance {points.balance.toLocaleString()} (needs {points.minRedeemPoints} to redeem).
                      </p>
                    )
                  ) : null}
                  {rewardChoices.length ? (
                    <label className="drawer__field">
                      Free reward
                      <select value={claimKey} onChange={(e) => setClaimKey(e.target.value)}>
                        <option value="">No reward on this order</option>
                        {rewardChoices.map((c) => (
                          <option key={c.key} value={c.key} disabled={c.disabled}>{c.label}</option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  {claim ? (
                    <label className="drawer__field">
                      Choose your free scoop
                      <select value={claimItemId} onChange={(e) => setClaimItemId(e.target.value)}>
                        <option value="">Pick a flavour…</option>
                        {scoopChoices.map((f) => (
                          <option key={f.menuItemId} value={f.menuItemId}>{f.name}</option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  {counterRewards.map((r) => (
                    <p className="drawer__gcnote" key={r.id}>{r.label}: show your phone number at the counter.</p>
                  ))}
                  <p className="drawer__gcnote">One free reward per order.</p>
                </div>
              ) : (
                <p className="drawer__gcnote">Loading your rewards…</p>
              )}
              <label className="drawer__field">
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </label>
              <label className="drawer__field">
                Phone
                <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
              </label>
              {error ? <p className="drawer__fine" role="alert">{error}</p> : null}
              <p className="drawer__fine">One free scoop reward per order. Verify your phone to use your rewards and points here.</p>
              <button type="button" className="btn btn--mango btn--block" onClick={checkout} disabled={busy}>
                {busy ? 'Placing order…' : 'Checkout for pickup'}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
