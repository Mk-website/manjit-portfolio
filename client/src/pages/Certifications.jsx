import { BadgeCheck, ExternalLink } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

export default function Certifications() {
  const state = useApiData(api.certifications.get, []);
  return <main className="page-wrap"><PageHeader eyebrow="06 / credentials" title="Certifications">Professional certifications and credentials.</PageHeader><ApiNotice error={state.error} retry={state.retry} loading={state.loading} />
    {!state.loading && (state.data.length ? <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{state.data.map(item => <article className="panel panel-hover p-6" key={item._id}><BadgeCheck size={22} className="text-cyan-300" /><h2 className="mt-7 text-lg font-bold text-slate-100">{item.name}</h2><p className="mt-2 text-sm text-slate-400">{item.issuer}</p>{item.issueDate && <p className="mt-4 text-xs text-slate-500">{new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(item.issueDate))}</p>}{item.credentialId && <p className="mt-3 font-mono text-xs text-slate-500">ID: {item.credentialId}</p>}{item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">View credential <ExternalLink size={15} /></a>}</article>)}</div> : !state.error && <div className="panel tech-grid mt-10 p-8 text-center"><BadgeCheck size={26} className="mx-auto text-slate-500" /><p className="mt-5 text-lg font-semibold text-slate-200">Certifications will be added as they are completed.</p></div>)}</main>;
}
