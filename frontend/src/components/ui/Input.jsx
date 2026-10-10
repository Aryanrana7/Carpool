import React from 'react';

export const Input = React.forwardRef(({
  id,
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-text-primary uppercase tracking-wider"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
            <LeftIcon size={18} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          className={`
            input-base
            ${LeftIcon ? 'pl-10' : 'pl-3.5'}
            ${RightIcon ? 'pr-10' : 'pr-3.5'}
            ${error ? 'border-danger focus:ring-red-200 dark:focus:ring-red-950' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-border-subtle' : ''}
            ${className}
          `}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-3 text-text-muted flex items-center">
            {RightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
