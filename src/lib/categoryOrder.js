export function displayCategoryName(name) {
  return String(name || '').trim() || 'Menu';
}

/** Keep the public-menu API order (first-seen). No restaurant-specific list. */
export function sortCategories(categories) {
  const out = [];
  for (const c of categories || []) {
    const name = String(c || '').trim();
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

export function sortMenuItems(items) {
  const order = sortCategories((items || []).map((i) => i.category));
  const rank = new Map(order.map((c, i) => [c, i]));
  return [...(items || [])].sort((a, b) => {
    const ca = rank.get(a.category) ?? 999;
    const cb = rank.get(b.category) ?? 999;
    if (ca !== cb) return ca - cb;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}
