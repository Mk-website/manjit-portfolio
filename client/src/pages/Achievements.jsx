import { Trophy } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

export default function Achievements() {
  const state = useApiData(api.achievements.get, []);
  return <main className="page-wrap"><PageHeader eyebrow="07 / leadership" title="Achievements">Responsibilities and accomplishments in embedded firmware work.</PageHeader><ApiNotice error={state.error} retry={state.retry} loading={state.loading} />
    {!state.loading && <div className="mt-10 grid gap-5 md:grid-cols-2">{state.data.map(item => <article className="panel panel-hover p-6" key={item._id}><Trophy size={23} className="text-cyan-300" /><h2 className="mt-7 text-xl font-bold text-slate-100">{item.title}</h2>{item.description && <p className="mt-4 leading-7 text-slate-400">{item.description}</p>}</article>)}{!state.data.length && !state.error && <p className="text-slate-400">Achievements will appear here when they are added.</p>}</div>}
  </main>;
}
