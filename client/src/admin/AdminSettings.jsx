import { useCallback } from 'react';
import { api } from '../services/api.js';
import SingletonForm from './components/SingletonForm.jsx';
import { Input, Select, Textarea } from './components/ui.jsx';

const emptyForm = {
  siteTitle: '',
  metaDescription: '',
  footerText: '',
  theme: 'dark',
  socials: { github: '', linkedin: '', email: '' },
};

export default function AdminSettings() {
  const load = useCallback(() => api.settings.get().then((res) => res.data.data), []);
  const save = useCallback((data) => api.settings.update(data), []);

  return (
    <SingletonForm
      title="Settings"
      description="Site-wide metadata, theme, and footer content."
      emptyForm={emptyForm}
      load={load}
      save={save}
      renderForm={(form, setForm) => (
        <>
          <Input label="Site title" value={form.siteTitle} onChange={(e) => setForm((f) => ({ ...f, siteTitle: e.target.value }))} />
          <Textarea label="Meta description" value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={3} />
          <Input label="Footer text" value={form.footerText} onChange={(e) => setForm((f) => ({ ...f, footerText: e.target.value }))} />
          <Select label="Theme" value={form.theme} onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="GitHub" value={form.socials?.github || ''} onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, github: e.target.value } }))} />
            <Input label="LinkedIn" value={form.socials?.linkedin || ''} onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, linkedin: e.target.value } }))} />
            <Input label="Contact email" type="email" value={form.socials?.email || ''} onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, email: e.target.value } }))} />
          </div>
        </>
      )}
    />
  );
}
