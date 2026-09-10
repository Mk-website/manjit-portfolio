export default function ApiNotice({ error, retry, loading = false }) {
  if (loading) return <div className="skeleton" aria-label="Loading content" />;
  if (!error) return null;
  return <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-amber-900 bg-amber-950/35 p-4 text-sm text-amber-100" role="alert"><span>{error}</span><button onClick={retry} className="btn-secondary">Retry</button></div>;
}
