const KNOWN_SPICE = ['Mild', 'Medium', 'Spicy', 'Extra Spicy'];

export function parseSpiceText(text) {
  const raw = String(text || '').trim();
  if (!raw || /^(none|—|-|no|n\/a|no spice)$/i.test(raw)) return [];
  const parts = raw.split(/[,/|]+/).map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const part of parts) {
    const hit = KNOWN_SPICE.find((k) => k.toLowerCase() === part.toLowerCase());
    if (hit && !out.includes(hit)) out.push(hit);
  }
  return out;
}

export function normStyle(value) {
  return String(value || '').trim().toLowerCase();
}

/** Ice cream items stay as individual dishes (no protein grouping). */
export function groupMenuDishes(dishes) {
  return (dishes || []).map((dish) => ({
    ...dish,
    isGroup: false,
    spiceLevels: Array.isArray(dish.spiceLevels) && dish.spiceLevels.length
      ? dish.spiceLevels
      : parseSpiceText(dish.spicyLevel || dish.spicy || ''),
  }));
}
