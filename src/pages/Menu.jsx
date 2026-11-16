import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FlavorCard from '../components/FlavorCard';
import FlavorModal from '../components/FlavorModal';
import Reveal from '../components/Reveal';
import { AVAILABILITY, CONTAINERS, SCOOP_SIZES } from '../data/flavors';
import { useLiveFlavors } from '../hooks/useLiveFlavors';
import { bgImage, images } from '../data/images';
import { usePageTitle } from '../hooks/usePageTitle';

const listOr = (words) => `${words.slice(0, -1).join(', ')} or ${words[words.length - 1]}`;

export default function Menu() {
  usePageTitle(
    'Flavours',
    "Browse Melting Mango’s small-batch flavours — Mango, Chocolate, Pista, Chickoo and Banana Split. Order scoops in a waffle cone, cup or sugar cone."
  );
  const { flavors, status, error } = useLiveFlavors();
  const [params, setParams] = useSearchParams();
  const active = AVAILABILITY.includes(params.get('a')) ? params.get('a') : 'All';
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const setFilter = (a) => setParams(a === 'All' ? {} : { a }, { replace: true });
  const closeModal = useCallback(() => setSelected(null), []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flavors.filter((f) => {
      const inFilter = active === 'All' || f.availability === active;
      const tags = Array.isArray(f.tags) ? f.tags.join(' ') : '';
      const inSearch = !q || `${f.name} ${f.notes || ''} ${tags}`.toLowerCase().includes(q);
      return inFilter && inSearch;
    });
  }, [flavors, active, query]);

  return (
    <>
      <header className="page-head container" style={{ '--head-img': bgImage(images.mangoScoops) }}>
        <span className="eyebrow">The menu</span>
        <h1>Today’s <em className="accent">flavours</em></h1>
        <p>
          Served as {listOr(SCOOP_SIZES.map((s) => s.label.toLowerCase()))} scoops in a{' '}
          {listOr(CONTAINERS.map((c) => c.label.toLowerCase()))}.
        </p>
      </header>

      <section className="section" style={{ paddingTop: 0 }} aria-label="Flavour list">
        <div className="container">
          <div className="menu-tools">
            <div className="chips" role="group" aria-label="Filter by availability">
              {AVAILABILITY.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={a === active}
                  className={`chip ${a === active ? 'active' : ''}`}
                  onClick={() => setFilter(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <label className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input type="search" placeholder="Search mango, nuts, seasonal…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search flavours" />
            </label>
          </div>

          {status === 'loading' ? (
            <div className="empty" role="status">
              <h2>Loading menu…</h2>
              <p>Fetching live scoops from the parlour.</p>
            </div>
          ) : status === 'error' ? (
            <div className="empty" role="alert">
              <h2>Menu unavailable</h2>
              <p>{error || 'Could not reach the restaurant menu API.'}</p>
            </div>
          ) : visible.length ? (
            <div className="flavor-grid">
              {visible.map((f, i) => (
                <Reveal key={f.id} delay={(i % 4) * 70}>
                  <FlavorCard flavor={f} onSelect={setSelected} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty" role="status">
              <h2>No scoops found</h2>
              <p>
                {status === 'empty'
                  ? 'No scoops are published in Restaurant Admin yet.'
                  : 'Try a different search or filter.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {selected && <FlavorModal flavor={selected} onClose={closeModal} />}
    </>
  );
}
