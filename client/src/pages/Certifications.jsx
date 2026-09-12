import { BadgeCheck, ExternalLink } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

export default function Certifications() {
  const state = useApiData(api.certifications.get, []);

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="06 / credentials" title="Certifications">
        Professional certifications and credentials.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        state.data.length ? (
          <div className="cert-grid">
            {state.data.map((item) => (
              <article className="panel panel-hover cert-card" key={item._id}>
                <div className="cert-head">
                  <BadgeCheck size={22} style={{ color: 'var(--accent)' }} />
                  <span className="eyebrow" style={{ fontSize: '0.62rem' }}>Credential</span>
                </div>
                <h2>{item.name}</h2>
                <p>{item.issuer}</p>
                {item.issueDate && (
                  <p className="edu-year">
                    {new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(item.issueDate))}
                  </p>
                )}
                {item.credentialId && <p style={{ marginTop: '0.9rem', fontFamily: 'SFMono-Regular, monospace', fontSize: '0.76rem' }}>ID: {item.credentialId}</p>}
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="social-link" style={{ marginTop: '1.1rem' }}>
                    View credential <ExternalLink size={15} />
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : !state.error ? (
          <div className="panel tech-grid" style={{ marginTop: '1.5rem', padding: '2rem 1.5rem', textAlign: 'center' }}>
            <BadgeCheck size={26} style={{ margin: '0 auto', color: 'var(--text-muted)' }} />
            <p style={{ marginTop: '1rem', fontSize: '1.05rem', color: 'var(--text-soft)' }}>
              Certifications will be added as they are completed.
            </p>
          </div>
        ) : null
      )}
    </main>
  );
}
