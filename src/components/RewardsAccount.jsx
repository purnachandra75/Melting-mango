import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRewards } from '../context/RewardsContext';
import { formatPrice } from '../data/flavors';
import RewardsVerify from './RewardsVerify';

function expiryText(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `Use by ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

function Progress({ program }) {
  const p = program.progress;
  if (!p) return null;
  if (p.kind === 'weekly') {
    return (
      <p className="myrw__line">
        {p.over ? 'All weekly rewards have been issued.' : `Week ${p.week} of ${p.weeks}`} · {p.redeemed} free scoop{p.redeemed === 1 ? '' : 's'} used
      </p>
    );
  }
  if (p.kind === 'stamps') {
    return (
      <>
        <div className="myrw__stamps" aria-label={`${p.collected} of ${p.target} stamps`}>
          {Array.from({ length: p.target }, (_, i) => {
            const stamp = p.stamps[i];
            return (
              <span key={i} className={`myrw__stamp ${stamp ? 'is-on' : ''}`} title={stamp?.flavor || ''}>
                {stamp ? '✓' : i + 1}
              </span>
            );
          })}
        </div>
        <p className="myrw__line">
          {p.collected} of {p.target} flavours
          {p.stamps.length ? ` · ${p.stamps.map((s) => s.flavor).join(', ')}` : ''}
          {p.cardsCompleted ? ` · ${p.cardsCompleted} card${p.cardsCompleted === 1 ? '' : 's'} completed` : ''}
        </p>
      </>
    );
  }
  return null;
}

/** "My rewards": verify the phone, join programmes, see stamps/points and rewards ready to use. */
export default function RewardsAccount() {
  const { verified, data, phone, enroll, signOut } = useRewards();
  const [name, setName] = useState('');
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState('');

  if (!verified) {
    return (
      <div className="myrw">
        <h3>Check your rewards</h3>
        <p className="myrw__line">Verify your mobile number to join a programme, see your stamps and points, and use a reward in your bag.</p>
        <RewardsVerify />
      </div>
    );
  }

  const join = async (program) => {
    setBusyId(program.id);
    setError('');
    setJoined('');
    try {
      await enroll(program.id, name.trim() || data?.name || '');
      setJoined(`You joined ${program.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="myrw">
      <div className="myrw__head">
        <div>
          <h3>{data?.name ? `Hi ${data.name.split(' ')[0]}` : 'Your rewards'}</h3>
          <p className="myrw__line">{phone}</p>
        </div>
        <button type="button" className="drawer__gclink" onClick={signOut}>Sign out</button>
      </div>

      {!data ? <p className="myrw__line">Loading…</p> : null}
      {joined ? <p className="myrw__ok" role="status">{joined}</p> : null}
      {error ? <p className="drawer__gcerr" role="alert">{error}</p> : null}

      {data?.rewards?.length ? (
        <div className="myrw__ready">
          <h4>Ready to use</h4>
          {data.rewards.map((r) => (
            <div className="myrw__reward" key={r.id}>
              <strong>{r.label}</strong>
              <span>
                {r.redeemableOnOrder
                  ? r.programType === 'founding'
                    ? 'Add it to your bag with a paid order'
                    : 'Add it to your bag at checkout'
                  : 'Show your phone number at the counter'}
                {r.validUntil ? ` · ${expiryText(r.validUntil)}` : ''}
              </span>
            </div>
          ))}
          <Link className="btn btn--mango" to="/menu">Order now</Link>
        </div>
      ) : data ? (
        <p className="myrw__line">No rewards ready right now.</p>
      ) : null}

      {(data?.programs || []).map((p) => (
        <div className="myrw__prog" key={p.id}>
          <div className="myrw__proghead">
            <h4>{p.name}</h4>
            {p.type === 'points' ? (
              <strong>{data.points.balance.toLocaleString()} pts</strong>
            ) : p.enrolled ? (
              <span className="myrw__badge">Joined</span>
            ) : p.full ? (
              <span className="myrw__badge myrw__badge--off">Full</span>
            ) : p.canEnroll ? (
              <button type="button" className="btn btn--ghost" disabled={busyId === p.id} onClick={() => join(p)}>
                {busyId === p.id ? 'Joining…' : 'Join'}
              </button>
            ) : null}
          </div>
          {p.type === 'points' ? (
            <p className="myrw__line">
              Worth {formatPrice(data.points.balanceValue)} off · earn on every completed order
              {data.points.freeItem?.enabled ? ` · ${data.points.freeItem.points} pts = a free scoop` : ''}
            </p>
          ) : (
            <Progress program={p} />
          )}
        </div>
      ))}

      {data && !data.name ? (
        <label className="drawer__field">
          Your name (for new memberships)
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
      ) : null}
    </div>
  );
}
