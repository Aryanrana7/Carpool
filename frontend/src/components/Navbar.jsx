import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Car, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`relative text-sm font-medium px-1 py-1 transition-colors duration-150 ${
      active
        ? 'text-gray-900 dark:text-white'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
      />
    )}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      <Link to="/" className="flex items-center gap-2.5 mr-10 flex-shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Car size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
          Carpool<span className="text-indigo-500">.</span>
        </span>
      </Link>

      {/* Nav links */}
      {user && (
        <div className="flex items-center gap-6 border-b border-transparent">
          <NavLink to="/" active={pathname === '/'}>Book a Ride</NavLink>
          <NavLink to="/my-rides" active={pathname === '/my-rides'}>My Trips</NavLink>
        </div>
      )}

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-100 dark:border-[#242424]">
            {/* Avatar + name */}
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm font-medium ${
              isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100'
            }`}>
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-900 dark:text-white max-w-[100px] truncate">{user.name}</span>
            </div>

            {/* Logout */}
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
        ) : (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-100 dark:border-[#242424]">
            <Link to="/login" className="btn-ghost text-sm py-2 px-4">Log in</Link>
            <Link
              to="/register"
              className={`btn text-sm py-2 px-4 rounded-xl font-semibold ${
                isDarkMode ? 'bg-white text-[#0c0c0c]' : 'bg-[#111] text-white'
              } hover:opacity-90`}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
