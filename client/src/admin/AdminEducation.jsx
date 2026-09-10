import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input, Textarea } from './components/ui.jsx';

const emptyForm = {
  degree: '',
  institution: '',
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  grade: '',
  description: '',
  displayOrder: 0,
  isActive: true,
};

export default function AdminEducation() {
  return (
    <CrudPage
      title="Education"
      description="Manage education history entries."
      resource={api.education}
      emptyForm={emptyForm}
      getRowTitle={(item) => item.degree}
      columns={[
        { key: 'degree', label: 'Degree' },
        { key: 'institution', label: 'Institution' },
        { key: 'startYear', label: 'Start' },
        { key: 'endYear', label: 'End' },
        { key: 'grade', label: 'Grade' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <Input label="Degree" value={form.degree} onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))} required />
          <Input label="Institution" value={form.institution} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start year" type="number" value={form.startYear} onChange={(e) => setForm((f) => ({ ...f, startYear: Number(e.target.value) }))} required />
            <Input label="End year" type="number" value={form.endYear} onChange={(e) => setForm((f) => ({ ...f, endYear: Number(e.target.value) }))} required />
            <Input label="Grade" value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} />
            <Input label="Display order" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
        </>
      )}
    />
  );
}
