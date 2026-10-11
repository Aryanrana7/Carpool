import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { Mail, ArrowRight } from 'lucide-react';
import DemoLoginSection from '../../components/DemoLoginSection';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import AuthPromoPanel from '../../components/auth/AuthPromoPanel';

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
    <div className="min-h-[calc(100vh-68px)] flex flex-col lg:flex-row bg-background">
      {/* ── Left Form Container (Desktop: Left, Mobile: Primary Top) ───────── */}
      <div className="order-1 lg:order-1 flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
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

        {/* ── Right Branded Promotional Panel (Desktop: Right, Mobile: Secondary) ── */}
        <AuthPromoPanel
          role="driver"
          className="order-2 lg:order-2 lg:border-l border-[#25382F]"
        />
      </div>
    );
  };

export default DriverLogin;
