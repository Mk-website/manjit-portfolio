import { CalendarDays, MapPin } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

const date = value => value ? new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(value)) : '';

export default function Experience() {
  const state = useApiData(api.experience.get, []);
  return <main className="page-wrap"><PageHeader eyebrow="03 / field record" title="Experience">Roles focused on wireless systems, firmware delivery, and hardware-interface debugging.</PageHeader><ApiNotice error={state.error} retry={state.retry} loading={state.loading} />
    {!state.loading && <div className="relative mt-10 border-l border-slate-700 pl-6 sm:pl-10">{state.data.map((role, index) => <article key={role._id} className="relative pb-9 last:pb-0"><span className="absolute -left-[31px] top-6 h-3 w-3 border-2 border-slate-950 bg-cyan-400 sm:-left-[47px]" /><div className="panel panel-hover p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs text-cyan-300">{String(index + 1).padStart(2, '0')} / {role.isCurrent ? 'CURRENT ROLE' : 'ROLE HISTORY'}</p><h2 className="mt-2 text-xl font-bold text-slate-100">{role.position}</h2><p className="mt-1 text-sm font-medium text-slate-300">{role.company}</p></div>{role.isCurrent && <span className="tag border-teal-800 text-teal-300">Current</span>}</div><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400"><span className="inline-flex items-center gap-2"><CalendarDays size={15} />{date(role.startDate)} - {role.isCurrent ? 'Present' : date(role.endDate)}</span>{role.location && <span className="inline-flex items-center gap-2"><MapPin size={15} />{role.location}</span>}</div>{role.description && <p className="mt-5 leading-7 text-slate-300">{role.description}</p>}{role.responsibilities?.length > 0 && <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-400">{role.responsibilities.map((item, itemIndex) => <li className="flex gap-3" key={`${role._id}-${itemIndex}`}><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-cyan-400" />{item}</li>)}</ul>}{role.technologies?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{role.technologies.map(item => <span key={item} className="tag">{item}</span>)}</div>}</div></article>)}{!state.data.length && !state.error && <p className="text-slate-400">Experience entries will appear here when they are added.</p>}</div>}
  </main>;
}
