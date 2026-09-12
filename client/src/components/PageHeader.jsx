export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {children && <p className="page-copy">{children}</p>}
    </header>
  );
}
