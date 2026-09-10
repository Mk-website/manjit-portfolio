import { useCallback } from 'react';
import { api } from '../services/api.js';
import SingletonForm from './components/SingletonForm.jsx';
import { Input, Textarea, joinList, parseList } from './components/ui.jsx';

const emptyForm = {
  name: '',
  title: '',
  summary: '',
  phone: '',
  email: '',
  github: '',
  linkedin: '',
  location: '',
  yearsExperience: 0,
  interests: [],
  strengths: [],
  photoUrl: '',
};

export default function AdminProfile() {
  const load = useCallback(() => api.profile.get().then((res) => res.data.data), []);
  const save = useCallback((data) => api.profile.update({
    ...data,
    yearsExperience: Number(data.yearsExperience) || 0,
    interests: Array.isArray(data.interests) ? data.interests : parseList(data.interests),
    strengths: Array.isArray(data.strengths) ? data.strengths : parseList(data.strengths),
  }), []);

  return (
    <SingletonForm
      title="Profile"
      description="Edit your public bio, contact links, and summary shown on the portfolio site."
      emptyForm={emptyForm}
      load={load}
      save={save}
      renderForm={(form, setForm) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input label="Years of experience" type="number" min="0" value={form.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))} />
            <Input label="GitHub URL" value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} />
            <Input label="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} />
            <Input label="Photo URL" value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} className="sm:col-span-2" />
          </div>
          <Textarea label="Summary" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} rows={5} />
          <Input label="Interests (comma-separated)" value={joinList(form.interests)} onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))} />
          <Input label="Strengths (comma-separated)" value={joinList(form.strengths)} onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))} />
        </>
      )}
    />
  );
}
