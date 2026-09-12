import { useEffect, useState } from 'react';
import { Code2, ExternalLink, X } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';
import { ProjectVisual } from '../components/TechnicalVisual.jsx';

export default function Projects() {
  const state = useApiData(api.projects.get, []);
  const [selected, setSelected] = useState(null);
  const projects = [...state.data].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  useEffect(() => {
    const close = (event) => event.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="04 / selected work" title="Projects">
        Embedded systems and IoT work, shown with their actual scope and available project details.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        <div className="case-grid">
          {projects.map((project) => (
            <article key={project._id} className="panel panel-hover case-card">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.name} className="aspect-video w-full object-cover" />
              ) : (
                <div className="case-visual tech-grid">
                  <ProjectVisual project={project} />
                </div>
              )}

              <div className="case-content">
                <div className="case-header">
                  <h2>{project.name}</h2>
                  {project.featured && <span className="tag">Featured</span>}
                </div>
                <p className="case-meta">{project.shortDesc}</p>

                <div className="case-tags">
                  {project.technologies?.map((item) => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>

                <div className="case-actions">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelected(project)}>
                    Details
                  </button>
                  {project.githubUrl && (
                    <a className="btn btn-secondary btn-sm" href={project.githubUrl} target="_blank" rel="noreferrer">
                      <Code2 size={15} />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a className="btn btn-secondary btn-sm" href={project.liveUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={15} />
                      Live demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}

          {!projects.length && !state.error && (
            <p className="text-slate-400">Projects will appear here when they are added.</p>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="project-title">
          <div className="panel modal-card">
            <div className="modal-top">
              <div>
                <p className="eyebrow">Project details</p>
                <h2 id="project-title">{selected.name}</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setSelected(null)}
                aria-label="Close project details"
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-copy">{selected.fullDesc || selected.shortDesc}</p>
            <div className="skill-badges" style={{ marginTop: '1rem' }}>
              {selected.technologies?.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
