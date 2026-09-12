import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const { data: resume } = useApiData(api.resume.get, null);

  const links = [
    { to: '/home', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/skills', label: 'Skills' },
    { to: '/experience', label: 'Experience' },
    { to: '/projects', label: 'Projects' },
    { to: '/education', label: 'Education' },
    { to: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    let lastScroll = window.scrollY;

    const updateNavState = () => {
      const currentScroll = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;

      setProgress(Math.min(Math.max(nextProgress, 0), 100));
      setScrolled(currentScroll > 20);
      setVisible(currentScroll < 80 || currentScroll < lastScroll);
      lastScroll = currentScroll;
    };

    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
    return () => window.removeEventListener('scroll', updateNavState);
  }, []);

  const isActive = (to) =>
    location.pathname === to || (to === '/home' && location.pathname === '/');

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${visible ? 'site-header-visible' : 'site-header-hidden'} ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="nav-shell">
        <Link to="/" className="brand" aria-label="Go to home page">
          <span className="brand-badge">MK</span>
          <span className="brand-text">Manjit Kumar</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions desktop-actions">
          {resume?.fileUrl && (
            <a href={resume.fileUrl} download className="btn btn-secondary btn-sm">
              <Download size={15} />
              Resume
            </a>
          )}
          <Link to="/contact" className="btn btn-primary btn-sm">
            Contact me
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="icon-button"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button
          type="button"
          className="icon-button mobile-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={close}
                className={`mobile-link ${isActive(link.to) ? 'mobile-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-actions">
            <Link to="/contact" onClick={close} className="btn btn-primary mobile-cta">
              Contact me
            </Link>
            <button type="button" onClick={toggle} className="btn btn-secondary" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <p>Manjit Kumar · Embedded Firmware Engineer</p>
          <p className="footer-mark">MERN PORTFOLIO / 2026</p>
        </div>
      </footer>
    </div>
  );
}
