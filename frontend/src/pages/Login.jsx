import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Car, ArrowRight, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import DemoLoginSection from '../components/DemoLoginSection';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', { email, password });
      login(
        { name: data.name, email: data.email, _id: data._id, role: data.role, picture: data.picture },
        data.token
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    login(
      { name: userData.name, email: userData.email, _id: userData._id, role: userData.role, picture: userData.picture },
      userData.token
    );
    navigate('/');
  };

  const handleDemoFill = (demoEmail, demoPassword, data) => {
    if (data && data.token) {
      login(
        { name: data.name, email: data.email, _id: data._id, role: data.role, picture: data.picture },
        data.token
      );
      navigate('/');
    } else {
      setEmail(demoEmail);
      setPassword(demoPassword);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] flex bg-background">
      {/* ── Left Branded Panel (Desktop) ───────────────── */}
      <div className="hidden lg:flex w-[44%] bg-[#0B1220] text-white p-14 flex-col justify-between relative overflow-hidden border-r border-[#1F2A44] select-none">
        {/* Abstract SVG Route Network Graphic */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="150" cy="150" r="8" fill="currentColor" />
            <circle cx="450" cy="180" r="8" fill="currentColor" />
            <circle cx="300" cy="380" r="8" fill="currentColor" />
            <circle cx="480" cy="480" r="8" fill="currentColor" />
            <path d="M150 150 Q 300 120 450 180" strokeDasharray="4 4" />
            <path d="M150 150 Q 200 300 300 380" />
            <path d="M450 180 Q 400 300 300 380" strokeDasharray="6 6" />
            <path d="M300 380 Q 400 450 480 480" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white mb-8 shadow-sm">
            <Car size={20} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-primary-hover mb-2 block">
            Ride Sharing Platform
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            Smart, coordinated rides on everyday routes.
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-10">
            Connect with verified drivers already traveling your way. Enjoy transparent pricing, scheduled carpools, and live GPS tracking.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-primary shrink-0" />
              <span>Transparent seat pricing with zero hidden surcharges</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Navigation size={16} className="text-primary shrink-0" />
              <span>Real-time trip tracking with live vehicle telemetry</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span>Verified community members and ratings</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#1F2A44] text-[11px] text-slate-400">
          Secure JWT authentication with role-separated portals.
        </div>
      </div>

      {/* ── Right Form Container ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Role Segmented Switcher */}
          <div className="flex rounded-md p-1 bg-border-subtle border border-border mb-6">
            <button
              type="button"
              className="flex-1 py-1.5 text-xs font-semibold rounded bg-surface text-text-primary shadow-subtle text-center"
            >
              Passenger
            </button>
            <Link
              to="/driver/login"
              className="flex-1 py-1.5 text-xs font-semibold rounded text-text-secondary hover:text-text-primary text-center transition-colors"
            >
              Driver Partner
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Passenger Sign In
            </h2>
            <p className="text-text-secondary mt-1 text-xs">
              Enter your credentials to manage rides and bookings.
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

          {/* Google Sign-In */}
          <div className="mb-4">
            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={setError} text="Continue with Google" />
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-border" />
            <span className="shrink mx-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              or with email
            </span>
            <div className="flex-grow border-t border-border" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              id="password"
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
              Sign In
            </Button>
          </form>

          {/* Demo Shortcuts */}
          <DemoLoginSection type="passenger" onSelectFill={handleDemoFill} />

          {/* Registration link */}
          <p className="mt-5 text-center text-xs text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
