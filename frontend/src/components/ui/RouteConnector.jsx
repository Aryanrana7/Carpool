import React from 'react';

/**
 * RouteConnector renders the CarPool signature route timeline motif:
 * Pickup node (Emerald #087F5B) -> Vertical connecting line -> Destination node (Forest Charcoal #18241F).
 * 
 * Supports two modes:
 * 1. Full timeline card row (for ride cards, booking drawers, active trip trackers).
 * 2. Compact icon indicator (for input form fields) when no pickup/destination text is passed.
 */
export const RouteConnector = ({
  pickup,
  destination,
  pickupTime,
  destinationTime,
  distance,
  duration,
  className = '',
}) => {
  // Mode 1: Full timeline card layout
  if (pickup || destination) {
    return (
      <div className={`flex items-stretch gap-3 w-full text-xs ${className}`}>
        {/* Responsive timeline dots & flex connecting line */}
        <div className="flex flex-col items-center justify-between shrink-0 py-0.5 select-none" aria-hidden="true">
          {/* Pickup node (Emerald) */}
          <div className="w-3.5 h-3.5 rounded-full border-2 border-primary flex items-center justify-center bg-surface shrink-0 shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>

          {/* Flexible connecting line */}
          <div className="w-0.5 flex-1 min-h-[24px] my-1 border-l-2 border-dashed border-border" />

          {/* Destination node (Forest Charcoal) */}
          <div className="w-3.5 h-3.5 rounded-sm bg-ink dark:bg-primary-subtle border border-ink dark:border-primary flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-1.5 h-1.5 bg-white dark:bg-primary rounded-[1px]" />
          </div>
        </div>

        {/* Route Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0 space-y-2.5">
          {/* Pickup */}
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block leading-none mb-0.5">
                Pickup
              </span>
              <p
                className="font-bold text-text-primary leading-snug line-clamp-2 break-words"
                title={pickup || 'Pickup location'}
              >
                {pickup || 'Pickup location'}
              </p>
            </div>
            {pickupTime && (
              <span className="font-heading font-semibold text-text-secondary tabular-nums text-[11px] shrink-0 pt-0.5">
                {pickupTime}
              </span>
            )}
          </div>

          {/* Mid-journey distance/duration hint if present */}
          {(distance || duration) && (
            <div className="text-[10px] text-text-muted font-medium pl-0.5 flex items-center gap-1.5 select-none">
              {distance && <span>{distance}</span>}
              {distance && duration && <span>·</span>}
              {duration && <span>{duration}</span>}
            </div>
          )}

          {/* Destination */}
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block leading-none mb-0.5">
                Destination
              </span>
              <p
                className="font-semibold text-text-primary leading-snug line-clamp-2 break-words"
                title={destination || 'Destination'}
              >
                {destination || 'Destination'}
              </p>
            </div>
            {destinationTime && (
              <span className="font-heading font-semibold text-text-secondary tabular-nums text-[11px] shrink-0 pt-0.5">
                {destinationTime}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mode 2: Compact icon indicator for input form alignment
  return (
    <div className={`flex flex-col items-center justify-between py-3 shrink-0 select-none ${className}`} aria-hidden="true">
      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary flex items-center justify-center bg-surface">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>

      <div className="w-0.5 flex-1 my-1 border-l-2 border-dashed border-border" />

      <div className="w-3.5 h-3.5 rounded-sm bg-ink dark:bg-primary-subtle border border-ink dark:border-primary flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white dark:bg-primary rounded-[1px]" />
      </div>
    </div>
  );
};

export default RouteConnector;
