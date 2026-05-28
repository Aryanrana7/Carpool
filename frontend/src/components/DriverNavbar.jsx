import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DriverAuthContext } from '../context/DriverAuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { PlusCircle, LayoutDashboard, LogOut, Car } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`relative text-sm font-medium px-1 py-1 transition-colors duration-150 flex items-center gap-2 ${
      active
        ? 'text-gray-900 dark:text-white'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="driver-nav-indicator"
        className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
      />
    )}
  </Link>
);

const DriverNavbar = () => {
  const { driver, logoutDriver } = useContext(DriverAuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logoutDriver();
    navigate('/driver/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-8 border-b transition-all duration-200 ${
        isDarkMode
          ? 'bg-[#0c0c0c]/95 border-[#1e1e1e]'
          : 'bg-white/95 border-gray-100'
      } backdrop-blur-xl`}
    >
      {/* Logo */}
      <Link to="/driver/dashboard" className="flex items-center gap-2.5 mr-10 flex-shrink-0">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Car size={16} className="text-white" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
            Carpool<span className="text-emerald-500">.</span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
            Driver
          </span>
        </div>
      </Link>

      {/* Nav links */}
      {driver && (
        <div className="flex items-center gap-6">
          <NavLink to="/driver/dashboard" active={pathname === '/driver/dashboard'}>
            <LayoutDashboard size={15} /> Dashboard
          </NavLink>
          <NavLink to="/driver/create-ride" active={pathname === '/driver/create-ride'}>
            <PlusCircle size={15} /> Post a Ride
          </NavLink>
        </div>
      )}

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />

        {driver && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-100 dark:border-[#242424]">
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm font-medium ${
              isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100'
            }`}>
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {driver.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-900 dark:text-white max-w-[100px] truncate">{driver.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-[#1e1e1e] text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                  : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DriverNavbar;
