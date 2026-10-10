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
        w-9 h-9 min-w-[36px] min-h-[36px] rounded-md border border-border
        bg-surface hover:bg-background text-text-secondary hover:text-text-primary
        flex items-center justify-center transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary ${className}
      `}
    >
      {isDarkMode ? (
        <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={17} className="text-text-secondary hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
