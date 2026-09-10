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
  const projects = [...state.data].sort((a, b) => Number(b.featured) - Number(a.featured) || (a.displayOrder || 0) - (b.displayOrder || 0));
  useEffect(() => { const close = event => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  return <main className="page-wrap"><PageHeader eyebrow="04 / selected work" title="Projects">Embedded systems and IoT work, shown with their actual scope and available project details.</PageHeader><ApiNotice error={state.error} retry={state.retry} loading={state.loading} />
    {!state.loading && <div className="mt-10 grid gap-5 md:grid-cols-2">{projects.map(project => <article className="panel panel-hover overflow-hidden" key={project._id}>{project.imageUrl ? <img src={project.imageUrl} alt={project.name} className="aspect-video w-full object-cover" /> : <ProjectVisual project={project} />}<div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-bold text-slate-100">{project.name}</h2>{project.featured && <span className="tag text-cyan-300">Featured</span>}</div><p className="mt-3 text-sm leading-6 text-slate-400">{project.shortDesc}</p><div className="mt-5 flex flex-wrap gap-2">{project.technologies?.map(item => <span key={item} className="tag">{item}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" onClick={() => setSelected(project)}>Details</button>{project.githubUrl && <a className="btn-secondary" href={project.githubUrl} target="_blank" rel="noreferrer"><Code2 size={16} />Code</a>}{project.liveUrl && <a className="btn-secondary" href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} />Live demo</a>}</div></div></article>)}{!projects.length && !state.error && <p className="text-slate-400">Projects will appear here when they are added.</p>}</div>}
    {selected && <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-labelledby="project-title"><div className="panel max-h-[85vh] w-full max-w-2xl overflow-auto p-6"><div className="flex items-start justify-between gap-5"><div><p className="eyebrow">Project details</p><h2 id="project-title" className="mt-3 text-2xl font-bold text-slate-100">{selected.name}</h2></div><button className="grid h-9 w-9 place-items-center border border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setSelected(null)} aria-label="Close project details"><X size={18} /></button></div><p className="mt-6 leading-7 text-slate-300">{selected.fullDesc || selected.shortDesc}</p><div className="mt-6 flex flex-wrap gap-2">{selected.technologies?.map(item => <span key={item} className="tag">{item}</span>)}</div></div></div>}
  </main>;
}
