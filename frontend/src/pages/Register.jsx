import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, ArrowRight, ShieldCheck, CheckCircle2, Navigation, Car } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/users', { name, email, password });
      toast.success('Account created successfully! Welcome to CarPool.');
      login(
        { name: data.name, email: data.email, _id: data._id, role: data.role, picture: data.picture },
        data.token
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
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

  return (
    <div className="min-h-[calc(100vh-68px)] flex bg-background">
      {/* ── Left Branded Panel (Desktop) ───────────────── */}
      <div className="hidden lg:flex w-[44%] bg-[#192A20] text-white p-14 flex-col justify-between relative overflow-hidden border-r border-[#24382D] select-none">
        <div className="relative z-10">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white mb-8 shadow-sm">
            <Car size={20} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D2E2D8] mb-2 block">
            Join the Network
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            Reliable shared travel with everyday community members.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-10">
            Create an account to book seats on scheduled intercity rides or request instant on-demand pickups in your city.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-primary shrink-0" />
              <span>Zero hidden platform charges — pay direct seat fare</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Navigation size={16} className="text-primary shrink-0" />
              <span>Real-time GPS vehicle monitoring during rides</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span>Verified identity and one-way rider ratings</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#24382D] text-[11px] text-slate-400">
          CarPool Mobility Platform · Passenger Onboarding
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
              to="/driver/register"
              className="flex-1 py-1.5 text-xs font-semibold rounded text-text-secondary hover:text-text-primary text-center transition-colors"
            >
              Driver Partner
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Create Passenger Account
            </h2>
            <p className="text-text-secondary mt-1 text-xs">
              Sign up in seconds to start finding and booking rides.
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              id="name"
              name="name"
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Aditi Mehta"
              leftIcon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              autoComplete="new-password"
              placeholder="At least 6 characters"
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
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center my-4">
            <div className="flex-grow border-t border-border" />
            <span className="shrink mx-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              OR
            </span>
            <div className="flex-grow border-t border-border" />
          </div>

          {/* Google Sign-Up */}
          <div className="mb-4">
            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={setError} text="Sign up with Google" />
          </div>

          {/* Sign in link */}
          <p className="mt-5 text-center text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
