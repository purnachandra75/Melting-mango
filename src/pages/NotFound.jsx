import { Link } from 'react-router-dom';
import Scoop from '../components/Scoop';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found', 'This page doesn’t exist. Head back to Melting Mango for artisan ice cream.');

  return (
    <section className="page-head container not-found" aria-labelledby="not-found-title">
      <div className="not-found__art">
        <Scoop scoops={['#ECECEE']} size={140} title="" />
      </div>
      <span className="eyebrow">404</span>
      <h1 id="not-found-title">This scoop <em className="accent">melted</em></h1>
      <p className="not-found__copy">The page you’re looking for doesn’t exist — but our flavours do.</p>
      <Link to="/" className="btn btn--primary">Back home</Link>
    </section>
  );
}
