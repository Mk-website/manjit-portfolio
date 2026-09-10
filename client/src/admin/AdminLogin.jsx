import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState({ checking: true, ok: false });
  const navigate = useNavigate();

  useEffect(() => {
    api.auth.me()
      .then(() => setSession({ checking: false, ok: true }))
      .catch(() => setSession({ checking: false, ok: false }));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  }

  if (session.checking) {
    return <div className="min-h-screen grid place-items-center text-gray-300">Checking session...</div>;
  }

  if (session.ok) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid place-items-center bg-bg">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-6">
        <h1 className="text-xl font-bold text-white">Admin login</h1>
        <p className="mt-1 text-sm text-gray-400">Use the super-admin credentials from environment variables.</p>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 w-full rounded-md border border-card-border bg-card px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input required type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="mt-1 w-full rounded-md border border-card-border bg-card px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit" className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
