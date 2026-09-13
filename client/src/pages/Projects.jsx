import { useEffect, useState } from 'react';
import { ArrowUpRight, Code2, ExternalLink, Layers3, X } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';
import { ProjectVisual } from '../components/TechnicalVisual.jsx';
import Reveal from '../components/Reveal.jsx';

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

  const detailSections = [
    { title: 'Overview', content: selected?.fullDesc || selected?.shortDesc },
    { title: 'Problem', content: selected?.problem },
    { title: 'Solution', content: selected?.solution },
    { title: 'Architecture', content: selected?.architecture },
    { title: 'Hardware', content: selected?.hardware },
    { title: 'Firmware', content: selected?.firmware },
    { title: 'Implementation', content: selected?.implementation },
  ].filter((section) => section.content && String(section.content).trim());

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="04 / selected work" title="Projects">
        Embedded systems and IoT work, shown with their actual scope and available project details.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        <Reveal className="case-grid" stagger>
          {projects.map((project, index) => (
            <article key={project._id} className="panel panel-hover case-card case-card-premium">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.name} className="case-image" loading="lazy" decoding="async" />
              ) : (
                <ProjectVisual project={project} index={index} />
              )}

              <div className="case-content">
                <div className="case-header">
                  <div>
                    <p className="case-kicker">{project.category || 'Case study'} / {String(index + 1).padStart(2, '0')}</p>
                    <h2>{project.name}</h2>
                  </div>
                  <span className={`case-status ${project.featured ? 'is-featured' : ''}`}>
                    {project.featured ? 'Featured' : project.status === 'draft' ? 'Draft' : 'Built'}
                  </span>
                </div>
                <p className="case-meta">{project.shortDesc}</p>

                {(project.protocols?.length || project.technologies?.length) && (
                  <div className="case-tags">
                    {(project.protocols || []).slice(0, 3).map((item) => (
                      <span key={item} className="case-tech">{item}</span>
                    ))}
                    {(project.technologies || []).slice(0, 2).map((item) => (
                      <span key={item} className="case-tech">{item}</span>
                    ))}
                  </div>
                )}

                <div className="case-actions">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelected(project)}>
                    Explore project <ArrowUpRight size={15} />
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
            <p className="empty-state">Projects will appear here when they are added.</p>
          )}
        </Reveal>
      )}

      {selected && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="project-title" onClick={() => setSelected(null)}>
          <div className="panel modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-top">
              <div>
                <p className="eyebrow"><Layers3 size={14} /> Project details</p>
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

            <div className="project-modal-summary">
              <span className="tag">{selected.category || 'Embedded Systems'}</span>
              {selected.featured && <span className="tag">Featured</span>}
              {selected.status && <span className="tag">{selected.status}</span>}
            </div>

            <p className="modal-copy">{selected.fullDesc || selected.shortDesc}</p>

            {(selected.protocols?.length || selected.technologies?.length) && (
              <div className="skill-badges" style={{ marginTop: '1rem' }}>
                {[...(selected.protocols || []), ...(selected.technologies || [])].map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            )}

            <div className="project-detail-stack">
              {detailSections.map((section) => (
                <section key={section.title} className="detail-section">
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </section>
              ))}
            </div>

            {(selected.galleryImages?.length || selected.githubUrl || selected.liveUrl || selected.documentationUrl) && (
              <div className="project-links-row">
                {selected.galleryImages?.slice(0, 3).map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${selected.name} gallery ${index + 1}`} className="project-gallery-thumb" loading="lazy" decoding="async" />
                ))}
                {selected.githubUrl && (
                  <a className="btn btn-secondary btn-sm" href={selected.githubUrl} target="_blank" rel="noreferrer">
                    <Code2 size={15} /> Code
                  </a>
                )}
                {selected.liveUrl && (
                  <a className="btn btn-secondary btn-sm" href={selected.liveUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={15} /> Live demo
                  </a>
                )}
                {selected.documentationUrl && (
                  <a className="btn btn-secondary btn-sm" href={selected.documentationUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={15} /> Docs
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
