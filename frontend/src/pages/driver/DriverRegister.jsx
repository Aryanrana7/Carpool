import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { User, Mail, Car, Hash, ArrowRight, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';

export const DriverRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    carModel: '',
    carNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerDriver } = useContext(DriverAuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.carModel || !formData.carNumber) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await registerDriver(formData);
    if (result?.success) {
      navigate('/driver/dashboard');
    } else {
      setError(result?.error || 'Driver registration failed. Please verify your details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex bg-background">
      {/* ── Left Registration Form (mirrors Driver Portal) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Role Segmented Switcher */}
          <div className="flex rounded-md p-1 bg-border-subtle border border-border mb-6">
            <Link
              to="/register"
              className="flex-1 py-1.5 text-xs font-semibold rounded text-text-secondary hover:text-text-primary text-center transition-colors"
            >
              Passenger
            </Link>
            <button
              type="button"
              className="flex-1 py-1.5 text-xs font-semibold rounded bg-surface text-text-primary shadow-subtle text-center"
            >
              Driver Partner
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Register as Driver
            </h2>
            <p className="text-text-secondary mt-1 text-xs">
              Enter your profile and vehicle details to get started.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 text-xs font-medium text-danger bg-danger-subtle border border-error/20 p-3 rounded-md"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Details */}
            <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
              <span className="micro-label">Account Details</span>

              <Input
                id="driver-name"
                name="name"
                label="Full Name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Rahul Sharma"
                leftIcon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                id="driver-reg-email"
                name="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="driver@example.com"
                leftIcon={Mail}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <PasswordInput
                id="driver-reg-password"
                name="password"
                label="Password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Vehicle Details */}
            <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
              <span className="micro-label">Vehicle Details</span>

              <Input
                id="carModel"
                name="carModel"
                label="Vehicle Make & Model"
                type="text"
                placeholder="e.g. Maruti Suzuki Swift"
                leftIcon={Car}
                value={formData.carModel}
                onChange={handleChange}
                required
              />

              <Input
                id="carNumber"
                name="carNumber"
                label="Registration Plate Number"
                type="text"
                placeholder="e.g. CH-01-AB-1234"
                leftIcon={Hash}
                value={formData.carNumber}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              rightIcon={ArrowRight}
              className="mt-2"
            >
              Register as Driver
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-text-secondary">
            Already registered as a driver?{' '}
            <Link to="/driver/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Branded Panel (mirrors Driver Portal) ────── */}
      <div className="hidden lg:flex w-[44%] bg-[#192A20] text-white p-14 flex-col justify-between relative overflow-hidden border-l border-[#24382D] select-none">
        <div className="relative z-10">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white mb-8 shadow-sm">
            <Car size={20} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D2E2D8] mb-2 block">
            Partner Program
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            Earn flexibly by offering rides on your existing routes.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-10">
            Publish your daily commute or intercity schedule, choose your seat price, and get matched with verified riders.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <IndianRupee size={16} className="text-primary shrink-0" />
              <span>Direct per-seat pricing with transparent settlements</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-primary shrink-0" />
              <span>Full control over your schedule and accept/decline choices</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span>Safe ride network with verified passengers</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#24382D] text-[11px] text-slate-400">
          CarPool Mobility Platform · Driver Partner Registration
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
