/**
 * Public website API. Linking is Restaurant Admin → Settings → Website Connection.
 */
import { RESTAURANT_API_URL, SITE_SLUG } from '../config';
import { flavors, setLiveCatalog, clearLiveCatalog } from '../data/flavors';
import { sortCategories, sortMenuItems } from './categoryOrder';

const DEFAULT_SCOOP = {
  availability: 'Normal',
  notes: '',
  tags: ['Menu'],
  color: '#F6B93B',
  topping: 'mango',
  vessel: 'cup',
  tint: '#FFF6D6',
  photo: '/images/mango-scoops.webp',
  scoop: '/images/scoops/mango.webp',
  rating: 4.8,
};

function isContainerCategory(category) {
  return /^containers?$/i.test(String(category || '').trim());
}

/** Strip trailing "scoop(s)" so "Mango Scoop" → "mango". Bare "Scoops" → "". */
function normalizeFlavorName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\bscoops?\b/g, ' ')
    .replace(/[^a-z0-9\s+&.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Match Admin menu names to local art only when the flavour name is intentional
 * (e.g. "Mango Scoop" → Mango). Never fuzzy-match single letters / "Scoops".
 */
function matchLocalFlavor(itemName) {
  const raw = normalizeFlavorName(itemName);
  if (!raw) return null;
  const exact = flavors.find((f) => normalizeFlavorName(f.name) === raw);
  if (exact) return exact;
  return flavors.find((f) => {
    const n = normalizeFlavorName(f.name);
    if (!n || n.length < 3) return false;
    return new RegExp(`(^|\\s)${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(raw);
  });
}

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

/**
 * Sync guest scoop catalog from Restaurant Admin public menu.
 * Only non-deleted, available scoops appear on /menu and the scoop builder.
 */
export async function connectLiveMenu() {
  try {
    const data = await getMenu();
    const scoops = (data.items || []).filter((item) => !isContainerCategory(item.category));
    const entries = [];
    const usedLocalIds = new Set();

    for (const item of scoops) {
      const image = resolveMenuImage(item.imageUrl) || item.image || '';
      let local = matchLocalFlavor(item.name);
      // One Admin row → one website card. Don't collapse two items onto the same local id.
      if (local && usedLocalIds.has(local.id)) local = null;

      if (local) {
        usedLocalIds.add(local.id);
        entries.push({
          id: local.id,
          base: 'local',
          patch: {
            // Keep Admin display name so newly added items are recognizable.
            name: item.name || local.name,
            price: Number(item.price) || local.price,
            description: item.description || local.description,
            notes: item.description || local.notes,
            menuItemId: item.id,
            ...(image ? { photo: image } : {}),
            available: item.available !== false,
          },
        });
      } else {
        const id = `api:${item.id}`;
        entries.push({
          id,
          base: 'api',
          flavor: {
            ...DEFAULT_SCOOP,
            id,
            name: item.name,
            price: Number(item.price) || 0,
            description: item.description || '',
            notes: item.description || item.category || '',
            photo: image || DEFAULT_SCOOP.photo,
            menuItemId: item.id,
            tags: [item.category || 'Menu'],
            rating: Number(item.rating) || DEFAULT_SCOOP.rating,
          },
        });
      }
    }
    setLiveCatalog(entries);
    return {
      restaurantName: data.restaurantName,
      linked: entries.length,
      menuConfig: data.menuConfig || null,
    };
  } catch (err) {
    clearLiveCatalog();
    throw err;
  }
}
