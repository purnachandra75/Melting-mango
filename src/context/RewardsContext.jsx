import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  enrollInProgram,
  fetchMyRewards,
  requestRewardsOtp,
  verifyRewardsOtp,
} from '../lib/rewardsApi';

const RewardsContext = createContext(null);
const KEY = 'mm-rewards-session';

function readSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved?.token && saved.exp > Date.now()) return saved;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * The customer's verified rewards session (phone + 30-minute token + their programmes/rewards).
 * Kept in sessionStorage only, so closing the tab signs out.
 */
export function RewardsProvider({ children }) {
  const [session, setSession] = useState(() => readSaved());
  const [data, setData] = useState(null);

  const save = (token, payload) => {
    const next = { token, phone: payload.phone, exp: Date.now() + 29 * 60 * 1000 };
    sessionStorage.setItem(KEY, JSON.stringify(next));
    setSession(next);
    setData(payload);
  };

  const signOut = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setSession(null);
    setData(null);
  }, []);

  // Restore a saved session after a page reload.
  useEffect(() => {
    if (!session?.token) return;
    fetchMyRewards(session.token)
      .then(setData)
      .catch((err) => {
        if (err.status === 401) signOut();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendCode = useCallback((phone) => requestRewardsOtp(phone), []);

  const verify = useCallback(async (phone, otp) => {
    const out = await verifyRewardsOtp(phone, otp);
    save(out.token, out);
    return out;
  }, []);

  const refresh = useCallback(async () => {
    if (!session?.token) return null;
    try {
      const out = await fetchMyRewards(session.token);
      setData(out);
      return out;
    } catch (err) {
      if (err.status === 401) signOut();
      throw err;
    }
  }, [session, signOut]);

  const enroll = useCallback(
    async (programId, name) => {
      const out = await enrollInProgram(session?.token, programId, name);
      setData(out);
      return out;
    },
    [session]
  );

  const value = useMemo(
    () => ({ token: session?.token || '', phone: session?.phone || '', data, verified: Boolean(session?.token), sendCode, verify, refresh, enroll, signOut }),
    [session, data, sendCode, verify, refresh, enroll, signOut]
  );
  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be used inside <RewardsProvider>');
  return ctx;
}
