import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Select, Textarea, joinList, parseList } from './components/ui.jsx';
import MediaManager from './components/MediaManager.jsx';

const emptyForm = {
  name: '',
  slug: '',
  category: '',
  categoryId: '',
  categoryName: '',
  shortDesc: '',
  fullDesc: '',
  problem: '',
  solution: '',
  architecture: '',
  implementation: '',
  hardware: '',
  firmware: '',
  technologies: [],
  protocols: [],
  githubUrl: '',
  liveUrl: '',
  documentationUrl: '',
  imageUrl: '',
  coverImage: null,
  gallery: [],
  galleryImages: [],
  videoUrl: '',
  featured: false,
  isActive: true,
  status: 'published',
  displayOrder: 0,
};

export default function AdminProjects() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.projectCategories.get().then((res) => setCategories(res.data.data || [])).catch(() => setCategories([]));
  }, []);

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
          <p className="border-b border-cyan-900 pb-2 font-mono text-xs text-cyan-400">BASIC</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
          </div>
          <Select label="Category" value={form.categoryId || form.category || ''} onChange={(e) => {
            const selected = categories.find((category) => String(category._id) === e.target.value);
            setForm((f) => ({
              ...f,
              categoryId: selected ? selected._id : '',
              categoryName: selected ? selected.name : f.category || '',
              category: selected ? selected.name : f.category || '',
            }));
          }}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </Select>
          {categories.length === 0 && <p className="text-sm text-amber-300">Create an active project category before creating a project.</p>}
          <Input label="Short description" value={form.shortDesc} onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))} required />
          <Textarea label="Full description" value={form.fullDesc} onChange={(e) => setForm((f) => ({ ...f, fullDesc: e.target.value }))} />
          <Textarea label="Problem" value={form.problem} onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))} />
          <Textarea label="Solution" value={form.solution} onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))} />
          <Textarea label="Architecture" value={form.architecture} onChange={(e) => setForm((f) => ({ ...f, architecture: e.target.value }))} />
          <Textarea label="Implementation" value={form.implementation} onChange={(e) => setForm((f) => ({ ...f, implementation: e.target.value }))} />
          <Textarea label="Hardware" value={form.hardware} onChange={(e) => setForm((f) => ({ ...f, hardware: e.target.value }))} />
          <Textarea label="Firmware" value={form.firmware} onChange={(e) => setForm((f) => ({ ...f, firmware: e.target.value }))} />
          <Textarea label="Testing / validation" value={form.testing} onChange={(e) => setForm((f) => ({ ...f, testing: e.target.value }))} />
          <Textarea label="Challenges" value={form.challenges} onChange={(e) => setForm((f) => ({ ...f, challenges: e.target.value }))} />
          <Textarea label="Results / outcomes" value={form.results} onChange={(e) => setForm((f) => ({ ...f, results: e.target.value }))} />
          <Textarea label="Role / contribution" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
          <Input label="Technologies (comma-separated)" value={joinList(form.technologies)} onChange={(e) => setForm((f) => ({ ...f, technologies: parseList(e.target.value) }))} />
          <Input label="Protocols (comma-separated)" value={joinList(form.protocols)} onChange={(e) => setForm((f) => ({ ...f, protocols: parseList(e.target.value) }))} />
          <MediaManager label="Cover image" value={form.coverImage || form.imageUrl} onChange={(value) => setForm((f) => ({ ...f, coverImage: value, imageUrl: value?.url || '' }))} folder="projects/covers" />
          <MediaManager label="Gallery" multiple value={form.gallery?.length ? form.gallery : form.galleryImages} onChange={(value) => setForm((f) => ({ ...f, gallery: value, galleryImages: value.map((item) => item.url) }))} folder="projects/gallery" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} />
            <Input label="Live URL" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} />
            <Input label="Documentation URL" value={form.documentationUrl} onChange={(e) => setForm((f) => ({ ...f, documentationUrl: e.target.value }))} />
            <Input label="Video URL" value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))} />
          </div>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
          <div className="flex flex-wrap gap-4">
            <Checkbox label="Featured" checked={!!form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          </div>
        </>
      )}
    />
  );
}
