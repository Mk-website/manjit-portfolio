import { GraduationCap } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Education() {
  const state = useApiData(api.education.get, []);

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="05 / academic record" title="Education">
        Academic foundation supporting a hands-on embedded engineering path.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        <Reveal className="edu-grid" stagger>
          {state.data.map((item) => (
            <article className="panel panel-hover edu-card" key={item._id}>
              <div className="edu-head">
                <GraduationCap size={22} style={{ color: 'var(--accent)' }} />
                <span className="eyebrow" style={{ fontSize: '0.62rem' }}>
                  {item.startYear} - {item.endYear}
                </span>
              </div>
              <h2>{item.degree}</h2>
              <p>{item.institution}</p>
              {item.grade && <p className="edu-year">{item.grade}</p>}
              {item.description && <p>{item.description}</p>}
            </article>
          ))}

          {!state.data.length && !state.error && (
            <p className="empty-state">Education entries will appear here when they are added.</p>
          )}
        </Reveal>
      )}
    </main>
  );
}
