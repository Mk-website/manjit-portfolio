import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input } from './components/ui.jsx';

const emptyForm = { name: '', category: '', description: '', icon: '', proficiency: 70, displayOrder: 0, isActive: true };

export default function AdminSkills() {
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
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required />
          <Input label="Icon (optional)" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
          <Input label="Proficiency (0–100)" type="number" min="0" max="100" value={form.proficiency} onChange={(e) => setForm((f) => ({ ...f, proficiency: Number(e.target.value) }))} />
          <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Short description or context for this skill"
          />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
        </>
      )}
    />
  );
}
