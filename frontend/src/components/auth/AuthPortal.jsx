import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import api from '../../services/api';
import GoogleSignInButton from '../GoogleSignInButton';
import DemoLoginSection from '../DemoLoginSection';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
import Button from '../ui/Button';
import AuthPromoPanel from './AuthPromoPanel';

/**
 * Shared AuthPortal component for Passenger and Driver authentication.
 * Features:
 * - Fluid directional transition when switching between Passenger and Driver portals
 *   - Passenger → Driver: Promo panel slides from LEFT to RIGHT; Auth form slides from RIGHT to LEFT.
 *   - Driver → Passenger: Promo panel slides from RIGHT to LEFT; Auth form slides from LEFT to RIGHT.
 * - Easing: cubic-bezier(0.22, 1, 0.36, 1), duration ~420ms
 * - Zero horizontal scrollbars (overflow-x-hidden)
 * - Mobile responsive: compact stacked layout with auth form always top-accessible
 * - Respects prefers-reduced-motion
 * - High-contrast, non-glitchy button states
 */
export const AuthPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const isDriver = location.pathname.startsWith('/driver');

  // Passenger Auth State
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPassword, setPassengerPassword] = useState('');
  const [passengerError, setPassengerError] = useState('');
  const [passengerLoading, setPassengerLoading] = useState(false);
  const { login: passengerLogin } = useContext(AuthContext);

  // Driver Auth State
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverError, setDriverError] = useState('');
  const [driverLoading, setDriverLoading] = useState(false);
  const { loginDriver } = useContext(DriverAuthContext);

  // Passenger Handlers
  const handlePassengerSubmit = async (e) => {
    e.preventDefault();
    setPassengerError('');
    setPassengerLoading(true);
    try {
      const { data } = await api.post('/users/login', {
        email: passengerEmail,
        password: passengerPassword,
      });
      passengerLogin(
        { name: data.name, email: data.email, _id: data._id, role: data.role, picture: data.picture },
        data.token
      );
      navigate('/');
    } catch (err) {
      setPassengerError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setPassengerLoading(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    passengerLogin(
      { name: userData.name, email: userData.email, _id: userData._id, role: userData.role, picture: userData.picture },
      userData.token
    );
    navigate('/');
  };

  const handlePassengerDemoFill = (demoEmail, demoPassword, data) => {
    if (data && data.token) {
      passengerLogin(
        { name: data.name, email: data.email, _id: data._id, role: data.role, picture: data.picture },
        data.token
      );
      navigate('/');
    } else {
      setPassengerEmail(demoEmail);
      setPassengerPassword(demoPassword);
    }
  };

  // Driver Handlers
  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    setDriverError('');
    setDriverLoading(true);
    try {
      const success = await loginDriver(driverEmail, driverPassword);
      if (success) {
        navigate('/driver/dashboard');
      } else {
        setDriverError('Invalid driver credentials. Please verify your email and password.');
      }
    } catch (err) {
      setDriverError(err.response?.data?.message || 'Driver login failed. Please verify your credentials.');
    } finally {
      setDriverLoading(false);
    }
  };

  const handleDriverDemoFill = (demoEmail, demoPassword, data) => {
    if (data && data.token) {
      navigate('/driver/dashboard');
    } else {
      setDriverEmail(demoEmail);
      setDriverPassword(demoPassword);
    }
  };

  // Directional Animation Transition settings (400ms, cubic-bezier(0.22, 1, 0.36, 1))
  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

  // Promotional Panel Node
  const promoPanelNode = (
    <motion.div
      key="auth-promo-panel-wrapper"
      layout="position"
      transition={layoutTransition}
      className={`w-full lg:w-[45%] shrink-0 flex flex-col self-stretch min-h-[calc(100vh-68px)] order-2 lg:order-none ${
        isDriver ? 'lg:border-l lg:border-t-0 border-t border-[#25382F]' : 'lg:border-r lg:border-t-0 border-t border-[#25382F]'
      }`}
    >
      <AuthPromoPanel role={isDriver ? 'driver' : 'passenger'} />
    </motion.div>
  );

  // Authentication Form Panel Node
  const authFormPanelNode = (
    <motion.div
      key="auth-form-panel-wrapper"
      layout="position"
      transition={layoutTransition}
      className="flex-1 w-full lg:w-[55%] flex items-center justify-center self-stretch min-h-[calc(100vh-68px)] p-6 sm:p-10 lg:p-12 overflow-y-auto order-1 lg:order-none"
    >
      <div className="w-full max-w-[400px]">
        {/* Role Segmented Switcher with sliding animated pill */}
        <div className="relative flex rounded-lg p-1 bg-border-subtle border border-border mb-6 select-none">
          <button
            type="button"
            onClick={() => {
              if (isDriver) navigate('/login');
            }}
            className={`relative flex-1 py-2 text-xs font-bold rounded-md text-center transition-colors cursor-pointer z-10 ${
              !isDriver ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {!isDriver && (
              <motion.div
                layoutId="active-role-pill"
                className="absolute inset-0 bg-surface rounded-md shadow-sm border border-border/50 -z-10"
                transition={layoutTransition}
              />
            )}
            Passenger
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isDriver) navigate('/driver/login');
            }}
            className={`relative flex-1 py-2 text-xs font-bold rounded-md text-center transition-colors cursor-pointer z-10 ${
              isDriver ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {isDriver && (
              <motion.div
                layoutId="active-role-pill"
                className="absolute inset-0 bg-surface rounded-md shadow-sm border border-border/50 -z-10"
                transition={layoutTransition}
              />
            )}
            Driver Partner
          </button>
        </div>

        {/* Dynamic Form Content with smooth cross-fade */}
        <AnimatePresence mode="wait" initial={false}>
          {!isDriver ? (
            <motion.div
              key="passenger-form-content"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  Passenger Sign In
                </h2>
                <p className="text-text-secondary mt-1 text-xs">
                  Enter your credentials to manage rides and bookings.
                </p>
              </div>

              {passengerError && (
                <div
                  role="alert"
                  className="mb-4 text-xs font-medium text-danger bg-danger-subtle border border-red-200 dark:border-red-900/40 p-3 rounded-md"
                >
                  {passengerError}
                </div>
              )}

              {/* Passenger Credentials Form */}
              <form onSubmit={handlePassengerSubmit} className="space-y-3.5">
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  leftIcon={Mail}
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                />

                <PasswordInput
                  id="password"
                  name="password"
                  label="Password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={passengerPassword}
                  onChange={(e) => setPassengerPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={passengerLoading}
                  rightIcon={ArrowRight}
                  className="mt-2"
                >
                  Sign In
                </Button>
              </form>

              {/* Divider labelled OR */}
              <div className="relative flex py-2 items-center my-4">
                <div className="flex-grow border-t border-border" />
                <span className="shrink mx-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  OR
                </span>
                <div className="flex-grow border-t border-border" />
              </div>

              {/* Google Sign-In */}
              <div className="mb-4">
                <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={setPassengerError} text="Continue with Google" />
              </div>

              {/* Demo Shortcuts */}
              <DemoLoginSection type="passenger" onSelectFill={handlePassengerDemoFill} />

              {/* Registration Link */}
              <p className="mt-5 text-center text-xs text-text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="driver-form-content"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  Driver Sign In
                </h2>
                <p className="text-text-secondary mt-1 text-xs">
                  Access your driver console, live GPS dispatch, and rides.
                </p>
              </div>

              {driverError && (
                <div
                  role="alert"
                  className="mb-4 text-xs font-medium text-danger bg-danger-subtle border border-red-200 dark:border-red-900/40 p-3 rounded-md"
                >
                  {driverError}
                </div>
              )}

              {/* Driver Credentials Form */}
              <form onSubmit={handleDriverSubmit} className="space-y-3.5">
                <Input
                  id="driver-email"
                  name="email"
                  label="Driver Email Address"
                  type="email"
                  autoComplete="email"
                  placeholder="driver@example.com"
                  leftIcon={Mail}
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  required
                />

                <PasswordInput
                  id="driver-password"
                  name="password"
                  label="Password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={driverLoading}
                  rightIcon={ArrowRight}
                  className="mt-2"
                >
                  Sign In to Console
                </Button>
              </form>

              {/* Driver Demo Shortcuts */}
              <DemoLoginSection type="driver" onSelectFill={handleDriverDemoFill} />

              {/* Driver Registration Link */}
              <p className="mt-5 text-center text-xs text-text-secondary">
                New driver partner?{' '}
                <Link to="/driver/register" className="font-semibold text-primary hover:underline">
                  Register as Driver
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[calc(100vh-68px)] w-full flex flex-col lg:flex-row bg-background overflow-x-hidden relative">
      {/* On desktop: Passenger has Promo first (Left), Auth second (Right)
                     Driver has Auth first (Left), Promo second (Right) */}
      {!isDriver ? (
        <>
          {promoPanelNode}
          {authFormPanelNode}
        </>
      ) : (
        <>
          {authFormPanelNode}
          {promoPanelNode}
        </>
      )}
    </div>
  );
};

export default AuthPortal;
