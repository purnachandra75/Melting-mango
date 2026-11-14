/** Tasteful line-art clip decorations. Purely visual — always aria-hidden. */

function Cone({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 96" fill="none" aria-hidden="true">
      <path
        d="M32 4C22 18 18 30 18 40c0 10 6.2 18 14 18s14-8 14-18C46 30 42 18 32 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M20 56 32 92 44 56" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 68h16M26.5 78h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Scoop({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M12 34c0-12 9-22 20-22s20 10 20 22c0 6-3 10-8 13v5H20v-5c-5-3-8-7-8-13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M20 32c3-6 8-9 12-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Popsicle({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 96" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="28" height="58" rx="14" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 64v24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 22h16M16 34h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function Sundae({ className }) {
  return (
    <svg className={className} viewBox="0 0 72 96" fill="none" aria-hidden="true">
      <circle cx="28" cy="22" r="12" stroke="currentColor" strokeWidth="1.55" />
      <circle cx="44" cy="24" r="11" stroke="currentColor" strokeWidth="1.55" />
      <circle cx="36" cy="12" r="9" stroke="currentColor" strokeWidth="1.55" />
      <path d="M36 4v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="36" cy="3" r="2.1" fill="currentColor" />
      <path
        d="M18 34c2 10 6 16 18 16s16-6 18-16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M28 50 32 86h8l4-36" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M26 90h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Mango({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 88" fill="none" aria-hidden="true">
      <path
        d="M28 78c-14-8-20-26-16-42 4-16 20-30 36-28 14 2 22 16 20 30-3 20-16 44-40 40Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M46 14c6-12 18-16 26-12-2 10-12 16-24 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 36c6-8 16-12 24-10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Heart({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 30" fill="none" aria-hidden="true">
      <path
        d="M16 26S3 17 3 10a6.5 6.5 0 0 1 13-1 6.5 6.5 0 0 1 13 1c0 7-13 16-13 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparkle({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 0c.7 6.4 3.2 11.6 8 16-4.8 4.4-7.3 9.6-8 16-.7-6.4-3.2-11.6-8-16C12.8 11.6 15.3 6.4 16 0Z" />
    </svg>
  );
}

function Sprinkles({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M12 18l10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 12l4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 36l12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 48l9-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 52l6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 62l10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 70l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = { Cone, Scoop, Popsicle, Sundae, Mango, Heart, Sparkle, Sprinkles };

/**
 * A single positioned clip. `kind` picks the motif; colour and placement come from CSS.
 */
export function Clip({ kind, className }) {
  const Icon = ICONS[kind];
  if (!Icon) return null;
  return <Icon className={`clip ${className || ''}`} />;
}

/** Soft organic blob, used behind sections. */
export function Blob({ className }) {
  return (
    <svg className={`clip-blob ${className || ''}`} viewBox="0 0 200 200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M160 88c18 22 28 48 16 68-14 22-48 28-78 26-32-2-66-12-74-38-8-28 16-52 28-76C64 40 88 12 118 16c28 4 28 46 42 72Z"
      />
    </svg>
  );
}

/** Decorative layer for a section. Children are clips/blobs. */
export function ClipLayer({ className, children }) {
  return (
    <div className={`clip-layer ${className || ''}`} aria-hidden="true">
      {children}
    </div>
  );
}

export default function HomeClips() {
  return (
    <>
      <ClipLayer className="clip-layer--hero">
        <Blob className="clip-blob--hero-l" />
        <Blob className="clip-blob--hero-r" />
        <Clip kind="Mango" className="clip--hero-mango" />
        <Clip kind="Cone" className="clip--hero-cone" />
        <Clip kind="Sprinkles" className="clip--hero-sprinkles" />
        <Clip kind="Heart" className="clip--hero-heart" />
        <Clip kind="Sparkle" className="clip--hero-spark-l" />
      </ClipLayer>
    </>
  );
}

export function SpecialsClips() {
  return (
    <ClipLayer className="clip-layer--specials">
      <Blob className="clip-blob--specials-r" />
      <Clip kind="Sundae" className="clip--specials-sundae" />
      <Clip kind="Popsicle" className="clip--specials-pop" />
      <Clip kind="Sparkle" className="clip--specials-spark" />
    </ClipLayer>
  );
}

export function AboutClips() {
  return (
    <ClipLayer className="clip-layer--about">
      <Blob className="clip-blob--about-l" />
      <Clip kind="Scoop" className="clip--about-scoop" />
      <Clip kind="Mango" className="clip--about-mango" />
      <Clip kind="Heart" className="clip--about-heart" />
    </ClipLayer>
  );
}

export function BottomClips() {
  return (
    <ClipLayer className="clip-layer--bottom">
      <Clip kind="Cone" className="clip--bottom-cone" />
      <Clip kind="Sprinkles" className="clip--bottom-sprinkles" />
      <Clip kind="Sparkle" className="clip--bottom-spark" />
    </ClipLayer>
  );
}

export function FooterClips() {
  return (
    <ClipLayer className="clip-layer--footer">
      <Clip kind="Scoop" className="clip--footer-scoop" />
      <Clip kind="Heart" className="clip--footer-heart" />
    </ClipLayer>
  );
}
