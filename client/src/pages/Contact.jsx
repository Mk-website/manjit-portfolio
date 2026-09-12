import { useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

const initialForm = { name: '', email: '', subject: '', body: '', website: '' };

export default function Contact() {
  const profileState = useApiData(api.profile.get, fallbackProfile);
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ status: 'idle', message: '' });

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    if (form.website) return;

    setState({ status: 'loading', message: '' });

    try {
      await api.messages.post({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        body: form.body.trim(),
      });

      setForm(initialForm);
      setState({ status: 'success', message: 'Message sent. I will get back to you soon.' });
    } catch (error) {
      setState({
        status: 'error',
        message: error.response?.data?.message || 'Unable to send your message right now. Please try again.',
      });
    }
  }

  const profile = profileState.data || fallbackProfile;

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="08 / contact channel" title="Start a conversation">
        For firmware, wireless, IoT, or embedded engineering opportunities.
      </PageHeader>
      <ApiNotice error={profileState.error} retry={profileState.retry} />

      <div className="contact-grid">
        <aside className="panel contact-card tech-grid">
          <p className="eyebrow">Direct channels</p>
          <div className="direct-list">
            {profile.email && (
              <a className="contact-link" href={`mailto:${profile.email}`}>
                <Mail size={18} style={{ color: 'var(--accent)' }} />
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a className="contact-link" href={`tel:${profile.phone}`}>
                <Phone size={18} style={{ color: 'var(--accent)' }} />
                {profile.phone}
              </a>
            )}
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            Use the form for a focused introduction, opportunity, or project conversation.
          </p>
        </aside>

        <form onSubmit={submit} className="panel form-card">
          <p className="eyebrow">Project inquiry</p>
          <h2>Tell me about your build.</h2>

          <div className="field-grid">
            <Field label="Name" name="name" value={form.name} onChange={update} placeholder="Your name" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" />
          </div>

          <div className="field-group">
            <Field label="Subject" name="subject" value={form.subject} onChange={update} placeholder="Project or opportunity" />
          </div>

          <div className="field-group">
            <label className="field-label">
              Message
              <textarea
                required
                name="body"
                value={form.body}
                onChange={update}
                className="textarea"
                placeholder="Write your message..."
              />
            </label>
          </div>

          <input
            tabIndex="-1"
            autoComplete="off"
            name="website"
            value={form.website}
            onChange={update}
            className="honeypot"
            aria-hidden="true"
          />

          <div className="form-actions">
            <button type="submit" disabled={state.status === 'loading'} className="btn btn-primary" style={{ minWidth: '10rem' }}>
              {state.status === 'loading' ? 'Sending...' : <><Send size={16} />Send</>}
            </button>
            {state.message && (
              <div className={`form-status ${state.status === 'success' ? 'success' : 'error'}`}>
                {state.message}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="field-label">
      {label}
      <input
        required
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
      />
    </label>
  );
}
