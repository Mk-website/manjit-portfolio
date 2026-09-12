import { CalendarDays, MapPin } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';
import Reveal from '../components/Reveal.jsx';

const date = (value) =>
  value ? new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(value)) : '';

export default function Experience() {
  const state = useApiData(api.experience.get, []);

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="03 / field record" title="Experience">
        Roles focused on wireless systems, firmware delivery, and hardware-interface debugging.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        <Reveal className="timeline-grid" stagger>
          {state.data.map((role, index) => (
            <article key={role._id} className="timeline-item">
              <span className="timeline-dot" aria-hidden="true" />
              <div className="panel panel-hover timeline-card">
                <div className="timeline-header">
                  <div>
                    <p className="eyebrow" style={{ fontSize: '0.64rem' }}>
                      {String(index + 1).padStart(2, '0')} / {role.isCurrent ? 'Current role' : 'Role history'}
                    </p>
                    <div className="timeline-role">{role.position}</div>
                    <div className="timeline-company">{role.company}</div>
                  </div>
                  {role.isCurrent && <span className="tag">Current</span>}
                </div>

                <div className="timeline-meta">
                  <span>
                    <CalendarDays size={15} />
                    {date(role.startDate)} - {role.isCurrent ? 'Present' : date(role.endDate)}
                  </span>
                  {role.location && (
                    <span>
                      <MapPin size={15} />
                      {role.location}
                    </span>
                  )}
                </div>

                {role.description && <p style={{ marginTop: '1rem' }}>{role.description}</p>}

                {role.responsibilities?.length > 0 && (
                  <ul className="timeline-list">
                    {role.responsibilities.map((item, itemIndex) => (
                      <li key={`${role._id}-${itemIndex}`}>{item}</li>
                    ))}
                  </ul>
                )}

                {role.technologies?.length > 0 && (
                  <div className="skill-badges" style={{ marginTop: '1rem' }}>
                    {role.technologies.map((item) => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}

          {!state.data.length && !state.error && (
            <p className="empty-state">Experience entries will appear here when they are added.</p>
          )}
        </Reveal>
      )}
    </main>
  );
}
