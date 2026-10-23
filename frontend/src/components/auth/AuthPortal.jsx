import React, { useState, useContext, useEffect } from 'react';
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
import AuthPromoBanner from './AuthPromoBanner';

// Curated high-resolution dynamic backdrops for each portal that rotate on every refresh
export const PASSENGER_BACKGROUNDS = [
  {
    url: '/images/auth-passenger-1.jpg',
    title: 'Alpine Peak Highway',
    subtitle: 'Expansive scenic journey towards mountain peaks',
  },
  {
    url: '/images/auth-passenger-2.jpg',
    title: 'Autumn Forest Scenic Route',
    subtitle: 'Peaceful morning commute under golden maple canopies',
  },
  {
    url: '/images/auth-passenger-3.jpg',
    title: 'Red Rock Canyon Road Trip',
    subtitle: 'Classic open-road travel through dramatic sandstone passes',
  },
  {
    url: '/images/auth-passenger-4.jpg',
    title: 'Highland Valley Pass',
    subtitle: 'Misty sunrise vistas across lush emerald hills',
  },
];

export const DRIVER_BACKGROUNDS = [
  {
    url: '/images/auth-driver-1.jpg',
    title: 'Lake Tahoe Highway Drive',
    subtitle: 'Behind the wheel with morning golden sun',
  },
  {
    url: '/images/auth-driver-2.jpg',
    title: 'Pacific Coast Bridge',
    subtitle: 'Iconic scenic coastal bridge dispatch route',
  },
  {
    url: '/images/auth-driver-3.jpg',
    title: 'Autumn Alpine Valley Pass',
    subtitle: 'Crisp mountain valley pass morning commute',
  },
];

/**
 * Retrieves and increments the index on every page refresh using sessionStorage,
 * ensuring the user sees a new background each time they refresh the portal.
 */
const getNextIndexOnLoad = (storageKey, total) => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    let next;
    if (raw !== null) {
      next = (parseInt(raw, 10) + 1) % total;
    } else {
      next = Math.floor(Math.random() * total);
    }
    sessionStorage.setItem(storageKey, next.toString());
    return next;
  } catch {
    return Math.floor(Math.random() * total);
  }
};

/**
 * High-End Unified AuthPortal for Passenger and Driver Partner.
 * Features automatic scenery rotation after every refresh, full-bleed panoramic backdrop,
 * zero gaps, authentic hero matching user reference, and sleek glassmorphic login card.
 */
export const AuthPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const isDriver = location.pathname.startsWith('/driver');

  // Dynamic Background State - Advances on every browser refresh
  const [passengerBgIndex] = useState(() =>
    getNextIndexOnLoad('carpool_auth_passenger_bg_idx', PASSENGER_BACKGROUNDS.length)
  );

  const [driverBgIndex] = useState(() =>
    getNextIndexOnLoad('carpool_auth_driver_bg_idx', DRIVER_BACKGROUNDS.length)
  );

  // Prefetch all portal backdrops so switching and refreshing are instant
  useEffect(() => {
    const allImages = [...PASSENGER_BACKGROUNDS, ...DRIVER_BACKGROUNDS];
    allImages.forEach((item) => {
      const img = new Image();
      img.src = item.url;
    });
  }, []);

  const activeBgList = isDriver ? DRIVER_BACKGROUNDS : PASSENGER_BACKGROUNDS;
  const activeBgIndex = isDriver ? driverBgIndex : passengerBgIndex;
  const activeBgItem = activeBgList[activeBgIndex % activeBgList.length];

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

  return (
    <div className="min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] w-full flex flex-col lg:flex-row relative overflow-hidden bg-background">
      {/* ── FULL-BLEED ROTATING SCENIC BACKGROUND (CHANGES EVERY REFRESH) ────── */}
      <div className="absolute inset-0 bg-slate-900 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeBgItem.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeBgItem.url})` }}
          />
        </AnimatePresence>
      </div>

      {/* ── BALANCED GRADIENT OVERLAYS FOR CRISP READABILITY ────── */}
      {/* Left side daylight soft fade for hero text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-[#0E1712]/95 dark:via-[#0E1712]/80 dark:to-transparent lg:w-[65%]" />
      {/* Bottom and overall subtle tint */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40 pointer-events-none" />

      {/* ── LEFT COLUMN: AUTH PROMO HERO (MATCHING USER REFERENCE) ────── */}
      <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col self-stretch order-2 lg:order-1 relative z-10 overflow-y-auto lg:overflow-hidden">
        <AuthPromoBanner
          role={isDriver ? 'driver' : 'passenger'}
          onRoleSwitch={(targetRole) => {
            navigate(targetRole === 'driver' ? '/driver/login' : '/login');
          }}
        />
      </div>

      {/* ── RIGHT COLUMN: SLEEK GLASSMORPHIC LOGIN CARD ────── */}
      <div className="w-full lg:w-[42%] xl:w-[40%] flex items-center justify-center self-stretch p-4 sm:p-6 lg:p-6 xl:p-8 relative z-20 order-1 lg:order-2 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-[420px] backdrop-blur-2xl bg-white dark:bg-[#121f18] border border-slate-200/90 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.18)] rounded-3xl p-5 sm:p-6 text-text-primary transition-all duration-300">
          {/* Role Segmented Switcher with smooth sliding active pill */}
          <div className="relative flex rounded-xl p-1 bg-[#F1EFEA] dark:bg-[#1D2B22] border border-border/70 mb-3.5 select-none shadow-inner">
            <button
              type="button"
              onClick={() => {
                if (isDriver) navigate('/login');
              }}
              className={`relative flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer z-10 ${
                !isDriver
                  ? 'text-[#133E2B] dark:text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {!isDriver && (
                <motion.div
                  layoutId="auth-active-role-pill"
                  className="absolute inset-0 bg-white dark:bg-[#25392D] rounded-lg shadow-sm border border-border/50 -z-10"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              Passenger
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isDriver) navigate('/driver/login');
              }}
              className={`relative flex-1 py-1.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer z-10 ${
                isDriver
                  ? 'text-[#133E2B] dark:text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {isDriver && (
                <motion.div
                  layoutId="auth-active-role-pill"
                  className="absolute inset-0 bg-white dark:bg-[#25392D] rounded-lg shadow-sm border border-border/50 -z-10"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              Driver Partner
            </button>
          </div>

          {/* Form Content with Smooth Cross-Fade */}
          <AnimatePresence mode="wait" initial={false}>
            {!isDriver ? (
              <motion.div
                key="passenger-form-content"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              >
                {/* Heading & Subtitle */}
                <div className="mb-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#112F21] dark:text-[#E8F2EC]">
                    Passenger Sign In
                  </h2>
                  <p className="text-text-secondary mt-0.5 text-xs">
                    Enter your credentials to book rides and track routes.
                  </p>
                </div>

                {passengerError && (
                  <div
                    role="alert"
                    className="mb-3 text-xs font-medium text-danger bg-danger-subtle border border-danger/20 p-2.5 rounded-xl"
                  >
                    {passengerError}
                  </div>
                )}

                {/* Passenger Form */}
                <form onSubmit={handlePassengerSubmit} className="space-y-2.5">
                  <Input
                    id="passenger-email"
                    name="email"
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    leftIcon={Mail}
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    required
                    className="h-10 bg-white/90 dark:bg-surface border-border rounded-xl text-xs sm:text-sm"
                  />

                  <PasswordInput
                    id="passenger-password"
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={passengerPassword}
                    onChange={(e) => setPassengerPassword(e.target.value)}
                    required
                    className="h-10 bg-white/90 dark:bg-surface border-border rounded-xl text-xs sm:text-sm"
                  />

                  <button
                    type="submit"
                    disabled={passengerLoading}
                    className="w-full h-10 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  >
                    {passengerLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider labelled OR */}
                <div className="relative flex py-0.5 items-center my-2">
                  <div className="flex-grow border-t border-border/80" />
                  <span className="shrink mx-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    OR
                  </span>
                  <div className="flex-grow border-t border-border/80" />
                </div>

                {/* Google Sign-In */}
                <div className="mb-2">
                  <GoogleSignInButton
                    onSuccess={handleGoogleSuccess}
                    onError={setPassengerError}
                    text="Continue with Google"
                  />
                </div>

                {/* Quick Demo Access (Compact) */}
                <DemoLoginSection
                  type="passenger"
                  onSelectFill={handlePassengerDemoFill}
                  compact={true}
                />

                {/* Registration Link */}
                <p className="mt-3 text-center text-xs text-text-secondary">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-[#134E35] dark:text-primary hover:underline">
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
                {/* Driver Heading & Subtitle */}
                <div className="mb-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#112F21] dark:text-[#E8F2EC]">
                    Driver Partner Sign In
                  </h2>
                  <p className="text-text-secondary mt-0.5 text-xs">
                    Access your driver console, live dispatch, and empty seats.
                  </p>
                </div>

                {driverError && (
                  <div
                    role="alert"
                    className="mb-3 text-xs font-medium text-danger bg-danger-subtle border border-danger/20 p-2.5 rounded-xl"
                  >
                    {driverError}
                  </div>
                )}

                {/* Driver Credentials Form */}
                <form onSubmit={handleDriverSubmit} className="space-y-2.5">
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
                    className="h-10 bg-white/90 dark:bg-surface border-border rounded-xl text-xs sm:text-sm"
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
                    className="h-10 bg-white/90 dark:bg-surface border-border rounded-xl text-xs sm:text-sm"
                  />

                  <button
                    type="submit"
                    disabled={driverLoading}
                    className="w-full h-10 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                  >
                    {driverLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Console</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                {/* Driver Quick Demo Shortcuts (Compact) */}
                <DemoLoginSection
                  type="driver"
                  onSelectFill={handleDriverDemoFill}
                  compact={true}
                />

                {/* Driver Registration Link */}
                <p className="mt-3 text-center text-xs text-text-secondary">
                  New driver partner?{' '}
                  <Link to="/driver/register" className="font-bold text-[#134E35] dark:text-primary hover:underline">
                    Register as Driver
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
