import { Link } from 'react-router-dom';
import Scoop from '../components/Scoop';

export default function NotFound() {
  return (
    <section className="page-head container" style={{ paddingBottom: 120 }}>
      <div style={{ display: 'grid', placeItems: 'center', marginBottom: 20 }}>
        <Scoop scoops={['#ECECEE']} size={140} />
      </div>
      <span className="eyebrow">404</span>
      <h1>This scoop <em className="accent">melted</em></h1>
      <p style={{ marginBottom: 32 }}>The page you’re looking for doesn’t exist — but our flavours do.</p>
      <Link to="/" className="btn btn--primary">Back home</Link>
    </section>
  );
}
