import { useCallback, useEffect, useState } from 'react';
import { catalogFlavors, isCatalogLive, subscribeCatalog } from '../data/flavors';
import { connectLiveMenu } from '../lib/restaurantApi';

/**
 * Scoop list driven by Restaurant Admin → public website menu API.
 * Soft-deleted / unavailable Admin items do not appear here.
 * Refetches when the tab becomes visible so newly added Admin items show up.
 */
export function useLiveFlavors() {
  const [flavors, setFlavors] = useState(() => catalogFlavors());
  const [status, setStatus] = useState(() => (isCatalogLive() ? 'live' : 'loading'));
  const [error, setError] = useState('');

  useEffect(() => subscribeCatalog(() => {
    setFlavors(catalogFlavors());
    if (isCatalogLive()) setStatus(catalogFlavors().length ? 'live' : 'empty');
  }), []);

  const refresh = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setStatus((prev) => (prev === 'live' || prev === 'empty' ? prev : 'loading'));
    try {
      await connectLiveMenu();
      const next = catalogFlavors();
      setFlavors(next);
      setStatus(next.length ? 'live' : 'empty');
      setError('');
      return next;
    } catch (err) {
      setFlavors([]);
      setStatus('error');
      setError(err.message || 'Could not load menu');
      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await connectLiveMenu();
        if (cancelled) return;
        const next = catalogFlavors();
        setFlavors(next);
        setStatus(next.length ? 'live' : 'empty');
        setError('');
      } catch (err) {
        if (cancelled) return;
        setFlavors([]);
        setStatus('error');
        setError(err.message || 'Could not load menu');
      }
    })();

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        refresh({ quiet: true }).catch(() => {});
      }
    };
    const onFocus = () => {
      refresh({ quiet: true }).catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  return { flavors, status, error, isLive: status === 'live', refresh };
}