import React from 'react';

const STATUS_CONFIGS = {
  pending: {
    label: 'Pending',
    style: 'bg-warning-subtle text-warning border-amber-200 dark:border-amber-800/40',
    dot: 'bg-warning',
  },
  confirmed: {
    label: 'Confirmed',
    style: 'bg-primary-subtle text-primary border-[#B8D4EA] dark:border-[#1E3A52]',
    dot: 'bg-primary',
  },
  in_progress: {
    label: 'En Route',
    style: 'bg-success-subtle text-success border-emerald-200 dark:border-emerald-800/40',
    dot: 'bg-success animate-pulse',
  },
  active: {
    label: 'Active',
    style: 'bg-success-subtle text-success border-emerald-200 dark:border-emerald-800/40',
    dot: 'bg-success animate-pulse',
  },
  completed: {
    label: 'Completed',
    style: 'bg-surface text-text-secondary border-border',
    dot: 'bg-text-muted',
  },
  cancelled: {
    label: 'Cancelled',
    style: 'bg-danger-subtle text-danger border-red-200 dark:border-red-900/40',
    dot: 'bg-danger',
  },
  declined: {
    label: 'Declined',
    style: 'bg-danger-subtle text-danger border-red-200 dark:border-red-900/40',
    dot: 'bg-danger',
  },
  online: {
    label: 'Online',
    style: 'bg-success-subtle text-success border-emerald-300 dark:border-emerald-700/60 font-semibold',
    dot: 'bg-success animate-pulse',
  },
  offline: {
    label: 'Offline',
    style: 'bg-border-subtle text-text-muted border-border',
    dot: 'bg-text-muted',
  },
  searching: {
    label: 'Searching',
    style: 'bg-warning-subtle text-warning border-amber-200 dark:border-amber-800/40 font-semibold',
    dot: 'bg-warning animate-ping',
  },
  accepted: {
    label: 'Driver Assigned',
    style: 'bg-primary-subtle text-primary border-[#B8D4EA] dark:border-[#1E3A52]',
    dot: 'bg-primary',
  },
  driver_arriving: {
    label: 'Driver Arriving',
    style: 'bg-primary-subtle text-primary border-[#B8D4EA] dark:border-[#1E3A52]',
    dot: 'bg-primary animate-pulse',
  },
};

export const Badge = ({
  status,
  label,
  showDot = true,
  className = '',
  size = 'md',
}) => {
  const normalizedKey = String(status || '').toLowerCase().replace(/[\s-]/g, '_');
  const config = STATUS_CONFIGS[normalizedKey] || {
    label: label || status || 'Unknown',
    style: 'bg-surface text-text-secondary border-border',
    dot: 'bg-text-muted',
  };

  const displayText = label || config.label;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight whitespace-nowrap
        ${config.style}
        ${sizeClasses}
        ${className}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} aria-hidden="true" />
      )}
      <span>{displayText}</span>
    </span>
  );
};

export default Badge;
