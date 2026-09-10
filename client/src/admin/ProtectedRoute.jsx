import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api.js';

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, ok: false });
  useEffect(() => {
    api.auth.me()
      .then(() => setState({ loading: false, ok: true }))
      .catch(() => setState({ loading: false, ok: false }));
  }, []);
  if (state.loading) return <div className="min-h-screen grid place-items-center text-gray-300">Loading admin session...</div>;
  return state.ok ? children : <Navigate to="/admin/login" replace />;
}
