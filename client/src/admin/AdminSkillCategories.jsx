import CrudPage from './components/CrudPage.jsx';
import { api } from '../services/api.js';
import { Checkbox, Input, Textarea } from './components/ui.jsx';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  displayOrder: 0,
  isActive: true,
};

export default function AdminSkillCategories() {
  return (
    <CrudPage
      title="Skill categories"
      description="Manage reusable skill taxonomies used across the portfolio."
      resource={api.skillCategories}
      emptyForm={emptyForm}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'displayOrder', label: 'Order' },
        { key: 'isActive', label: 'Active', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            <Input label="Icon" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
        </>
      )}
    />
  );
}
