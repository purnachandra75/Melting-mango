import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Colour at the bottom edge of the page content, so the drip melts out of it. */
function edgeColour() {
  const main = document.querySelector('main');
  if (!main) return null;
  const bottom = main.getBoundingClientRect().bottom;
  let found = null;
  const walk = (el, depth) => {
    if (depth > 6) return;
    for (const c of el.children) {
      const cs = getComputedStyle(c);
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;
      const r = c.getBoundingClientRect();
      if (Math.abs(r.bottom - bottom) > 3 || r.width < window.innerWidth * 0.9) continue;
      const cols = cs.backgroundImage.match(/rgba?\([^)]+\)/g);
      const col = cols ? cols[cols.length - 1] : (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : null);
      if (col) found = col;
      walk(c, depth + 1);
    }
  };
  walk(main, 0);
  return found;
}
import { CONTACT, HOURS, mapsSearchUrl } from '../data/locations';

const SOCIAL = [
  { name: 'Instagram', d: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".8" fill="currentColor" /></> },
  { name: 'Facebook', d: <path d="M14 8h3V4.5h-3a4 4 0 0 0-4 4V11H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1Z" /> },
  { name: 'Pinterest', d: <><circle cx="12" cy="12" r="8.5" /><path d="M10.6 20.2 12.4 13M11 13.6c.4 1.3 1.4 2 2.6 2 2.2 0 3.6-2 3.6-4.6 0-2.8-2.2-4.6-5-4.6-3 0-5 2-5 4.6 0 1.2.5 2.2 1.3 2.6" /></> },
  { name: 'YouTube', d: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" /></> },
];

const EXPLORE = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/menu#flavours', label: 'Our Flavours' },
  { to: '/story', label: 'About Us' },
  { to: '/#gallery', label: 'Gallery' },
];

const Chevron = () => (
  <svg className="mf-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
);
const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>
);
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6.4 6.4l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5l3 2" /></svg>
);

/* Bumpy-bottomed scoop path centred on (cx, cy) with radius r */
export default function Footer() {
  const { pathname } = useLocation();
  const ref = useRef(null);
  useEffect(() => {
    const apply = () => { const c = edgeColour(); if (c && ref.current) ref.current.style.setProperty('--mf-edge', c); };
    const t1 = setTimeout(apply, 60), t2 = setTimeout(apply, 800);
    window.addEventListener('resize', apply);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', apply); };
  }, [pathname]);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const year = new Date().getFullYear();
  const mapsUrl = mapsSearchUrl(CONTACT.address);

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email.'); return; }
    setError(''); setDone(true); setEmail('');
  };

  return (
    <footer className="mf" ref={ref}>
      {/* melting-cream drips along the top edge */}
      <svg className="mf-drip" viewBox="0 0 1440 110" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <path className="mf-drip__band" d="M0 0H1440V20 Q1400 23 1360 20 Q1320 19 1280 20 Q1240 23 1200 20 Q1160 19 1120 20 Q1080 23 1040 20 Q1000 19 960 20 Q920 23 880 20 Q840 19 800 20 Q760 23 720 20 Q680 19 640 20 Q600 23 560 20 Q520 19 480 20 Q440 23 400 20 Q360 19 320 20 Q280 23 240 20 Q200 19 160 20 Q120 23 80 20 Q40 19 0 20Z" />
        <g className="mf-d" style={{ "--d": "-3.65s", "--t": "7.4s" }}><path className="mf-d__sh" d="M-2.9 16C7.8 16 6.6 31.8 6.6 50.9A8.4 8.4 0 0 0 23.3 50.9C23.3 31.8 22.1 16 32.8 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M-2.9 16C7.8 16 6.6 31.8 6.6 50.9A8.4 8.4 0 0 0 23.3 50.9C23.3 31.8 22.1 16 32.8 16Z" /><ellipse className="mf-d__hl" cx="11.8" cy="50.1" rx="2.2" ry="4" /></g>
        <g className="mf-d" style={{ "--d": "-3.74s", "--t": "6.1s" }}><path className="mf-d__sh" d="M64.3 16C73.6 16 71.4 45.6 71.4 97.1A8.4 8.4 0 0 0 88.3 97.1C88.3 45.6 86.1 16 95.4 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M64.3 16C73.6 16 71.4 45.6 71.4 97.1A8.4 8.4 0 0 0 88.3 97.1C88.3 45.6 86.1 16 95.4 16Z" /><ellipse className="mf-d__hl" cx="76.7" cy="96.2" rx="2.2" ry="4" /></g>
        <g className="mf-d" style={{ "--d": "-1.02s", "--t": "6.7s" }}><path className="mf-d__sh" d="M129.7 16C137.3 28 173.1 28 180.8 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M129.7 16C137.3 28 173.1 28 180.8 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-5.56s", "--t": "6.7s" }}><path className="mf-d__sh" d="M231.3 16C238.4 34.4 271.2 34.4 278.3 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M231.3 16C238.4 34.4 271.2 34.4 278.3 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-3.58s", "--t": "6.6s" }}><path className="mf-d__sh" d="M300.8 16C310.1 36 353.6 36 363 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M300.8 16C310.1 36 353.6 36 363 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-0.62s", "--t": "5.7s" }}><path className="mf-d__sh" d="M440.9 16C450.9 16 450 27.4 450 37.3A7.5 7.5 0 0 0 465 37.3C465 27.4 464.2 16 474.2 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M440.9 16C450.9 16 450 27.4 450 37.3A7.5 7.5 0 0 0 465 37.3C465 27.4 464.2 16 474.2 16Z" /><ellipse className="mf-d__hl" cx="454.7" cy="36.6" rx="1.9" ry="3.6" /></g>
        <g className="mf-d" style={{ "--d": "-4.88s", "--t": "8.2s" }}><path className="mf-d__sh" d="M509.1 16C516.8 35.6 552.5 35.6 560.2 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M509.1 16C516.8 35.6 552.5 35.6 560.2 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-2.25s", "--t": "7.9s" }}><path className="mf-d__sh" d="M594.1 16C604.7 16 602.3 38.7 602.3 72.7A9.5 9.5 0 0 0 621.3 72.7C621.3 38.7 618.8 16 629.4 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M594.1 16C604.7 16 602.3 38.7 602.3 72.7A9.5 9.5 0 0 0 621.3 72.7C621.3 38.7 618.8 16 629.4 16Z" /><ellipse className="mf-d__hl" cx="608.2" cy="71.8" rx="2.5" ry="4.6" /></g>
        <g className="mf-d" style={{ "--d": "-4.06s", "--t": "8.6s" }}><path className="mf-d__sh" d="M670.7 16C681.5 16 680.7 29.7 680.7 44.3A7.9 7.9 0 0 0 696.6 44.3C696.6 29.7 695.8 16 706.5 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M670.7 16C681.5 16 680.7 29.7 680.7 44.3A7.9 7.9 0 0 0 696.6 44.3C696.6 29.7 695.8 16 706.5 16Z" /><ellipse className="mf-d__hl" cx="685.6" cy="43.5" rx="2.1" ry="3.8" /></g>
        <g className="mf-d" style={{ "--d": "-5.75s", "--t": "6.9s" }}><path className="mf-d__sh" d="M728.6 16C735.6 34.9 768.6 34.9 775.6 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M728.6 16C735.6 34.9 768.6 34.9 775.6 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-5.93s", "--t": "8.9s" }}><path className="mf-d__sh" d="M824.3 16C834.3 35.8 881.1 35.8 891.1 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M824.3 16C834.3 35.8 881.1 35.8 891.1 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-3.54s", "--t": "8.6s" }}><path className="mf-d__sh" d="M965.1 16C975.1 16 972.8 43.3 972.8 88.8A9 9 0 0 0 990.8 88.8C990.8 43.3 988.4 16 998.4 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M965.1 16C975.1 16 972.8 43.3 972.8 88.8A9 9 0 0 0 990.8 88.8C990.8 43.3 988.4 16 998.4 16Z" /><ellipse className="mf-d__hl" cx="978.4" cy="87.9" rx="2.3" ry="4.3" /></g>
        <g className="mf-d" style={{ "--d": "-2.95s", "--t": "6.8s" }}><path className="mf-d__sh" d="M1023.8 16C1033.2 16 1031 33.2 1031 55.4A8.4 8.4 0 0 0 1047.9 55.4C1047.9 33.2 1045.7 16 1055.1 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M1023.8 16C1033.2 16 1031 33.2 1031 55.4A8.4 8.4 0 0 0 1047.9 55.4C1047.9 33.2 1045.7 16 1055.1 16Z" /><ellipse className="mf-d__hl" cx="1036.2" cy="54.6" rx="2.2" ry="4" /></g>
        <g className="mf-d" style={{ "--d": "-1.48s", "--t": "8.6s" }}><path className="mf-d__sh" d="M1121.8 16C1130.7 16 1128.7 41.6 1128.7 83.9A8 8 0 0 0 1144.7 83.9C1144.7 41.6 1142.6 16 1151.5 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M1121.8 16C1130.7 16 1128.7 41.6 1128.7 83.9A8 8 0 0 0 1144.7 83.9C1144.7 41.6 1142.6 16 1151.5 16Z" /><ellipse className="mf-d__hl" cx="1133.6" cy="83.1" rx="2.1" ry="3.8" /></g>
        <g className="mf-d" style={{ "--d": "-0.97s", "--t": "5.7s" }}><path className="mf-d__sh" d="M1190.7 16C1201 16 1198.9 34.4 1198.9 59A8.9 8.9 0 0 0 1216.7 59C1216.7 34.4 1214.6 16 1224.9 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M1190.7 16C1201 16 1198.9 34.4 1198.9 59A8.9 8.9 0 0 0 1216.7 59C1216.7 34.4 1214.6 16 1224.9 16Z" /><ellipse className="mf-d__hl" cx="1204.4" cy="58.1" rx="2.3" ry="4.3" /></g>
        <g className="mf-d" style={{ "--d": "-4.83s", "--t": "8.2s" }}><path className="mf-d__sh" d="M1226.5 16C1236.9 33.7 1285.8 33.7 1296.3 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M1226.5 16C1236.9 33.7 1285.8 33.7 1296.3 16Z" /></g>
        <g className="mf-d" style={{ "--d": "-2.9s", "--t": "8.4s" }}><path className="mf-d__sh" d="M1355 16C1367 16 1366.7 31.2 1366.7 49A8.2 8.2 0 0 0 1383.2 49C1383.2 31.2 1382.9 16 1394.9 16Z" transform="translate(1.5 3)" /><path className="mf-d__p" d="M1355 16C1367 16 1366.7 31.2 1366.7 49A8.2 8.2 0 0 0 1383.2 49C1383.2 31.2 1382.9 16 1394.9 16Z" /><ellipse className="mf-d__hl" cx="1371.8" cy="48.2" rx="2.1" ry="4" /></g>
        <circle className="mf-fall" cx="79.8" cy="107.1" r="5.2" style={{ "--d": "-0.5s", "--t": "9.0s" }} />
        <circle className="mf-fall" cx="981.8" cy="99.5" r="5.6" style={{ "--d": "-2.6s", "--t": "9.7s" }} />
        <circle className="mf-fall" cx="1136.7" cy="93.5" r="5" style={{ "--d": "-1.5s", "--t": "8.3s" }} />
        <circle className="mf-fall" cx="611.8" cy="84.2" r="5.9" style={{ "--d": "-3.0s", "--t": "11.6s" }} />
        <circle className="mf-fall" cx="1207.8" cy="69.7" r="5.5" style={{ "--d": "-8.9s", "--t": "11.0s" }} />
        <circle className="mf-fall" cx="1039.4" cy="65.5" r="5.2" style={{ "--d": "-4.3s", "--t": "9.0s" }} />
      </svg>

      <div className="container mf-top">
        <div className="mf-col mf-brand">
          <Link to="/" className="mf-logo" aria-label="Melting Mango home">
            <picture>
              <source srcSet="/images/melting-logo.webp" type="image/webp" />
              <img src="/images/melting-logo.png" alt="" width="120" height="120" decoding="async" />
            </picture>
          </Link>
          <p>Pure Ice Cream. Real Ingredients.<br />Handcrafted Daily.</p>
          <ul className="mf-social">
            {SOCIAL.map((s) => (
              <li key={s.name}>
                <span className="mf-soc" title={`${s.name} - coming soon`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">{s.d}</svg>
                  <span className="sr-only">{s.name} (coming soon)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mf-col">
          <h2 className="mf-h">Explore</h2>
          <ul className="mf-links">
            {EXPLORE.map((l) => <li key={l.label}><Link to={l.to}><Chevron />{l.label}</Link></li>)}
          </ul>
        </div>

        <div className="mf-col">
          <h2 className="mf-h">Support</h2>
          <ul className="mf-links">
            <li><a href="mailto:hello@meltingmango.in"><Chevron />Contact Us</a></li>
            <li><Link to="/visit"><Chevron />FAQs</Link></li>
            <li><Link to="/visit"><Chevron />Privacy Policy</Link></li>
            <li><Link to="/visit"><Chevron />Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div className="mf-col mf-visit">
          <h2 className="mf-h">Visit Us</h2>
          <ul>
            <li>
              <span className="mf-ic" aria-hidden="true"><IconPin /></span>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <span>{CONTACT.streetLine}</span>
                <span>{CONTACT.localityLine}</span>
              </a>
            </li>
            <li>
              <span className="mf-ic" aria-hidden="true"><IconPhone /></span>
              <a href={CONTACT.phoneTel}>{CONTACT.phone}</a>
            </li>
            <li>
              <span className="mf-ic" aria-hidden="true"><IconClock /></span>
              <span>
                <span>Mon - Thu {HOURS.weekday.label}</span>
                <span>Fri - Sun {HOURS.weekend.label}</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="mf-col mf-sub">
          <h2 className="mf-h">Stay in the Loop</h2>
          <p>Get updates on new flavours, seasonal specials, and more.</p>
          {done ? (
            <p className="mf-thanks" role="status">Thank you - we will be in touch when we have something sweet to share.</p>
          ) : (
            <form className="mf-form" onSubmit={subscribe} noValidate>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                aria-invalid={error ? 'true' : 'false'}
                autoComplete="email"
              />
              <button type="submit" aria-label="Subscribe">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              {error && <span className="mf-err" role="alert">{error}</span>}
            </form>
          )}
        </div>
      </div>

      <div className="mf-waffle" aria-hidden="true" />
      <img className="mf-scoops" src="/images/Pause GIF image.gif" alt="" width="958" height="829" loading="lazy" decoding="async" />

      <div className="mf-bar">
        <svg className="mf-bar__wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="mf-bar-g" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#D9650F" /><stop offset="1" stopColor="#C2540A" />
            </linearGradient>
          </defs>
          <path d="M0 40C200 64 420 64 600 34C660 24 690 4 720 4C750 4 780 24 840 34C1020 64 1240 64 1440 40V70H0Z" fill="url(#mf-bar-g)" />
        </svg>
        <span className="mf-bar__cone" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" shapeRendering="geometricPrecision">
            <path d="M7.6 11h8.8L12 21.6Z" fill="#FFE2B0" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9.6 13.6l3.8 3.6M14.4 13.4l-4 4.6" stroke="#E08A2E" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M7 11.2a5 5 0 0 1 10 0Z" fill="#fff" />
            <circle cx="12" cy="5.4" r="1.3" fill="#fff" />
          </svg>
        </span>
        <div className="mf-bar__in">
          <span className="mf-bar__line" aria-hidden="true" />
          <span>{'\u00A9'} {year} Melting Mango Creamery. All rights reserved.</span>
          <span className="mf-bar__line" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
