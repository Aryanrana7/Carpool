import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 rounded-lg
        border border-dashed border-border bg-background/50 ${className}
      `}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-border-subtle flex items-center justify-center text-text-secondary mb-3.5">
          <Icon size={22} />
        </div>
      )}

      {title && (
        <h3 className="text-base font-semibold text-text-primary mb-1">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-4">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
