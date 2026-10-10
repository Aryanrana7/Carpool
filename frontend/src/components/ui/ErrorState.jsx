import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Unable to complete this action right now. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`
        flex flex-col items-center justify-center text-center p-8 rounded-lg
        border border-red-200 dark:border-red-900/40 bg-danger-subtle/40 ${className}
      `}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-danger mb-3.5">
        <AlertCircle size={22} />
      </div>

      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>

      <p className="text-sm text-text-secondary max-w-sm mb-4">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
