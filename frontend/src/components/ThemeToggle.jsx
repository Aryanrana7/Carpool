import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = ({ tooltip = true }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="relative group">
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 z-50">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {isDarkMode ? 'Light mode' : 'Dark mode'}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45 rounded-sm" />
          </div>
        </div>
      )}

      {/* Toggle pill */}
      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.93 }}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`
          relative flex items-center w-[52px] h-[28px] rounded-full
          transition-colors duration-500 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
          ${isDarkMode
            ? 'bg-[#1e1e2e] border border-[#363650] shadow-[0_0_12px_rgba(99,102,241,0.15)]'
            : 'bg-gray-100 border border-gray-200 shadow-[0_0_12px_rgba(234,179,8,0.12)]'
          }
        `}
      >
        {/* Track icons */}
        <div className="absolute inset-0 flex items-center justify-between px-[7px] pointer-events-none">
          {/* Sun — left side, visible in light mode */}
          <motion.div
            animate={{ opacity: isDarkMode ? 0.25 : 1, scale: isDarkMode ? 0.7 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={11} className="text-amber-500" strokeWidth={2.5} />
          </motion.div>

          {/* Moon — right side, visible in dark mode */}
          <motion.div
            animate={{ opacity: isDarkMode ? 1 : 0.25, scale: isDarkMode ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={11} className="text-indigo-400" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Sliding thumb */}
        <motion.div
          layout
          animate={{ x: isDarkMode ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.8 }}
          className={`
            relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center
            shadow-md
            ${isDarkMode
              ? 'bg-[#2d2d4e] shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.3)]'
              : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]'
            }
          `}
        >
          {/* Thumb icon */}
          <motion.div
            key={isDarkMode ? 'moon' : 'sun'}
            initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isDarkMode
              ? <Moon size={11} className="text-indigo-400" strokeWidth={2.5} />
              : <Sun size={11} className="text-amber-500" strokeWidth={2.5} />
            }
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
