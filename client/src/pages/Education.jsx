import { GraduationCap } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

export default function Education() {
  const state = useApiData(api.education.get, []);
  return <main className="page-wrap"><PageHeader eyebrow="05 / academic record" title="Education">Academic foundation supporting a hands-on embedded engineering path.</PageHeader><ApiNotice error={state.error} retry={state.retry} loading={state.loading} />
    {!state.loading && <div className="mt-10 grid gap-5 md:grid-cols-2">{state.data.map(item => <article className="panel panel-hover p-6" key={item._id}><GraduationCap size={23} className="text-cyan-300" /><p className="mt-7 font-mono text-xs text-cyan-300">{item.startYear} - {item.endYear}</p><h2 className="mt-3 text-xl font-bold text-slate-100">{item.degree}</h2><p className="mt-2 leading-6 text-slate-300">{item.institution}</p>{item.grade && <p className="mt-6 border-t border-slate-700 pt-4 text-sm text-slate-400">{item.grade}</p>}{item.description && <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>}</article>)}{!state.data.length && !state.error && <p className="text-slate-400">Education entries will appear here when they are added.</p>}</div>}
  </main>;
}
