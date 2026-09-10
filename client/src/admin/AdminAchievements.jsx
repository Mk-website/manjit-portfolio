import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Textarea } from './components/ui.jsx';

const emptyForm = { title: '', description: '', displayOrder: 0, isActive: true };

export default function AdminAchievements() {
  return (
    <CrudPage
      title="Achievements"
      description="Manage awards, highlights, and achievements."
      resource={api.achievements}
      emptyForm={emptyForm}
      getRowKey={(item) => item._id}
      getRowTitle={(item) => item.title}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', render: (item) => item.description?.slice(0, 80) || '—' },
        { key: 'displayOrder', label: 'Order' },
        { key: 'isActive', label: 'Active', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
        </>
      )}
    />
  );
}
