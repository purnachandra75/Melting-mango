import { Link } from 'react-router-dom';
import Scoop from '../components/Scoop';
import Reveal from '../components/Reveal';
import { bgImage, images } from '../data/images';
import { usePageTitle } from '../hooks/usePageTitle';

const TIMELINE = [
  { year: '2016', title: 'A cart in Jubilee Hills', text: 'One hand-crank churn, three flavours and a queue that went around the block.' },
  { year: '2018', title: 'The first parlour', text: 'Our flagship opens with a glass-walled kitchen so guests can watch every batch.' },
  { year: '2021', title: 'Farm partnerships', text: 'Direct sourcing from 14 growers — fair prices for them, ripe fruit for you.' },
  { year: '2024', title: 'Three cities', text: 'Bengaluru and Mumbai join the family, each with its own city-exclusive flavour.' },
];

const VALUES = [
  { icon: '🥭', title: 'Ripe, not rushed', text: 'Fruit is bought at peak ripeness and pulped the same day. If it isn’t ready, neither are we.' },
  { icon: '🌿', title: 'Nothing artificial', text: 'No synthetic colours, flavourings or premixes. Our yellow comes from mangoes and saffron.' },
  { icon: '♻️', title: 'Kind packaging', text: 'Compostable cups, paper spoons and glass pint jars you can return for a discount.' },
];

export default function Story() {
  usePageTitle(
    'Our Story',
    'How Melting Mango grew from a grandmother’s kitchen in Jubilee Hills to artisan parlours in Hyderabad, Bengaluru and Mumbai.'
  );

  return (
    <>
      <header className="page-head container" style={{ '--head-img': bgImage(images.conesFlatlay) }}>
        <span className="eyebrow">Our story</span>
        <h1>It started with <em className="accent">one mango</em></h1>
        <p>A family recipe, a borrowed churn and a stubborn belief that ice cream should taste of what it’s made from.</p>
      </header>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container split">
          <Reveal className="story-art">
            <Scoop scoops={['#F6B93B', '#F9D56E']} vessel="cone" topping="leaf" size={260} title="A two-scoop mango cone" />
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">The beginning</span>
            <h2>From a grandmother’s kitchen to <em className="accent">three cities</em></h2>
            <p>
              Every summer, our founder’s grandmother would turn the season’s best Alphonsos into a hand-churned ice cream so
              smooth it disappeared before it could melt. Melting Mango began as an attempt to bottle that feeling.
            </p>
            <p>
              Ten years on we still churn in small batches, still hand-pulp every mango, and still taste every tray before the
              doors open. The parlours have grown — the process hasn’t.
            </p>
            <Link to="/menu" className="btn btn--primary" style={{ marginTop: 12 }}>Taste the result</Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">Milestones</span>
              <h2>A decade of <em className="accent">scoops</em></h2>
            </div>
          </Reveal>
          <ol className="timeline">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" className="timeline__item" key={t.year} delay={i * 100}>
                <div className="timeline__year">{t.year}</div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <span className="eyebrow">What we believe</span>
              <h2>Three things we <em className="accent">never</em> compromise</h2>
            </div>
          </Reveal>
          <div className="values">
            {VALUES.map((v, i) => (
              <Reveal as="article" className="value" key={v.title} delay={i * 100}>
                <div className="value__icon" aria-hidden="true">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
