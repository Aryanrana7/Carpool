import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DriverAuthContext } from '../context/DriverAuthContext';
import { Car, LayoutDashboard, PlusCircle, LogOut, ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const DriverNavbar = () => {
  const { driver, logoutDriver } = useContext(DriverAuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    logoutDriver();
    navigate('/driver/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] h-[68px] flex items-center px-4 sm:px-8 bg-[#18241F] border-b border-[#25382F] text-white transition-colors">
        {/* Brand & Driver Badge */}
        <Link to="/driver/dashboard" className="flex items-center gap-2.5 mr-8 shrink-0 group">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Car size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white leading-tight">
              CarPool
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-emerald-400 border border-primary/30 px-1.5 py-0.5 rounded">
              Driver
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Single Active Tab Indicator */}
        {driver && (
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Driver Navigation">
            <Link
              to="/driver/dashboard"
              className={`
                px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2
                ${pathname === '/driver/dashboard'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#25382F]'
                }
              `}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/driver/create-ride"
              className={`
                px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2
                ${pathname === '/driver/create-ride'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#25382F]'
                }
              `}
            >
              <PlusCircle size={15} />
              <span>Post a Ride</span>
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2.5">
          {/* Switch to Passenger Portal */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-[#2D4539] bg-[#22352B] hover:bg-[#283E33] text-slate-200 transition-colors"
          >
            <ArrowLeft size={13} className="text-emerald-400" />
            <span>Passenger Portal</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Driver Profile Dropdown */}
          {driver ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-2 rounded-md hover:bg-[#25382F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 text-emerald-400 border border-primary/30 flex items-center justify-center text-xs font-bold shrink-0">
                  {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white max-w-[100px] truncate leading-tight">
                    {driver.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate leading-tight">
                    {driver.vehicleModel || driver.carModel || 'Driver'}
                  </span>
                </div>
              </button>

              {/* Driver Dropdown Menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-[#18241F] border border-[#25382F] shadow-overlay p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-3 py-2 border-b border-[#25382F] mb-1">
                      <p className="text-xs font-semibold text-white truncate">
                        {driver.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {driver.vehicleModel || driver.carModel} · {driver.vehicleNumber || driver.carNumber}
                      </p>
                    </div>

                    <Link
                      to="/driver/dashboard"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#25382F] rounded-md transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/driver/create-ride"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#25382F] rounded-md transition-colors"
                    >
                      <PlusCircle size={14} />
                      <span>Post a Ride</span>
                    </Link>

                    <Link
                      to="/"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="sm:hidden flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#25382F] rounded-md transition-colors"
                    >
                      <Car size={14} />
                      <span>Passenger Portal</span>
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950/40 rounded-md transition-colors mt-1"
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
                to="/driver/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/driver/register"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Driver Mobile Bottom Navigation Bar */}
      {driver && (
        <nav
          aria-label="Driver Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-[#18241F]/95 backdrop-blur-md border-t border-[#25382F] flex items-center justify-around py-2 safe-area-bottom shadow-card text-slate-400"
        >
          <Link
            to="/driver/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-md text-xs font-semibold transition-colors ${
              pathname === '/driver/dashboard'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/driver/create-ride"
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-md text-xs font-semibold transition-colors ${
              pathname === '/driver/create-ride'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle size={18} />
            <span>Post Ride</span>
          </Link>

          <Link
            to="/"
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Car size={18} />
            <span>Passenger</span>
          </Link>
        </nav>
      )}
    </>
  );
};

export default DriverNavbar;
