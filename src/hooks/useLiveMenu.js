import { useCallback, useEffect, useState } from 'react';
import { getMenu } from '../lib/restaurantApi';

/**
 * Live menu + menuConfig from Restaurant Server (slug in src/config.js).
 * Refetches on tab focus so Admin add/delete shows up in chat without a hard reload.
 */
export function useLiveMenu() {
  const [items, setItems] = useState([]);
  const [menuConfig, setMenuConfig] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const data = await getMenu();
      setItems(data.items || []);
      setMenuConfig(data.menuConfig || null);
      setRestaurantName(data.restaurantName || '');
      setStatus((data.items || []).length ? 'live' : 'empty');
      setError('');
      return data;
    } catch (err) {
      setItems([]);
      setMenuConfig(null);
      setRestaurantName('');
      setStatus('error');
      setError(err.message || 'Could not load menu');
      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refresh();
      } catch {
        if (cancelled) return;
      }
    })();

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [refresh]);

  return { dishes: items, menuConfig, restaurantName, status, error, isLive: status === 'live', refresh };
}
