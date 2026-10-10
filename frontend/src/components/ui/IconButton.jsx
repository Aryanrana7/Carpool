import React from 'react';

const VARIANTS = {
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-border-subtle active:opacity-90',
  outline: 'bg-surface text-text-primary border border-border hover:bg-background active:opacity-90',
  primary: 'bg-primary text-white hover:bg-primary-hover active:opacity-90',
  secondary: 'bg-primary-subtle text-primary hover:bg-blue-100 dark:hover:bg-blue-900/40 active:opacity-90',
};

const SIZES = {
  sm: 'w-8 h-8 rounded-md',
  md: 'w-10 h-10 min-w-[40px] min-h-[40px] sm:w-9 sm:h-9 rounded-md',
  lg: 'w-12 h-12 min-w-[44px] min-h-[44px] rounded-lg',
};

export const IconButton = React.forwardRef(({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  'aria-label': ariaLabel,
  title,
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel || title}
      title={title || ariaLabel}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center transition-colors duration-150 shrink-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANTS[variant] || VARIANTS.ghost}
        ${SIZES[size] || SIZES.md}
        ${className}
      `}
      {...props}
    >
      {Icon ? <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} /> : children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
