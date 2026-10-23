import React from 'react';
import { Clock, ArrowRight, ShieldCheck, Star, Users } from 'lucide-react';
import RouteConnector from './RouteConnector';
import TrustStrip from './TrustStrip';
import FareLabel from './FareLabel';
import Skeleton from './Skeleton';
import { formatDate, formatTime } from '../../utils/formatters';

/* ── Refined Skeleton Loading Card ──────────────────────── */
export const SkeletonRideCard = () => (
  <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-subtle animate-pulse">
    {/* Top Row: Time & Price Skeleton */}
    <div className="flex justify-between items-center pb-3 border-b border-border/70">
      <div className="flex items-center gap-2">
        <Skeleton width="16px" height="16px" borderRadius="4px" />
        <Skeleton width="90px" height="20px" />
        <Skeleton width="50px" height="16px" borderRadius="10px" />
      </div>
      <Skeleton width="70px" height="24px" />
    </div>

    {/* Route Skeleton */}
    <div className="py-1 space-y-3">
      <Skeleton width="85%" height="16px" />
      <Skeleton width="65%" height="16px" />
    </div>

    {/* Driver Skeleton */}
    <div className="pt-3 border-t border-border/70 flex items-center gap-2.5">
      <Skeleton width="32px" height="32px" borderRadius="50%" />
      <div className="space-y-1">
        <Skeleton width="90px" height="14px" />
        <Skeleton width="70px" height="12px" />
      </div>
    </div>

    {/* Bottom Action Row Skeleton */}
    <div className="pt-3 border-t border-border/70 flex justify-between items-center">
      <Skeleton width="80px" height="26px" borderRadius="6px" />
      <Skeleton width="105px" height="34px" borderRadius="8px" />
    </div>
  </div>
);

/* ── Commercial Scheduled Ride Card ───────────────────── */
export const VerticalRideCard = React.memo(({
  ride,
  selected = false,
  onSelect,
  onHoverIn,
  onHoverOut,
}) => {
  const isSeatsLow = ride.seats === 1;
  const isSoldOut = ride.seats <= 0;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    if (onSelect) onSelect(ride);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => onHoverIn?.(ride)}
      onMouseLeave={() => onHoverOut?.(null)}
      role="button"
      tabIndex={isSoldOut ? -1 : 0}
      aria-disabled={isSoldOut}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      className={`
        group relative w-full rounded-2xl p-5 sm:p-5.5 text-left transition-all duration-200
        border bg-surface flex flex-col justify-between
        ${isSoldOut
          ? 'border-border/80 opacity-80 cursor-default shadow-subtle'
          : selected
            ? 'border-primary bg-primary-subtle/25 ring-2 ring-primary/25 shadow-card cursor-pointer'
            : 'border-border hover:border-primary/50 hover:shadow-card hover:-translate-y-0.5 shadow-subtle cursor-pointer'
        }
      `}
    >
      {/* ── 1. Top Row: Time, Date & Prominent Fare ──────── */}
      <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-text-primary">
            <Clock size={16} className="text-primary shrink-0" />
            <span className="font-heading text-base font-extrabold tabular-nums tracking-tight">
              {formatTime(ride.time || ride.date)}
            </span>
            <span className="text-[11px] font-semibold text-text-muted bg-background border border-border px-2 py-0.5 rounded-full">
              {formatDate(ride.time || ride.date, { relative: true })}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <FareLabel amount={ride.price} size="lg" highlight perSeat />
        </div>
      </div>

      {/* ── 2. Route Timeline via Enhanced RouteConnector ─── */}
      <div className="py-3.5 my-0.5">
        <RouteConnector
          pickup={ride.pickupLocation?.split(',')[0] || ride.source}
          destination={ride.dropoffLocation?.split(',')[0] || ride.destination}
          distance={ride.distance}
          duration={ride.duration}
        />
      </div>

      {/* ── 3. Driver Credibility & Vehicle ───────────────── */}
      <div className="pt-3 pb-1 border-t border-border/70">
        <TrustStrip
          driver={{
            ...ride.driver,
            carModel: ride.carType || ride.driver?.carModel || 'Standard Vehicle',
            carNumber: ride.driver?.carNumber,
          }}
          size="sm"
          showVehicle={true}
        />
      </div>

      {/* ── 4. Availability & High-Contrast Primary Action ─── */}
      <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-3">
        {/* Seats left indicator */}
        <div className="shrink-0">
          {!isSoldOut ? (
            <span
              className={`
                inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md tabular-nums border
                ${isSeatsLow
                  ? 'bg-warning-subtle text-accent-text border-amber-200 dark:border-amber-900/40'
                  : 'bg-primary-subtle text-primary border-primary/25'
                }
              `}
            >
              <Users size={12} className="opacity-70 text-primary" />
              <span>{ride.seats} {ride.seats === 1 ? 'seat left' : 'seats left'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-bold text-danger bg-danger-subtle px-2.5 py-1 rounded-md border border-red-200 dark:border-red-900/40">
              Sold out
            </span>
          )}
        </div>

        {/* High-Contrast Primary "Select Ride" Button */}
        <button
          type="button"
          onClick={handleCardClick}
          disabled={isSoldOut}
          aria-disabled={isSoldOut}
          className={`
            inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-150 shadow-sm
            ${isSoldOut
              ? 'bg-border-subtle text-text-muted cursor-not-allowed opacity-75 border border-border'
              : selected
                ? 'bg-primary-hover text-white ring-2 ring-primary ring-offset-2 cursor-pointer'
                : 'bg-primary hover:bg-primary-hover text-white group-hover:bg-primary-hover cursor-pointer'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          `}
        >
          <span className="tracking-wide">
            {isSoldOut ? 'Sold Out' : selected ? 'Selected' : 'Select Ride'}
          </span>
          {!isSoldOut && (
            <ArrowRight size={13} className="text-white transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
    </div>
  );
});

VerticalRideCard.displayName = 'VerticalRideCard';
export default VerticalRideCard;
