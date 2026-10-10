import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { Mail, Car, ArrowRight, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react';
import DemoLoginSection from '../../components/DemoLoginSection';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';

export const DriverLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginDriver } = useContext(DriverAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await loginDriver(email, password);
    if (success) {
      navigate('/driver/dashboard');
    } else {
      setError('Invalid driver credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoEmail, demoPassword, data) => {
    if (data && data.token) {
      navigate('/driver/dashboard');
    } else {
      setEmail(demoEmail);
      setPassword(demoPassword);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex bg-background">
      {/* ── Left Branded Panel (Desktop) ───────────────── */}
      <div className="hidden lg:flex w-[44%] bg-[#0B1220] text-white p-14 flex-col justify-between relative overflow-hidden border-r border-[#1F2A44] select-none">
        <div className="relative z-10">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white mb-8 shadow-sm">
            <Car size={20} />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-hover">
              Driver Operations Console
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            Monetize empty seats on your daily commute routes.
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-10">
            Accept on-demand broadcasts nearby or publish scheduled carpools. Control your route, pricing, and availability.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <IndianRupee size={16} className="text-primary shrink-0" />
              <span>Full control over your seat prices and scheduled routes</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-primary shrink-0" />
              <span>Instant on-demand matching broadcasts within your area</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span>Verified passenger accounts and real-time navigation telemetry</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#1F2A44] text-[11px] text-slate-400">
          CarPool Driver Operations · Partner Authentication
        </div>
      </div>

      {/* ── Right Form Container ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Role Segmented Switcher */}
          <div className="flex rounded-md p-1 bg-border-subtle border border-border mb-6">
            <Link
              to="/login"
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
              Driver Sign In
            </h2>
            <p className="text-text-secondary mt-1 text-xs">
              Access your driver console, live GPS dispatch, and rides.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 text-xs font-medium text-danger bg-danger-subtle border border-red-200 dark:border-red-900/40 p-3 rounded-md"
            >
              {error}
            </div>
          )}

          {/* Driver Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              id="driver-email"
              name="email"
              label="Driver Email Address"
              type="email"
              autoComplete="email"
              placeholder="driver@example.com"
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              id="driver-password"
              name="password"
              label="Password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              rightIcon={ArrowRight}
              className="mt-2"
            >
              Sign In to Console
            </Button>
          </form>

          {/* Driver Demo Shortcuts */}
          <DemoLoginSection type="driver" onSelectFill={handleDemoFill} />

          {/* Driver Registration Link */}
          <p className="mt-5 text-center text-xs text-text-secondary">
            New driver partner?{' '}
            <Link to="/driver/register" className="font-semibold text-primary hover:underline">
              Register as Driver
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
