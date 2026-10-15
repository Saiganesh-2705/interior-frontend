import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div>
          <p className="brand">Luxe <em>Interiors</em></p>
          <p className="muted-on-dark">Interior design and turnkey execution for homes, kitchens and workplaces.</p>
        </div>
        <div>
          <h4>Studio</h4>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Visit or call</h4>
          <ul>
            <li>12 Gandhi Road, Chennai, Tamil Nadu</li>
            <li>Mon-Sat, 10:00 AM - 7:00 PM</li>
            <li><a href="tel:+919876543210">+91 98765 43210</a></li>
            <li><a href="mailto:hello@luxeinteriors.com">hello@luxeinteriors.com</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap foot-base">
        <span>&copy; {new Date().getFullYear()} Luxe Interiors</span>
        <Link to="/login">Admin sign in</Link>
      </div>
    </footer>
  );
}
