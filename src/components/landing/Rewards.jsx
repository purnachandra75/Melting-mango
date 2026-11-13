import Reveal from '../Reveal';
import { REWARDS, REWARD_RULES, flavors } from '../../data/flavors';

function FoundingVisual() {
  return (
    <div className="reward__visual reward__visual--founding">
      <span className="reward__big">50</span>
      <span className="reward__sub">guests · 12 weeks of free scoops</span>
    </div>
  );
}

function PassportVisual({ stamps }) {
  return (
    <div className="reward__visual">
      <div className="stamps">
        {Array.from({ length: stamps }, (_, i) => {
          const last = i === stamps - 1;
          const color = flavors[i % flavors.length].color;
          return (
            <span key={i} className={`stamp ${last ? 'stamp--free' : ''}`} style={{ '--i': i, '--c': color }}>
              {last ? 'FREE' : i + 1}
            </span>
          );
        })}
      </div>
      <span className="reward__sub">6 distinct flavours → 1 free scoop</span>
    </div>
  );
}

function PointsVisual() {
  return (
    <div className="reward__visual">
      <div className="meter" role="img" aria-label="Points balance filling up">
        <span className="meter__fill" />
      </div>
      <div className="meter__labels">
        <span>Visit</span>
        <span>Earn</span>
        <span>Redeem</span>
      </div>
    </div>
  );
}

export default function Rewards() {
  return (
    <div className="rewards">
      {REWARDS.map((r, i) => (
        <Reveal as="article" className={`reward ${r.ribbon ? 'reward--featured' : ''}`} key={r.id} delay={i * 120}>
          {r.ribbon && <span className="reward__ribbon">{r.ribbon}</span>}
          <span className="reward__numeral">{r.numeral}</span>
          <h3>{r.name}</h3>
          <p className="reward__tagline">{r.tagline}</p>

          {r.id === 'founding-50' && <FoundingVisual />}
          {r.id === 'flavor-passport' && <PassportVisual stamps={r.stamps} />}
          {r.id === 'mango-points' && <PointsVisual />}

          <p className="reward__highlight">{r.highlight}</p>

          <dl className="reward__rules">
            {REWARD_RULES.map((rule) => (
              <div key={rule}>
                <dt>{rule}</dt>
                <dd>{r.rules[rule]}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  );
}
