import React from 'react';

/**
 * RouteConnector renders a vertical route indicator:
 * Pickup dot (top) -> Vertical dashed line -> Destination square (bottom).
 * Perfectly aligns alongside stacked Pickup and Destination inputs.
 */
export const RouteConnector = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-between py-3 shrink-0 select-none ${className}`} aria-hidden="true">
      {/* Pickup indicator: Circle with center dot */}
      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary flex items-center justify-center bg-surface">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>

      {/* Vertical dotted connector line */}
      <div className="w-0.5 flex-1 my-1 border-l-2 border-dashed border-border" />

      {/* Destination indicator: Solid square */}
      <div className="w-3.5 h-3.5 rounded-sm bg-ink dark:bg-primary-subtle border border-ink dark:border-primary flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white dark:bg-primary rounded-[1px]" />
      </div>
    </div>
  );
};

export default RouteConnector;
