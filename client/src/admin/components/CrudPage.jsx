import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Alert, Button, EmptyState, LoadingState, PageShell } from './ui.jsx';

export default function CrudPage({
  title,
  description,
  resource,
  columns,
  emptyForm,
  renderForm,
  getRowKey = (item) => item._id,
  getRowTitle = (item) => item.name || item.title || item.company || 'Item',
  getRowSubtitle = () => '',
}) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setState('loading');
    setError('');
    resource.listAll()
      .then((res) => {
        setItems(res.data.data || []);
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setError('Could not load items.');
      });
  }, [resource]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setModal({ mode: 'create' });
    setError('');
    setSuccess('');
  }

  function openEdit(item) {
    setForm({ ...emptyForm, ...item });
    setModal({ mode: 'edit', id: getRowKey(item) });
    setError('');
    setSuccess('');
  }

  function closeModal() {
    setModal(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (modal.mode === 'create') {
        await resource.create(form);
        setSuccess('Item created.');
      } else {
        await resource.update(modal.id, form);
        setSuccess('Item updated.');
      }
      closeModal();
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const label = getRowTitle(item);
    if (!window.confirm(`Delete "${label}"?`)) return;
    setError('');
    setSuccess('');
    try {
      await resource.remove(getRowKey(item));
      setSuccess('Item deleted.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.');
    }
  }

  return (
    <PageShell
      title={title}
      description={description}
      actions={
        <Button type="button" onClick={openCreate}>
          <Plus size={16} /> Add new
        </Button>
      }
    >
      {error && !modal && <Alert>{error}</Alert>}
      {success && !modal && <div className="mb-4"><Alert type="success">{success}</Alert></div>}

      {state === 'loading' && <LoadingState />}
      {state === 'error' && !items.length && <Alert>Could not load {title.toLowerCase()}.</Alert>}
      {state === 'ready' && !items.length && (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description="Click Add new to create one." />
      )}

      {!!items.length && (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                ))}
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={getRowKey(item)} className="border-b border-slate-800/80 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-300">
                      {col.render ? col.render(item) : item[col.key] ?? '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="grid h-8 w-8 place-items-center border border-slate-700 text-slate-300 hover:bg-slate-800" aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => handleDelete(item)} className="grid h-8 w-8 place-items-center border border-red-900 text-red-300 hover:bg-red-950" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-100">
                {modal.mode === 'create' ? `Add ${title.slice(0, -1) || title}` : `Edit ${getRowTitle(form)}`}
              </h2>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-100" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            {error && <div className="mt-4"><Alert>{error}</Alert></div>}
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {renderForm(form, setForm)}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
