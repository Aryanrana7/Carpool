import React from 'react';

/**
 * StatTile renders a clean, normalized KPI tile for driver operations.
 * Uses a neutral icon badge, tabular numbers, aligned baselines, and truthful metrics.
 */
export const StatTile = ({
  icon: Icon,
  label,
  value,
  subtext,
  empty = false,
  emptyText = 'No data yet',
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-surface border border-border rounded-lg p-4 flex flex-col justify-between
        transition-colors hover:border-border-subtle ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider line-clamp-1">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-text-secondary shrink-0">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-3">
        {empty ? (
          <div className="text-sm font-medium text-text-muted py-1">{emptyText}</div>
        ) : (
          <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums flex items-baseline gap-2">
            <span>{value}</span>
            {children}
          </div>
        )}

        {subtext && (
          <p className="text-xs text-text-muted mt-1 line-clamp-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatTile;
