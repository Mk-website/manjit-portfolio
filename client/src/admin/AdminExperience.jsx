import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Textarea, joinList, parseList } from './components/ui.jsx';

const emptyForm = {
  company: '',
  position: '',
  location: 'On-site',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  responsibilities: [],
  technologies: [],
  displayOrder: 0,
  isActive: true,
};

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

export default function AdminExperience() {
  return (
    <CrudPage
      title="Experience"
      description="Manage work history entries."
      resource={api.experience}
      emptyForm={emptyForm}
      getRowTitle={(item) => `${item.position} @ ${item.company}`}
      columns={[
        { key: 'company', label: 'Company' },
        { key: 'position', label: 'Position' },
        { key: 'startDate', label: 'Start', render: (item) => toDateInput(item.startDate) },
        { key: 'isCurrent', label: 'Current', render: (item) => item.isCurrent ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} required />
            <Input label="Position" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} required />
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
            <Input label="Start date" type="date" value={toDateInput(form.startDate)} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} required />
            <Input label="End date" type="date" value={toDateInput(form.endDate)} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} disabled={form.isCurrent} />
          </div>
          <Checkbox label="Current role" checked={!!form.isCurrent} onChange={(e) => setForm((f) => ({ ...f, isCurrent: e.target.checked, endDate: e.target.checked ? '' : f.endDate }))} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input label="Responsibilities (comma-separated)" value={joinList(form.responsibilities)} onChange={(e) => setForm((f) => ({ ...f, responsibilities: parseList(e.target.value) }))} />
          <Input label="Technologies (comma-separated)" value={joinList(form.technologies)} onChange={(e) => setForm((f) => ({ ...f, technologies: parseList(e.target.value) }))} />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
        </>
      )}
    />
  );
}
