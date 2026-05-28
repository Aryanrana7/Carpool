import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { User, Mail, Lock, Car, Hash, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Field = ({ label, type = 'text', name, value, onChange, placeholder, icon: Icon, required = true }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="input-base pl-10"
      />
    </div>
  </div>
);

const perks = ['Earn on your own schedule', 'Set your own routes & prices', 'Instant payment settlements'];

const DriverRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', carModel: '', carNumber: '' });
  const [loading, setLoading] = useState(false);
  const { registerDriver } = useContext(DriverAuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await registerDriver(formData);
    if (success) navigate('/driver/dashboard');
    else setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[42%] bg-[#0d1a13] items-center justify-center p-16 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-teal-600/20" />
        <div className="relative z-10 max-w-sm text-white">
          <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-8">
            <Car size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Drive. Earn.<br />Repeat.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Join thousands of drivers who earn on their terms with our two-sided marketplace.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-emerald-400" />
                </div>
                <p className="text-sm text-gray-300">{p}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f8f8] dark:bg-[#0c0c0c] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px]"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Create driver account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-0">
            {/* Personal info section */}
            <div className="card p-6 mb-4 space-y-4">
              <p className="section-label mb-1">Personal Info</p>
              <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} />
              <Field label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="driver@example.com" icon={Mail} />
              <Field label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" icon={Lock} />
            </div>

            {/* Vehicle info section */}
            <div className="card p-6 mb-6 space-y-4">
              <p className="section-label mb-1">Vehicle Details</p>
              <Field label="Car Model" name="carModel" value={formData.carModel} onChange={handleChange} placeholder="e.g. Toyota Camry 2022" icon={Car} />
              <Field label="License Plate" name="carNumber" value={formData.carNumber} onChange={handleChange} placeholder="e.g. KA-01-AB-1234" icon={Hash} />
              <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3.5 rounded-xl">
                <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Accurate vehicle details help passengers identify your car quickly.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-success w-full py-4 text-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</span>
              ) : (
                <span className="flex items-center gap-2">Register as Driver <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Already a driver?{' '}
            <Link to="/driver/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverRegister;
