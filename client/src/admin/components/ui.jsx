export function PageShell({ eyebrow, title, description, actions, children }) {
  return (
    <section>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-slate-400">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Alert({ type = 'error', children }) {
  const styles = type === 'success'
    ? 'border-emerald-900 bg-emerald-950/30 text-emerald-200'
    : type === 'warning'
      ? 'border-amber-900 bg-amber-950/30 text-amber-200'
      : 'border-red-900 bg-red-950/30 text-red-200';
  return <p className={`border p-4 text-sm ${styles}`}>{children}</p>;
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-secondary border-red-800 text-red-300 hover:bg-red-950' : 'btn-secondary';
  return (
    <button {...props} className={`${base} disabled:opacity-60 ${className}`}>
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
      <input
        {...props}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </label>
  );
}

export function Textarea({ label, rows = 4, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
      <textarea
        rows={rows}
        {...props}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
      <select
        {...props}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {children}
      </select>
    </label>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-200">
      <input type="checkbox" {...props} className="rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500" />
      {label}
    </label>
  );
}

export function EmptyState({ title = 'No items yet', description }) {
  return (
    <div className="panel p-8 text-center text-slate-400">
      <p className="font-medium text-slate-300">{title}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
    </div>
  );
}

export function LoadingState() {
  return <div className="panel p-8 text-center text-slate-400">Loading...</div>;
}

export function parseList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function joinList(value) {
  return Array.isArray(value) ? value.join(', ') : '';
}