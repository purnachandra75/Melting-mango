/**
 * Gift card faces are built from what the owner sets in Restaurant Admin: an occasion text,
 * an uploaded background (or one of these colours) and a light/dark text colour.
 */
const BACKGROUNDS = {
  mango: 'linear-gradient(135deg,#fbbf24,#ea580c)',
  berry: 'linear-gradient(135deg,#db2777,#7e22ce)',
  ocean: 'linear-gradient(135deg,#0ea5e9,#1e3a8a)',
  forest: 'linear-gradient(135deg,#16a34a,#064e3b)',
  violet: 'linear-gradient(135deg,#8b5cf6,#4c1d95)',
  sunset: 'linear-gradient(135deg,#fb7185,#f97316)',
  midnight: 'linear-gradient(135deg,#334155,#0f172a)',
  blush: 'linear-gradient(135deg,#fbcfe8,#f472b6)',
  confetti:
    'radial-gradient(circle,rgba(255,255,255,.6) 0 2px,transparent 2.5px) 0 0/22px 22px, radial-gradient(circle,rgba(253,224,71,.7) 0 2px,transparent 2.5px) 11px 11px/22px 22px, linear-gradient(135deg,#f472b6,#8b5cf6)',
  festive: 'radial-gradient(circle at 85% 20%,rgba(253,224,71,.5),transparent 42%), linear-gradient(135deg,#7f1d1d,#b45309)',
  rose: 'linear-gradient(135deg,#fda4af,#be123c)',
  royal: 'radial-gradient(circle at 15% 85%,rgba(250,204,21,.45),transparent 45%), linear-gradient(135deg,#1e3a8a,#312e81)',
};

export function backgroundFor(card) {
  return BACKGROUNDS[card?.designTheme] || BACKGROUNDS.mango;
}

/** Short name shown under the card thumbnails. */
export function occasionLabel(card) {
  return String(card?.occasion || '').trim() || 'Gift Card';
}
