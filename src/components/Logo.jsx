import { Link } from 'react-router-dom';

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label="Melting Mango home">
      <picture>
        <source srcSet="/images/melting-logo.webp" type="image/webp" />
        <img
          className="brand__logo"
          src="/images/melting-logo.png"
          alt=""
          width="70"
          height="70"
          decoding="async"
        />
      </picture>
    </Link>
  );
}
