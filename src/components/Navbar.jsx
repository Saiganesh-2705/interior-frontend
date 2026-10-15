import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/portfolio', 'Portfolio'],
  ['/visualizer', 'Room designer'], ['/estimator', 'Cost estimator'], ['/contact', 'Contact']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const close = () => setOpen(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={scrolled ? 'nav scrolled' : 'nav'}>
      <div className="wrap nav-in">
        <Link to="/" className="brand" onClick={close}>Luxe <em>Interiors</em></Link>
        <button className="nav-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="menu" className={open ? 'menu open' : 'menu'}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}>{label}</NavLink>
          ))}
          {user?.role === 'admin' && <NavLink to="/admin" onClick={close}>Admin</NavLink>}
          {user ? <button className="link-btn" onClick={() => { logout(); close(); nav('/'); }}>Sign out</button> : null}
          <Link to="/contact" className="btn btn-sm" onClick={close}>Book a consultation</Link>
        </nav>
      </div>
    </header>
  );
}
