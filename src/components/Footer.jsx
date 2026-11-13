import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__big" aria-hidden="true">
        Melting Mango
      </div>
      <div className="container footer__content">
        <div className="footer__top">
          <div>
            <Logo />
            <p>Small-batch, slow-churned ice cream made every morning with ripe fruit, real cream and nothing artificial.</p>
          </div>
          <div>
            <h2 className="footer__heading">Explore</h2>
            <ul>
              <li><Link to="/menu">Flavours</Link></li>
              <li><Link to="/#rewards">Rewards Club</Link></li>
              <li><Link to="/story">Our Story</Link></li>
              <li><Link to="/visit">Parlours</Link></li>
              <li><Link to="/visit#events">Private events</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">Visit</h2>
            <ul>
              <li>Jubilee Hills, Hyderabad</li>
              <li>Indiranagar, Bengaluru</li>
              <li>Bandra West, Mumbai</li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">Say hello</h2>
            <ul>
              <li><a href="mailto:hello@meltingmango.in">hello@meltingmango.in</a></li>
              <li><a href="tel:+914000000000">+91 40 0000 0000</a></li>
              <li>Instagram · @meltingmango</li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Melting Mango Creamery. All rights reserved.</span>
          <span>
            Photography via <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a> · Made slowly, with love &amp; cream.
          </span>
        </div>
      </div>
    </footer>
  );
}
