import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const { data: profile } = useApiData(api.profile.get, fallbackProfile);
  const { data: resume } = useApiData(api.resume.get, null);
  const { data: settings } = useApiData(api.settings.get, { siteTitle: '', footerText: '', socials: {} });

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
  const currentProfile = profile || fallbackProfile;
  const resumeUrl = resume?.fileUrl || currentProfile.resumeUrl;

  return (
    <header className={`site-header ${visible ? 'site-header-visible' : 'site-header-hidden'} ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="nav-shell">
        <Link to="/" className="brand" aria-label="Go to home page">
          <span className="brand-badge">{(settings?.logoText || currentProfile.name || 'MK').slice(0, 2).toUpperCase()}</span>
          <span className="brand-text">{settings?.siteTitle ? settings.siteTitle.split('|')[0].trim() : currentProfile.name}</span>
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
          {resumeUrl && (
            <a href={resumeUrl} download className="btn btn-secondary btn-sm">
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
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const { data: profile } = useApiData(api.profile.get, fallbackProfile);
  const { data: settings } = useApiData(api.settings.get, { siteTitle: '', metaDescription: '', footerText: '', socials: {} });

  useEffect(() => {
    const siteTitle = settings?.siteTitle || `${profile?.name || 'Manjit Kumar'} | ${profile?.title || 'Embedded Firmware Engineer'}`;
    const metaDescription = settings?.metaDescription || (profile?.summary || 'Embedded firmware engineer portfolio');
    const socialTitle = settings?.ogTitle || siteTitle;
    const socialDescription = settings?.ogDescription || metaDescription;
    const canonicalBase = (settings?.canonicalUrl || window.location.origin).replace(/\/$/, '');
    const canonicalUrl = `${canonicalBase}${location.pathname === '/' ? '' : location.pathname}`;

    document.title = siteTitle;
    const setMeta = (selector, attribute, content) => {
      const meta = document.querySelector(selector);
      if (meta) meta.setAttribute(attribute, content);
    };

    setMeta('meta[name="description"]', 'content', metaDescription);
    setMeta('meta[property="og:title"]', 'content', socialTitle);
    setMeta('meta[property="og:description"]', 'content', socialDescription);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'content', socialTitle);
    setMeta('meta[name="twitter:description"]', 'content', socialDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [location.pathname, profile, settings]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 640px)');
    if (reduceMotion.matches || mobile.matches) return undefined;

    const updateGrid = (event) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 8;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 8;
      document.documentElement.style.setProperty('--grid-x', `${x}px`);
      document.documentElement.style.setProperty('--grid-y', `${y}px`);
    };

    window.addEventListener('pointermove', updateGrid, { passive: true });
    return () => window.removeEventListener('pointermove', updateGrid);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main key={location.pathname} className="page-main route-transition">
        {ready ? <Outlet /> : <PageSkeleton />}
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">{profile?.name || 'Manjit Kumar'} · {profile?.title || 'Embedded Firmware Engineer'}</p>
            {(settings?.footerText || profile?.summary) && <p className="footer-text">{settings?.footerText || profile?.summary}</p>}
          </div>
          <div className="footer-links">
            {(settings?.socials?.github || profile?.socials?.github || profile?.github) && (
              <a href={settings?.socials?.github || profile?.socials?.github || profile?.github} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {(settings?.socials?.linkedin || profile?.socials?.linkedin || profile?.linkedin) && (
              <a href={settings?.socials?.linkedin || profile?.socials?.linkedin || profile?.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
            {(settings?.socials?.email || profile?.socials?.email || profile?.email) && (
              <a href={`mailto:${settings?.socials?.email || profile?.socials?.email || profile?.email}`}>Email</a>
            )}
          </div>
          <p className="footer-mark">MERN PORTFOLIO / 2026</p>
        </div>
      </footer>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="skeleton-page" aria-label="Loading portfolio">
      <div className="skeleton-block" style={{ width: '7rem', height: '0.8rem' }} />
      <div className="skeleton-block" style={{ width: 'min(26rem, 80%)', height: '4rem', marginTop: '1rem' }} />
      <div className="skeleton-block" style={{ width: 'min(38rem, 100%)', height: '1.2rem', marginTop: '1.2rem' }} />
      <div className="skeleton-block" style={{ width: '100%', height: '18rem', marginTop: '3rem' }} />
    </div>
  );
}
