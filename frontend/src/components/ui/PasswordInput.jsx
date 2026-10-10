import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

export const PasswordInput = React.forwardRef(({
  id,
  label = 'Password',
  leftIcon = Lock,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      leftIcon={leftIcon}
      rightIcon={
        <button
          type="button"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-text-muted hover:text-text-primary p-1 focus:outline-none"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
