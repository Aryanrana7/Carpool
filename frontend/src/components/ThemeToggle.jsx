import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        h-9 px-2.5 rounded-lg border border-border
        bg-surface hover:bg-background text-text-primary
        flex items-center gap-1.5 transition-all duration-150 shadow-xs
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        active:scale-95 cursor-pointer ${className}
      `}
    >
      <div className="w-5 h-5 rounded-full flex items-center justify-center transition-transform">
        {isDarkMode ? (
          <Sun size={15} className="text-amber-400 fill-amber-400/40" />
        ) : (
          <Moon size={15} className="text-primary fill-primary-subtle" />
        )}
      </div>
      <span className="text-[11px] font-semibold text-text-secondary hidden xl:inline select-none">
        {isDarkMode ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;
