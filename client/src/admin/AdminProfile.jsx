import { useCallback } from 'react';
import { api } from '../services/api.js';
import SingletonForm from './components/SingletonForm.jsx';
import { Input, Textarea, joinList, parseList } from './components/ui.jsx';

const emptyForm = {
  name: '',
  title: '',
  heroEyebrow: '',
  heroTitle: '',
  heroSubtitle: '',
  heroDescription: '',
  summary: '',
  phone: '',
  email: '',
  github: '',
  linkedin: '',
  location: '',
  yearsExperience: 0,
  availabilityStatus: '',
  resumeUrl: '',
  primaryCtaText: '',
  primaryCtaUrl: '',
  secondaryCtaText: '',
  secondaryCtaUrl: '',
  techStack: [],
  interests: [],
  strengths: [],
  photoUrl: '',
  socials: { github: '', linkedin: '', email: '' },
};

export default function AdminProfile() {
  const load = useCallback(() => api.profile.get().then((res) => res.data.data), []);
  const save = useCallback((data) => api.profile.update({
    ...data,
    yearsExperience: Number(data.yearsExperience) || 0,
    techStack: Array.isArray(data.techStack) ? data.techStack : parseList(data.techStack),
    interests: Array.isArray(data.interests) ? data.interests : parseList(data.interests),
    strengths: Array.isArray(data.strengths) ? data.strengths : parseList(data.strengths),
    socials: {
      github: data.socials?.github || data.github || '',
      linkedin: data.socials?.linkedin || data.linkedin || '',
      email: data.socials?.email || data.email || '',
    },
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
            <Input label="Hero eyebrow" value={form.heroEyebrow} onChange={(e) => setForm((f) => ({ ...f, heroEyebrow: e.target.value }))} />
            <Input label="Availability status" value={form.availabilityStatus} onChange={(e) => setForm((f) => ({ ...f, availabilityStatus: e.target.value }))} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input label="Years of experience" type="number" min="0" value={form.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))} />
            <Input label="GitHub URL" value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} />
            <Input label="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} />
            <Input label="Resume URL" value={form.resumeUrl} onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))} />
            <Input label="Primary CTA label" value={form.primaryCtaText} onChange={(e) => setForm((f) => ({ ...f, primaryCtaText: e.target.value }))} />
            <Input label="Primary CTA URL" value={form.primaryCtaUrl} onChange={(e) => setForm((f) => ({ ...f, primaryCtaUrl: e.target.value }))} />
            <Input label="Secondary CTA label" value={form.secondaryCtaText} onChange={(e) => setForm((f) => ({ ...f, secondaryCtaText: e.target.value }))} />
            <Input label="Secondary CTA URL" value={form.secondaryCtaUrl} onChange={(e) => setForm((f) => ({ ...f, secondaryCtaUrl: e.target.value }))} />
            <Input label="Photo URL" value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} className="sm:col-span-2" />
          </div>
          <Input label="Hero title override" value={form.heroTitle} onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))} />
          <Input label="Hero subtitle" value={form.heroSubtitle} onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))} />
          <Textarea label="Hero description" value={form.heroDescription} onChange={(e) => setForm((f) => ({ ...f, heroDescription: e.target.value }))} rows={3} />
          <Textarea label="Summary" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} rows={5} />
          <Input label="Tech stack (comma-separated)" value={joinList(form.techStack)} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))} />
          <Input label="Interests (comma-separated)" value={joinList(form.interests)} onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))} />
          <Input label="Strengths (comma-separated)" value={joinList(form.strengths)} onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))} />
        </>
      )}
    />
  );
}
