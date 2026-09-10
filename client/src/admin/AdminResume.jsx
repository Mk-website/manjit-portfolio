import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { Alert, Button, EmptyState, Input, LoadingState, PageShell } from './components/ui.jsx';

export default function AdminResume() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ fileName: '', fileUrl: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setState('loading');
    setError('');
    api.resume.listAll()
      .then((res) => {
        setItems(res.data.data || []);
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setError('Could not load resume entries.');
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.resume.create(form);
      setForm({ fileName: '', fileUrl: '' });
      setSuccess('Resume added and set as active.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not add resume.');
    } finally {
      setSaving(false);
    }
  }

  async function activate(item) {
    if (item.isActive) return;
    setError('');
    setSuccess('');
    try {
      await api.resume.activate(item._id);
      setSuccess(`"${item.fileName}" is now the active resume.`);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not activate resume.');
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete resume "${item.fileName}"?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.resume.remove(item._id);
      setSuccess('Resume deleted.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.');
    }
  }

  return (
    <PageShell title="Resume" description="Manage resume file links. Add new entries or activate an existing one for download.">
      {error && <Alert>{error}</Alert>}
      {success && <div className="mb-4"><Alert type="success">{success}</Alert></div>}

      <form onSubmit={handleSubmit} className="panel mb-6 max-w-2xl space-y-4 p-6">
        <h2 className="font-semibold text-slate-100">Add resume</h2>
        <Input label="File name" value={form.fileName} onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))} placeholder="Manjit_Kumar_Resume.pdf" required />
        <Input label="File URL" value={form.fileUrl} onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))} placeholder="https://..." required />
        <Button type="submit" disabled={saving}>
          <Plus size={16} /> {saving ? 'Adding...' : 'Add resume'}
        </Button>
      </form>

      {state === 'loading' && <LoadingState />}
      {state === 'ready' && !items.length && (
        <EmptyState title="No resume uploaded" description="Add a PDF link above to make it available for download." />
      )}

      {!!items.length && (
        <div className="panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">File name</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-slate-800/80 last:border-0">
                  <td className="px-4 py-3 text-slate-200">{item.fileName}</td>
                  <td className="px-4 py-3 text-slate-400">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{item.fileUrl}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    ) : 'Inactive'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {!item.isActive && (
                        <Button type="button" variant="secondary" onClick={() => activate(item)}>
                          <CheckCircle2 size={14} /> Set active
                        </Button>
                      )}
                      <Button type="button" variant="danger" onClick={() => remove(item)}>
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
