import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm active:opacity-95',
  secondary: 'bg-primary-subtle text-primary hover:bg-blue-100 dark:hover:bg-blue-900/40 active:opacity-95',
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
  ...props
}, ref) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium transition-colors duration-150
        select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClass}
        ${sizeClass}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 14 : 18} />
      ) : LeftIcon ? (
        <LeftIcon className="shrink-0" size={size === 'sm' ? 14 : 18} />
      ) : null}
      <span>{children}</span>
      {!loading && RightIcon && (
        <RightIcon className="shrink-0" size={size === 'sm' ? 14 : 18} />
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
