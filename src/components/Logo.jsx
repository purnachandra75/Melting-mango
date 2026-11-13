import { Link } from 'react-router-dom';

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label="Melting Mango home">
      <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M20 34 32 60 44 34Z" fill="#D9C08A" />
        <circle cx="32" cy="24" r="16" fill="#F6C945" />
        <path d="M16 26c2 5 6 4 8 6 1 5 5 6 6 1 3 3 7 2 8-2 3 1 6-1 10-5" fill="#F6C945" />
        <path d="M37 6c4-4 9-3 11 0-4 3-8 3-11 0Z" fill="#7FA35B" />
      </svg>
      <span className="brand__name">
        Melting <span>Mango</span>
      </span>
    </Link>
  );
}
