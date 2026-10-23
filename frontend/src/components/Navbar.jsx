import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, Compass, Calendar, LogOut, ArrowRight, ChevronDown, HelpCircle, Info, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { CarPoolLogo } from './ui/CarPoolLogo';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  const isAuthRoute = pathname === '/login' || pathname === '/driver/login';
  const isDriverAuth = pathname === '/driver/login';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[1100] h-[68px] flex items-center px-4 sm:px-8 transition-colors ${
        isAuthRoute
          ? 'bg-white/85 dark:bg-[#0E1712]/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-xs'
          : 'bg-surface/95 backdrop-blur-md border-b border-border shadow-xs'
      }`}>
        {/* Brand Lockup: Two-person logo icon + CarPool wordmark */}
        <Link
          to="/"
          aria-label="CarPool home"
          className="flex items-center gap-[10px] mr-6 sm:mr-8 shrink-0 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg py-1 select-none"
        >
          <CarPoolLogo className="h-7 sm:h-8 w-auto shrink-0" />
          <span className="text-lg sm:text-[20px] font-heading font-bold text-ink leading-none tracking-tight">
            CarPool
          </span>
        </Link>

        {/* Desktop Navigation Links — Matching Reference Bar */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          <Link
            to={isAuthRoute ? '/login' : '/'}
            className={`
              px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2
              ${(pathname === '/' || pathname === '/login')
                ? 'bg-primary-subtle text-primary font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
              }
            `}
          >
            <Compass size={15} />
            <span>Find a Ride</span>
          </Link>

          {user && !isAuthRoute && (
            <Link
              to="/my-rides"
              className={`
                px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2
                ${pathname === '/my-rides'
                  ? 'bg-primary-subtle text-primary font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
                }
              `}
            >
              <Calendar size={15} />
              <span>My Trips</span>
            </Link>
          )}

          <Link
            to={isAuthRoute ? '/driver/login' : '/driver/dashboard'}
            className={`
              px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2
              ${pathname === '/driver/login'
                ? 'bg-primary-subtle text-primary font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
              }
            `}
          >
            <Car size={15} />
            <span>Offer a Ride</span>
          </Link>

          <Link
            to="/help#how-it-works"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-border-subtle"
          >
            <Info size={15} />
            <span>How It Works</span>
          </Link>

          <Link
            to="/help"
            className={`
              px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5
              ${pathname.startsWith('/help') || pathname.startsWith('/contact') || pathname.startsWith('/safety') || pathname.startsWith('/report-problem') || pathname.startsWith('/feedback')
                ? 'bg-primary-subtle text-primary font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
              }
            `}
          >
            <HelpCircle size={15} />
            <span>Help</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {isAuthRoute ? (
            <>
              {/* Role Toggle link on Auth routes */}
              {isDriverAuth ? (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/30 bg-primary-subtle hover:bg-primary/20 text-primary transition-all duration-150 shadow-xs"
                >
                  <Compass size={14} className="text-primary" />
                  <span className="hidden sm:inline">Passenger Portal</span>
                  <span className="sm:hidden">Passenger</span>
                  <ArrowRight size={12} className="opacity-70" />
                </Link>
              ) : (
                <Link
                  to="/driver/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/30 bg-primary-subtle hover:bg-primary/20 text-primary transition-all duration-150 shadow-xs"
                >
                  <Car size={14} className="text-primary" />
                  <span className="hidden sm:inline">Driver Portal</span>
                  <span className="sm:hidden">Driver</span>
                  <ArrowRight size={12} className="opacity-70" />
                </Link>
              )}
              {/* Theme Toggle */}
              <ThemeToggle />
            </>
          ) : (
            <>
              {/* Switch to Driver Portal Button */}
              <Link
                to="/driver/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/30 bg-primary-subtle hover:bg-primary/20 text-primary transition-all duration-150 shadow-xs"
              >
                <Car size={14} className="text-primary" />
                <span>Driver Portal</span>
                <ArrowRight size={12} className="opacity-70" />
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />
            </>
          )}

          {/* User Account / Auth Actions — Only on regular pages */}
          {!isAuthRoute && (
            user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 h-9 px-2.5 rounded-lg border border-border bg-surface hover:bg-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer group"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  aria-label="User profile menu"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <span className="text-xs font-semibold text-text-primary max-w-[120px] truncate">
                    {user.name || user.email?.split('@')[0] || 'Account'}
                  </span>
                  <ChevronDown size={13} className={`text-text-muted transition-transform duration-150 group-hover:text-text-primary ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div
                    role="menu"
                    aria-label="User profile options"
                    className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-surface border border-border shadow-xl shadow-black/10 dark:shadow-black/50 p-1.5 z-[1200] text-left opacity-100 transition-all"
                  >
                    <div className="px-3.5 py-2.5 border-b border-border mb-1">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-[11px] font-medium text-text-secondary truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/my-rides"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary rounded-lg transition-colors hover:bg-primary-subtle hover:text-primary"
                    >
                      <Calendar size={15} className="text-primary shrink-0" />
                      <span>My Trips</span>
                    </Link>

                    <Link
                      to="/help"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary rounded-lg transition-colors hover:bg-primary-subtle hover:text-primary"
                    >
                      <HelpCircle size={15} className="text-primary shrink-0" />
                      <span>Help & Support</span>
                    </Link>

                    <Link
                      to="/driver/dashboard"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="sm:hidden flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary rounded-lg transition-colors hover:bg-primary-subtle hover:text-primary"
                    >
                      <Car size={15} className="text-primary shrink-0" />
                      <span>Driver Portal</span>
                    </Link>

                    <div className="my-1 border-t border-border" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-subtle rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} className="text-danger shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold rounded-md text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>
      </header>

      {/* Passenger Mobile Bottom Navigation Bar */}
      {user && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around py-2 safe-area-bottom shadow-card"
        >
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-md text-xs font-semibold transition-colors ${
              pathname === '/'
                ? 'text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Compass size={18} />
            <span>Find</span>
          </Link>

          <Link
            to="/my-rides"
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-md text-xs font-semibold transition-colors ${
              pathname === '/my-rides'
                ? 'text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Calendar size={18} />
            <span>Trips</span>
          </Link>

          <Link
            to="/driver/dashboard"
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-md text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <Car size={18} />
            <span>Driver</span>
          </Link>
        </nav>
      )}
    </>
  );
};

export default Navbar;
