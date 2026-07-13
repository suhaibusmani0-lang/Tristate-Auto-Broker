import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, User } from 'lucide-react';
import { useAuth } from '../lib/auth';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <img src="/logo.webp" alt="Tri State Auto Brokers" className="h-16" />
        </Link>

        <div className="bg-[#111] border border-white/10 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <div className="w-14 h-[2px] bg-[#0055ff] mx-auto mt-3"></div>
            <p className="text-gray-400 text-sm mt-3">Sign in to manage inventory and view submissions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-1">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#0055ff] text-white pl-10 pr-3 py-3 outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#0055ff] text-white pl-10 pr-3 py-3 outline-none"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#0055ff] hover:bg-[#0038a8] disabled:opacity-50 text-white font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn size={16} />
              {busy ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-xs text-gray-500 text-center">
            <Link to="/" className="text-[#0055ff] hover:underline inline-block">\u2190 Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;