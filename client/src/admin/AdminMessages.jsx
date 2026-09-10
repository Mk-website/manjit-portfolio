import { useCallback, useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { Alert, Button, EmptyState, LoadingState, PageShell } from './components/ui.jsx';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(() => {
    setState('loading');
    setError('');
    api.messages.get()
      .then((res) => {
        setMessages(res.data.data || []);
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setError('Could not load messages.');
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleRead(item) {
    setError('');
    setSuccess('');
    try {
      await api.messages.markRead(item._id, !item.isRead);
      setSuccess(item.isRead ? 'Marked as unread.' : 'Marked as read.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed.');
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete message from ${item.name}?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.messages.remove(item._id);
      setSuccess('Message deleted.');
      load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.');
    }
  }

  return (
    <PageShell title="Messages" description="Contact form submissions from your portfolio site.">
      {error && <Alert>{error}</Alert>}
      {success && <div className="mb-4"><Alert type="success">{success}</Alert></div>}
      {state === 'loading' && <LoadingState />}
      {state === 'error' && !messages.length && <Alert>{error}</Alert>}
      {state === 'ready' && !messages.length && (
        <EmptyState title="No messages yet" description="Messages from the contact form will appear here." />
      )}
      {!!messages.length && (
        <div className="grid gap-4">
          {messages.map((item) => (
            <article key={item._id} className={`panel p-5 ${item.isRead ? 'opacity-80' : 'border-cyan-900/50'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!item.isRead && <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs font-semibold text-cyan-300">New</span>}
                    <h2 className="font-semibold text-slate-100">{item.subject}</h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{item.name} · {item.email}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => toggleRead(item)}>
                    {item.isRead ? <><Mail size={14} /> Mark unread</> : <><MailOpen size={14} /> Mark read</>}
                  </Button>
                  <Button type="button" variant="danger" onClick={() => remove(item)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
