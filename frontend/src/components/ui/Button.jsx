import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm active:opacity-95',
  secondary: 'bg-primary-subtle text-primary hover:bg-[#C2E3D4] dark:hover:bg-[#1C362B] active:opacity-95',
  outline: 'bg-surface text-text-primary border border-border hover:bg-background active:opacity-95',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-border-subtle active:opacity-95',
  destructive: 'bg-danger-subtle text-danger border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 active:opacity-95',
  hero: 'bg-ink text-white dark:bg-white dark:text-ink hover:opacity-90 shadow-sm active:opacity-95',
};

const SIZES = {
  sm: 'h-9 px-3 text-xs rounded-md gap-1.5',
  md: 'min-h-[44px] px-4 text-sm rounded-md gap-2',
  lg: 'min-h-[48px] px-6 text-base rounded-md gap-2.5 font-semibold',
};

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  type = 'button',
  style = {},
  ...props
}, ref) => {
  const sizeClass = SIZES[size] || SIZES.md;
  const isActionDisabled = disabled || loading;

  // Resolve state-specific styling to guarantee high contrast across all states
  let stateClasses;
  let inlineStyles = { ...style };

  if (loading) {
    if (variant === 'primary') {
      stateClasses = 'bg-primary text-white cursor-wait opacity-90 shadow-sm';
      inlineStyles = { backgroundColor: 'var(--color-primary)', color: '#FFFFFF', ...inlineStyles };
    } else {
      stateClasses = 'bg-surface text-text-muted border border-border cursor-wait opacity-90';
    }
  } else if (disabled) {
    if (variant === 'primary') {
      // Intentionally muted background with readable dark text and clear border (never white on cream)
      stateClasses = 'bg-[#DCE4DE] dark:bg-[#25382F] text-[#4E6157] dark:text-[#8A9A92] border border-[#CBD6CE] dark:border-[#2F443A] cursor-not-allowed shadow-none';
    } else {
      stateClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none';
    }
  } else {
    // Enabled state: standard variant
    stateClasses = VARIANTS[variant] || VARIANTS.primary;
    if (variant === 'primary') {
      inlineStyles = { backgroundColor: 'var(--color-primary)', color: '#FFFFFF', ...inlineStyles };
    }
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={isActionDisabled}
      aria-busy={loading}
      style={inlineStyles}
      className={`
        inline-flex items-center justify-center font-semibold transition-colors duration-150
        select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${stateClasses}
        ${sizeClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0 text-current" size={size === 'sm' ? 14 : 18} />
      ) : LeftIcon ? (
        <LeftIcon className="shrink-0 text-current" size={size === 'sm' ? 14 : 18} />
      ) : null}
      <span>{children}</span>
      {!loading && RightIcon && (
        <RightIcon className="shrink-0 text-current" size={size === 'sm' ? 14 : 18} />
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
