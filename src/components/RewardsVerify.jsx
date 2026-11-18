import { useState } from 'react';
import { useRewards } from '../context/RewardsContext';

/** Phone number → 6-digit code → verified. Used on the Rewards page and inside the bag. */
export default function RewardsVerify({ initialPhone = '', onDone, submitLabel = 'Send code' }) {
  const { sendCode, verify } = useRewards();
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [demo, setDemo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    if (!phone.trim()) {
      setError('Enter your mobile number.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const out = await sendCode(phone.trim());
      setSent(true);
      setDemo(out.demoOtp || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code.');
    } finally {
      setBusy(false);
    }
  };

  const check = async () => {
    if (!otp.trim()) {
      setError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const out = await verify(phone.trim(), otp.trim());
      onDone?.(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code did not work.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rwv">
      <label className="drawer__field">
        Mobile number
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          disabled={sent}
          placeholder="(555) 123-4567"
        />
      </label>
      {sent ? (
        <label className="drawer__field">
          6-digit code
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
          />
        </label>
      ) : null}
      {demo ? <p className="drawer__gcnote">Demo mode: your code is <strong>{demo}</strong>.</p> : null}
      {error ? <p className="drawer__gcerr" role="alert">{error}</p> : null}
      <div className="drawer__gcbtns">
        {sent ? (
          <>
            <button type="button" className="btn btn--ghost" onClick={check} disabled={busy}>
              {busy ? 'Checking…' : 'Verify'}
            </button>
            <button
              type="button"
              className="drawer__gclink"
              onClick={() => {
                setSent(false);
                setOtp('');
                setDemo('');
                setError('');
              }}
            >
              Change number
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={send} disabled={busy}>
            {busy ? 'Sending…' : submitLabel}
          </button>
        )}
      </div>
    </div>
  );
}
