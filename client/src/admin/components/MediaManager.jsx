import { useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { Alert, Button, Input, Textarea } from './ui.jsx';

const asItems = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value && typeof value === 'object' && value.url) return [value];
  if (typeof value !== 'string') return [];
  return value ? [{ url: value, type: 'image', alt: '' }] : [];
};

export default function MediaManager({ label, value, onChange, folder, multiple = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const items = asItems(value);

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of multiple ? files : files.slice(0, 1)) {
        const response = await api.media.upload(file, folder);
        uploaded.push({ ...response.data.data, type: 'image', alt: file.name, caption: '', order: items.length + uploaded.length });
      }
      onChange(multiple ? [...items, ...uploaded] : uploaded[0] || null);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || 'Upload failed.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  function update(index, patch) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  async function remove(index) {
    const item = items[index];
    if (item?.publicId && item.provider) {
      try {
        await api.media.remove(item.publicId);
      } catch (removeError) {
        setError(removeError?.response?.data?.message || 'Could not delete the stored image.');
        return;
      }
    }
    const next = items.filter((_, itemIndex) => itemIndex !== index).map((item, order) => ({ ...item, order, isPrimary: order === 0 }));
    onChange(multiple ? next : null);
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, order) => ({ ...item, order, isPrimary: order === 0 })));
  }

  function makePrimary(index) {
    onChange(items.map((item, itemIndex) => ({ ...item, isPrimary: itemIndex === index })));
  }

  return (
    <section className="grid gap-3 border border-slate-800 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-100">{label}</h3>
          <p className="text-xs text-slate-500">JPEG, PNG, WebP, GIF, or AVIF up to 5MB.</p>
        </div>
        <label className="btn-secondary inline-flex cursor-pointer items-center gap-2 text-sm">
          <ImagePlus size={15} /> {busy ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple={multiple} onChange={handleFiles} disabled={busy} className="sr-only" />
        </label>
      </div>
      {error && <Alert>{error}</Alert>}
      {!items.length && <p className="text-sm text-slate-500">No image selected.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${item.url}-${index}`} className="grid gap-2 border border-slate-800 p-3">
            <img src={item.url} alt={item.alt || ''} className="h-36 w-full object-cover" />
            <Input label="Alt text" value={item.alt || ''} onChange={(event) => update(index, { alt: event.target.value })} />
            <Textarea label="Caption" rows={2} value={item.caption || ''} onChange={(event) => update(index, { caption: event.target.value })} />
            <div className="flex flex-wrap gap-2">
              {multiple && <Button type="button" variant={item.isPrimary ? 'primary' : 'secondary'} onClick={() => makePrimary(index)}>{item.isPrimary ? 'Cover image' : 'Make cover'}</Button>}
              {multiple && <button type="button" className="btn-secondary p-2" onClick={() => move(index, -1)} aria-label="Move image up"><ArrowUp size={15} /></button>}
              {multiple && <button type="button" className="btn-secondary p-2" onClick={() => move(index, 1)} aria-label="Move image down"><ArrowDown size={15} /></button>}
              <button type="button" className="btn-secondary border-red-800 p-2 text-red-300" onClick={() => remove(index)} aria-label="Remove image"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}