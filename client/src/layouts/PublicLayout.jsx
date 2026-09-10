import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';

function Navbar() {
  const [open, setOpen] = useState(false);
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
    { to: '/contact', label: 'Contact' }
  ];
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-[min(1120px,calc(100%-2rem))] items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-slate-100"><span className="grid h-8 w-8 place-items-center border border-cyan-700 bg-cyan-950 font-mono text-xs text-cyan-200">MK</span><span className="hidden sm:block">Manjit Kumar</span></Link>
          <nav className="hidden items-center gap-5 lg:flex">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`text-sm ${location.pathname === l.to || (l.to === '/home' && location.pathname === '/') ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-100'}`}>{l.label}</Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {resume?.fileUrl && <a href={resume.fileUrl} download className="btn-secondary"><Download size={15} />Resume</a>}
            <Link to="/contact" className="btn-primary">Contact me</Link>
            <button onClick={toggle} className="grid h-9 w-9 place-items-center border border-slate-700 text-slate-300 hover:bg-slate-900" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <button className="grid h-9 w-9 place-items-center border border-slate-700 text-slate-200 md:hidden" onClick={() => setOpen(o => !o)} aria-label="Toggle navigation menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      {open && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <nav className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col gap-1 py-3">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={close} className="px-2 py-2 text-sm text-slate-300 hover:bg-slate-900">{l.label}</Link>
            ))}
            <div className="mt-2 flex gap-2"><Link to="/contact" onClick={close} className="btn-primary flex-1">Contact me</Link><button onClick={toggle} className="btn-secondary" aria-label="Toggle theme">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button></div>
          </nav>
        </div>
      )}
    </header>;
}

export default function PublicLayout() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-slate-800 py-7 text-sm text-slate-500">
        <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col gap-2 sm:flex-row sm:justify-between">
          <p>Manjit Kumar · Embedded Firmware Engineer</p><p className="font-mono text-xs">MERN PORTFOLIO / 2026</p>
        </div>
      </footer>
    </div>
  );
}
