import { useEffect, useState } from 'react';
import { getMenu } from '../lib/restaurantApi';

/**
 * Live menu + menuConfig from Restaurant Server (slug in src/config.js).
 */
export function useLiveMenu() {
  const [items, setItems] = useState([]);
  const [menuConfig, setMenuConfig] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMenu();
        if (cancelled) return;
        setItems(data.items || []);
        setMenuConfig(data.menuConfig || null);
        setRestaurantName(data.restaurantName || '');
        setStatus((data.items || []).length ? 'live' : 'empty');
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setMenuConfig(null);
        setRestaurantName('');
        setStatus('error');
        setError(err.message || 'Could not load menu');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { dishes: items, menuConfig, restaurantName, status, error, isLive: status === 'live' };
}
