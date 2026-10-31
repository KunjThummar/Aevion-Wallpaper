import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('aevion_admin_token') : null;

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('aevion@admin2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/Aevion@1277/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/admin/login', { username, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('aevion_admin_token', res.data.token);
        navigate('/Aevion@1277/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Logo size="md" className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mt-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Studio Portal</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Administrative Login
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to manage wallpapers, categories, advertisements, and reports.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Admin Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Default password: <code className="font-mono bg-slate-100 dark:bg-dark-surface px-1 py-0.5 rounded">aevion@admin2026</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
