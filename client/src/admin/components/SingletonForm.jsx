import { useEffect, useState } from 'react';
import { Alert, Button, LoadingState, PageShell } from './ui.jsx';

export default function SingletonForm({ title, description, load, save, renderForm, emptyForm }) {
  const [form, setForm] = useState(emptyForm);
  const [state, setState] = useState('loading');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    setState('loading');
    load()
      .then((data) => {
        if (!active) return;
        setForm({ ...emptyForm, ...data });
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
        setError('Could not load data.');
      });
    return () => { active = false; };
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await save(form);
      setForm({ ...emptyForm, ...(res?.data?.data || form) });
      setSuccess('Saved successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title={title} description={description}>
      {state === 'loading' && <LoadingState />}
      {state === 'error' && <Alert>{error}</Alert>}
      {state === 'ready' && (
        <form onSubmit={handleSubmit} className="panel max-w-3xl space-y-4 p-6">
          {error && state === 'ready' && <Alert>{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}
          {renderForm(form, setForm)}
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
        </form>
      )}
    </PageShell>
  );
}
