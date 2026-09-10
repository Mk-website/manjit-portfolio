import { api } from '../services/api.js';
import CrudPage from './components/CrudPage.jsx';
import { Checkbox, Input } from './components/ui.jsx';

const emptyForm = {
  name: '',
  issuer: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  isActive: true,
};

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

export default function AdminCertifications() {
  return (
    <CrudPage
      title="Certifications"
      description="Manage certifications and credentials."
      resource={api.certifications}
      emptyForm={emptyForm}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'issuer', label: 'Issuer' },
        { key: 'issueDate', label: 'Issued', render: (item) => toDateInput(item.issueDate) || '—' },
        { key: 'isActive', label: 'Active', render: (item) => item.isActive ? 'Yes' : 'No' },
      ]}
      renderForm={(form, setForm) => (
        <>
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Issuer" value={form.issuer} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} required />
          <Input label="Issue date" type="date" value={toDateInput(form.issueDate)} onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))} />
          <Input label="Credential ID" value={form.credentialId} onChange={(e) => setForm((f) => ({ ...f, credentialId: e.target.value }))} />
          <Input label="Credential URL" value={form.credentialUrl} onChange={(e) => setForm((f) => ({ ...f, credentialUrl: e.target.value }))} />
          <Checkbox label="Active" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
        </>
      )}
    />
  );
}
