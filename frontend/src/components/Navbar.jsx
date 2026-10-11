import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, Compass, Calendar, LogOut, ArrowRight, User, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1100] h-[68px] flex items-center px-4 sm:px-8 bg-white/95 dark:bg-[#18241F]/95 backdrop-blur-md border-b border-border shadow-xs transition-colors">
        {/* Brand Logo with Mobility mark */}
        <Link to="/" className="flex items-center gap-2.5 mr-8 shrink-0 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Car size={18} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-base font-extrabold tracking-tight text-ink font-heading">
                CarPool
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted leading-none mt-0.5">
              Mobility
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Accessible & Commercial */}
        <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <Link
            to="/"
            className={`
              px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2
              ${pathname === '/'
                ? 'bg-primary-subtle text-primary font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
              }
            `}
          >
            <Compass size={15} />
            <span>Find a Ride</span>
          </Link>

          {user && (
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
            to="/driver/dashboard"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 text-text-secondary hover:text-text-primary hover:bg-border-subtle"
          >
            <Car size={15} />
            <span>Offer a Ride</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Switch to Driver Portal Button */}
          <Link
            to="/driver/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/30 bg-[#E8F5EF] dark:bg-[#1C362B] hover:bg-primary-subtle text-primary transition-all duration-150 shadow-xs"
          >
            <Car size={14} className="text-primary" />
            <span>Driver Portal</span>
            <ArrowRight size={12} className="opacity-70" />
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Account / Auth Actions */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 h-9 px-2 rounded-lg border border-border bg-white dark:bg-[#18241F] hover:bg-border-subtle transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer group"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-text-primary max-w-[120px] truncate">
                  {user.name || user.email?.split('@')[0] || 'Account'}
                </span>
                <ChevronDown size={13} className="text-text-muted transition-transform group-hover:text-text-primary" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-surface border border-border shadow-overlay p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs font-semibold text-text-primary truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/my-rides"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors"
                    >
                      <Calendar size={14} />
                      <span>My Trips</span>
                    </Link>

                    <Link
                      to="/driver/dashboard"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="sm:hidden flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors"
                    >
                      <Car size={14} />
                      <span>Driver Portal</span>
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors mt-1"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
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
          )}
        </div>
      </header>

      {/* Passenger Mobile Bottom Navigation Bar */}
      {user && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-white/95 dark:bg-[#18241F]/95 backdrop-blur-md border-t border-border flex items-center justify-around py-2 safe-area-bottom shadow-card"
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
