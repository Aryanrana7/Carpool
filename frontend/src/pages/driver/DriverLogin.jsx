import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { Mail, Lock, Car, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DriverLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginDriver } = useContext(DriverAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginDriver(email, password);
    if (success) navigate('/driver/dashboard');
    else setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8f8f8] dark:bg-[#0c0c0c] p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
      >
        {/* Icon + header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Car size={26} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Driver Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Access your driver dashboard.</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="driver@example.com" required className="input-base pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="input-base pl-10" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-success w-full py-3.5 text-sm mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</span>
              ) : (
                <span className="flex items-center gap-2">Sign in <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-[#1e1e1e] text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              New driver?{' '}
              <Link to="/driver/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            ← Back to passenger login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverLogin;
