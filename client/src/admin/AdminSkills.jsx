import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Select } from './components/ui.jsx';
import MediaManager from './components/MediaManager.jsx';

const emptyForm = { name: '', category: '', categoryId: '', categoryName: '', description: '', icon: '', proficiency: 70, displayOrder: 0, isActive: true, media: [] };

export default function AdminSkills() {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  useEffect(() => {
    let active = true;
    api.skillCategories.get()
      .then((res) => {
        if (!active) return;
        setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch(() => {
        if (!active) return;
        setCategories([]);
        setCategoriesError('Could not load skill categories. Refresh and try again.');
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <CrudPage
      title="Skills"
      description="Manage technical skills shown on your portfolio."
      resource={api.skills}
      emptyForm={emptyForm}
      normalizeForm={(form) => {
        const selected = categories.find((category) => String(category._id) === String(form.categoryId))
          || categories.find((category) => category.name === form.categoryName
            || category.name === form.category
            || category.slug === form.categorySlug);
        return selected
          ? { ...form, categoryId: selected._id, categoryName: selected.name, category: selected.name }
          : form;
      }}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'proficiency', label: 'Proficiency' },
        { key: 'displayOrder', label: 'Order' },
        { key: 'isActive', label: 'Active', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => {
        const selectedCategory = categories.find((category) => String(category._id) === String(form.categoryId))
          || categories.find((category) => category.name === form.categoryName
            || category.name === form.category
            || category.slug === form.categorySlug);

        return (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Proficiency (0–100)" type="number" min="0" max="100" value={form.proficiency} onChange={(e) => setForm((f) => ({ ...f, proficiency: Number(e.target.value) }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
            <Input label="Icon (optional)" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
          </div>
          <Select label="Category" value={selectedCategory?._id || form.categoryId || ''} disabled={categoriesLoading} onChange={(e) => {
            const selected = categories.find((category) => String(category._id) === e.target.value);
            setForm((f) => ({
              ...f,
              categoryId: selected ? selected._id : '',
              categoryName: selected ? selected.name : f.category || '',
              category: selected ? selected.name : f.category || '',
            }));
          }}>
            <option value="">{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </Select>
          {categoriesError && <p className="text-sm text-red-300">{categoriesError}</p>}
          {!categoriesLoading && !categoriesError && categories.length === 0 && <p className="text-sm text-amber-300">Create an active skill category before assigning this skill.</p>}
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
        );
      }}
    />
  );
}
