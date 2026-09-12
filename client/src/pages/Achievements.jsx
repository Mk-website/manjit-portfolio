import { Trophy } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

export default function Achievements() {
  const state = useApiData(api.achievements.get, []);

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="07 / leadership" title="Achievements">
        Responsibilities and accomplishments in embedded firmware work.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        <div className="case-grid">
          {state.data.map((item) => (
            <article className="panel panel-hover case-card" key={item._id}>
              <div className="case-content">
                <div className="edu-head">
                  <Trophy size={22} style={{ color: 'var(--accent)' }} />
                  <span className="eyebrow" style={{ fontSize: '0.62rem' }}>Achievement</span>
                </div>
                <h2 style={{ marginTop: '1rem' }}>{item.title}</h2>
                {item.description && <p className="case-meta">{item.description}</p>}
              </div>
            </article>
          ))}

          {!state.data.length && !state.error && (
            <p className="text-slate-400">Achievements will appear here when they are added.</p>
          )}
        </div>
      )}
    </main>
  );
}
