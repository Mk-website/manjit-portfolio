import { useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

const initialForm = { name: '', email: '', subject: '', body: '', website: '' };

export default function Contact() {
  const profileState = useApiData(api.profile.get, fallbackProfile);
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ status: 'idle', message: '' });
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  async function submit(event) { event.preventDefault(); if (form.website) return; setState({ status: 'loading', message: '' }); try { await api.messages.post({ name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), body: form.body.trim() }); setForm(initialForm); setState({ status: 'success', message: 'Message sent. I will get back to you soon.' }); } catch (error) { setState({ status: 'error', message: error.response?.data?.message || 'Unable to send your message right now. Please try again.' }); } }
  const profile = profileState.data || fallbackProfile;
  return <main className="page-wrap"><PageHeader eyebrow="08 / contact channel" title="Start a conversation">For firmware, wireless, IoT, or embedded engineering opportunities.</PageHeader><ApiNotice error={profileState.error} retry={profileState.retry} />
    <div className="mt-10 grid gap-6 lg:grid-cols-[.72fr_1.28fr]"><aside className="panel tech-grid p-6"><p className="font-mono text-xs text-cyan-300">DIRECT CHANNELS</p><div className="mt-8 grid gap-5">{profile.email && <a className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-300" href={`mailto:${profile.email}`}><Mail size={18} className="text-cyan-300" />{profile.email}</a>}{profile.phone && <a className="flex items-center gap-3 text-sm text-slate-300 hover:text-cyan-300" href={`tel:${profile.phone}`}><Phone size={18} className="text-cyan-300" />{profile.phone}</a>}</div><p className="mt-10 border-t border-slate-700 pt-5 text-sm leading-6 text-slate-400">Use the form for a focused introduction, opportunity, or project conversation.</p></aside><form onSubmit={submit} className="panel p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Name" name="name" value={form.name} onChange={update} placeholder="Your name" /><Field label="Email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" /></div><div className="mt-4"><Field label="Subject" name="subject" value={form.subject} onChange={update} placeholder="Project or opportunity" /></div><div className="mt-4"><label className="block text-sm font-medium text-slate-200">Message<textarea required name="body" value={form.body} onChange={update} rows="6" className="mt-2 w-full resize-y border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none" placeholder="Write your message..." /></label></div><input tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={update} className="absolute h-px w-px opacity-0" aria-hidden="true" /><div className="mt-6 flex flex-wrap items-center gap-3"><button disabled={state.status === 'loading'} className="btn-primary disabled:cursor-wait disabled:opacity-60">{state.status === 'loading' ? 'Sending...' : <><Send size={16} />Send message</>}</button>{state.message && <p className={`text-sm ${state.status === 'success' ? 'text-teal-300' : 'text-red-300'}`} role="status">{state.message}</p>}</div></form></div>
  </main>;
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) { return <label className="block text-sm font-medium text-slate-200">{label}<input required name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="mt-2 w-full border border-slate-700 bg-slate-950 p-3 text-slate-100 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none" /></label>; }
