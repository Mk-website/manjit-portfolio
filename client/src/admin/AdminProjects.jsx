import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Select, Textarea, joinList, parseList } from './components/ui.jsx';

const emptyForm = {
  name: '',
  shortDesc: '',
  fullDesc: '',
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  featured: false,
  status: 'published',
  displayOrder: 0,
};

export default function AdminProjects() {
  return (
    <CrudPage
      title="Projects"
      description="Manage portfolio projects including drafts."
      resource={api.projects}
      emptyForm={emptyForm}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'shortDesc', label: 'Summary' },
        { key: 'status', label: 'Status' },
        { key: 'featured', label: 'Featured', render: (item) => item.featured ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Short description" value={form.shortDesc} onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))} required />
          <Textarea label="Full description" value={form.fullDesc} onChange={(e) => setForm((f) => ({ ...f, fullDesc: e.target.value }))} />
          <Input label="Technologies (comma-separated)" value={joinList(form.technologies)} onChange={(e) => setForm((f) => ({ ...f, technologies: parseList(e.target.value) }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} />
            <Input label="Live URL" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} />
            <Input label="Image URL" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
          </div>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
          <Checkbox label="Featured" checked={!!form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
        </>
      )}
    />
  );
}
