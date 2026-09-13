import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Select } from './components/ui.jsx';
import MediaManager from './components/MediaManager.jsx';

const emptyForm = { name: '', category: '', categoryId: '', categoryName: '', description: '', icon: '', proficiency: 70, displayOrder: 0, isActive: true, media: [] };

export default function AdminSkills() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.skillCategories.get().then((res) => setCategories(res.data.data || [])).catch(() => setCategories([]));
  }, []);

  return (
    <CrudPage
      title="Skills"
      description="Manage technical skills shown on your portfolio."
      resource={api.skills}
      emptyForm={emptyForm}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'proficiency', label: 'Proficiency' },
        { key: 'displayOrder', label: 'Order' },
        { key: 'isActive', label: 'Active', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Proficiency (0–100)" type="number" min="0" max="100" value={form.proficiency} onChange={(e) => setForm((f) => ({ ...f, proficiency: Number(e.target.value) }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
            <Input label="Icon (optional)" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
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
          {categories.length === 0 && <p className="text-sm text-amber-300">Create an active skill category before assigning this skill.</p>}
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Short description or context for this skill"
          />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          <MediaManager label="Skill icon / image" value={form.media} onChange={(value) => setForm((f) => ({ ...f, media: value }))} folder="skills" />
        </>
      )}
    />
  );
}
