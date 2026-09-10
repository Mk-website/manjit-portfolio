import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Download, Link as LinkIcon, Mail } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import ApiNotice from '../components/ApiNotice.jsx';
import { SystemDiagram } from '../components/TechnicalVisual.jsx';

export default function Home() {
  const profileState = useApiData(api.profile.get, fallbackProfile);
  const resumeState = useApiData(api.resume.get, null);
  const profile = profileState.data || fallbackProfile;
  const chips = ['STM32F401', 'LoRa SX1262', 'Wireless TX/RX', 'UART / SPI / I2C', 'IoT'];
  return <div className="page-wrap flex min-h-[calc(100vh-8rem)] items-center py-12 sm:py-16"><div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
    <section className="max-w-2xl"><p className="eyebrow"><i className="signal-dot" />Embedded firmware portfolio</p><h1 className="mt-5 text-4xl font-extrabold text-slate-50 sm:text-6xl">{profile.name}</h1><p className="mt-4 text-xl font-semibold text-cyan-300 sm:text-2xl">{profile.title}</p><p className="mt-5 max-w-xl text-base leading-8 text-slate-400">{profile.summary}</p><div className="mt-7 flex flex-wrap gap-2">{chips.map(chip => <span key={chip} className="tag">{chip}</span>)}</div><div className="mt-8 flex flex-wrap gap-3"><Link to="/projects" className="btn-primary">View projects <ArrowRight size={16} /></Link><Link to="/contact" className="btn-secondary">Contact me <Mail size={16} /></Link>{resumeState.data?.fileUrl && <a href={resumeState.data.fileUrl} download className="btn-secondary"><Download size={16} />Download resume</a>}</div><div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400"><a className="inline-flex items-center gap-2 hover:text-cyan-300" href={profile.github} target="_blank" rel="noreferrer"><Code2 size={16} />GitHub</a><a className="inline-flex items-center gap-2 hover:text-cyan-300" href={profile.linkedin} target="_blank" rel="noreferrer"><LinkIcon size={16} />LinkedIn</a><a className="inline-flex items-center gap-2 hover:text-cyan-300" href={`mailto:${profile.email}`}><Mail size={16} />Email</a></div><ApiNotice error={profileState.error} retry={profileState.retry} /></section>
    <SystemDiagram />
  </div></div>;
}
