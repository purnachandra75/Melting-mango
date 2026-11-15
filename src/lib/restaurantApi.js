/**
 * Public website API. Linking is Restaurant Admin → Settings → Website Connection.
 */
import { RESTAURANT_API_URL, SITE_SLUG } from '../config';
import { flavors, setMenuPriceOverrides } from '../data/flavors';
import { sortCategories, sortMenuItems } from './categoryOrder';

function baseUrl() {
  return `${RESTAURANT_API_URL.replace(/\/$/, '')}/api/public/website/${encodeURIComponent(SITE_SLUG)}`;
}

export function resolveMenuImage(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;
  const base = RESTAURANT_API_URL.replace(/\/$/, '');
  return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`;
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || data.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function getMenu() {
  const res = await fetch(`${baseUrl()}/menu`);
  const data = await parseJson(res);
  const items = (data.items || []).map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category || 'Menu',
    desc: item.description || '',
    description: item.description || '',
    price: Number(item.price) || 0,
    priceValue: Number(item.price) || 0,
    image: resolveMenuImage(item.imageUrl),
    imageUrl: resolveMenuImage(item.imageUrl),
    veg: Boolean(item.isVeg),
    isVeg: Boolean(item.isVeg),
    spicyLevel: item.spicyLevel || '',
    available: item.available !== false,
    live: true,
  }));
  const orderedItems = sortMenuItems(items);
  const categories = sortCategories(
    Array.isArray(data.categories) && data.categories.length
      ? data.categories
      : orderedItems.map((i) => i.category),
  );
  return {
    ...data,
    items: orderedItems,
    categories,
    menuConfig: data.menuConfig || null,
  };
}

export async function createOrder(payload) {
  const res = await fetch(`${baseUrl()}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

/** Match admin scoops to the local flavour art and apply live prices. */
export async function connectLiveMenu() {
  const data = await getMenu();
  const scoops = (data.items || []).filter((item) => item.category !== 'Containers');
  const entries = [];
  for (const item of scoops) {
    const local = flavors.find((f) => item.name.toLowerCase().includes(f.name.toLowerCase()));
    if (!local) continue;
    entries.push([
      local.id,
      {
        price: Number(item.price) || local.price,
        description: item.description || local.description,
        menuItemId: item.id,
      },
    ]);
  }
  setMenuPriceOverrides(entries);
  return { restaurantName: data.restaurantName, linked: entries.length, menuConfig: data.menuConfig || null };
}
