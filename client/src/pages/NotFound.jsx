import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page-wrap" style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
      <div className="panel" style={{ maxWidth: '30rem', padding: '2rem', textAlign: 'center' }}>
        <p className="eyebrow">404</p>
        <h1 style={{ marginTop: '1rem', fontSize: '3rem', letterSpacing: '-0.07em' }}>Page not found</h1>
        <p style={{ marginTop: '0.8rem', color: 'var(--text-muted)' }}>The route you requested does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.2rem' }}>
          Go home
        </Link>
      </div>
    </main>
  );
}
