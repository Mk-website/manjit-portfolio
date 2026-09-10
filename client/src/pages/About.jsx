import { Cpu, Radio, Wrench, Waypoints } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

const areas = [{ title: 'Firmware Design', icon: Cpu }, { title: 'Wireless & IoT', icon: Radio }, { title: 'Hardware Debugging', icon: Wrench }, { title: 'Drone Control Systems', icon: Waypoints }];
const copy = ['Focused on practical embedded implementation and testable firmware interfaces.', 'Working across wireless links and device-to-cloud telemetry paths.', 'Comfortable tracing firmware behavior into custom PCB-level interfaces.', 'Interested in reliable control links and flight-oriented embedded systems.'];

export default function About() {
  const state = useApiData(api.profile.get, fallbackProfile);
  const profile = state.data || fallbackProfile;
  return <main className="page-wrap"><PageHeader eyebrow="01 / engineering profile" title="About">{profile.summary}</PageHeader><ApiNotice error={state.error} retry={state.retry} />
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{areas.map(({ title, icon: Icon }, index) => <article key={title} className="panel panel-hover p-5"><Icon size={20} className="text-cyan-300" /><h2 className="mt-6 text-base font-bold text-slate-100">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{copy[index]}</p></article>)}</div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.72fr]"><section className="panel p-6"><p className="eyebrow">Professional focus</p><h2 className="mt-3 text-xl font-bold text-slate-100">Engineering interests</h2><div className="mt-5 flex flex-wrap gap-2">{(profile.interests || []).map(item => <span className="tag" key={item}>{item}</span>)}</div><h2 className="mt-8 text-xl font-bold text-slate-100">Key strengths</h2><ul className="mt-4 grid gap-3 text-sm text-slate-300">{(profile.strengths || []).map(item => <li className="flex gap-3" key={item}><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-teal-400" />{item}</li>)}</ul></section><aside className="panel tech-grid p-6"><p className="font-mono text-xs text-cyan-300">EXPERIENCE SIGNAL</p><p className="mt-8 text-5xl font-bold text-slate-50">{profile.yearsExperience || 0}<span className="ml-2 text-xl text-slate-400">year{profile.yearsExperience === 1 ? '' : 's'}</span></p><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Applied embedded engineering experience across wireless TX/RX, IoT systems, and hardware debugging.</p>{profile.location && <p className="mt-8 border-t border-slate-700 pt-4 text-sm text-slate-300">{profile.location}</p>}</aside></div>
  </main>;
}
