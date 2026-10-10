import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import RouteConnector from './RouteConnector';
import TrustStrip from './TrustStrip';
import FareLabel from './FareLabel';
import Skeleton from './Skeleton';
import { formatDate, formatTime } from '../../utils/formatters';

/* ── Skeleton Loading Card ────────────────────────────── */
export const SkeletonRideCard = () => (
  <div className="bg-surface border border-border rounded-xl p-4 space-y-3 shadow-subtle">
    <div className="flex justify-between items-center">
      <Skeleton width="40%" height="20px" />
      <Skeleton width="30%" height="24px" />
    </div>
    <div className="space-y-2 py-1">
      <Skeleton width="80%" height="16px" />
      <Skeleton width="65%" height="16px" />
    </div>
    <div className="pt-2 border-t border-border flex justify-between items-center">
      <Skeleton width="50%" height="16px" />
      <Skeleton width="25%" height="22px" />
    </div>
  </div>
);

/* ── Rich Vertical Ride Card ─────────────────────────── */
export const VerticalRideCard = React.memo(({
  ride,
  selected,
  onSelect,
  onHoverIn,
  onHoverOut,
}) => {
  const isSeatsLow = ride.seats === 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      onClick={() => onSelect(ride)}
      onMouseEnter={() => onHoverIn?.(ride)}
      onMouseLeave={() => onHoverOut?.(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ride);
        }
      }}
      className={`
        w-full rounded-xl p-4 text-left transition-all duration-200 cursor-pointer border
        ${selected
          ? 'border-primary bg-primary-subtle/50 ring-2 ring-primary/20 shadow-card'
          : 'border-border bg-surface hover:border-primary/40 hover:bg-background/50 shadow-subtle'
        }
      `}
    >
      {/* 1. Header Row: Departure Time + Prominent Fare */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-text-primary">
          <Clock size={15} className="text-primary shrink-0" />
          <span className="font-heading text-sm font-bold tabular-nums">
            {formatTime(ride.time || ride.date)}
          </span>
          <span className="text-[11px] text-text-muted">
            ({formatDate(ride.time || ride.date, { relative: true })})
          </span>
        </div>
        <FareLabel amount={ride.price} size="lg" highlight perSeat />
      </div>

      {/* 2. Route Timeline via RouteConnector */}
      <div className="mb-3.5 pl-0.5">
        <RouteConnector
          pickup={ride.pickupLocation?.split(',')[0] || ride.source}
          destination={ride.dropoffLocation?.split(',')[0] || ride.destination}
          className="text-xs"
        />
      </div>

      {/* 3. Driver Credibility via TrustStrip */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <TrustStrip
          driver={ride.driver}
          size="sm"
          showVehicle={true}
          className="min-w-0 flex-1"
        />

        {/* 4. Seats Left Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {ride.seats > 0 ? (
            <span
              className={`
                text-[11px] font-semibold px-2 py-0.5 rounded tabular-nums border
                ${isSeatsLow
                  ? 'bg-warning-subtle text-warning border-amber-200 dark:border-amber-900/40'
                  : 'bg-border-subtle text-text-secondary border-border'
                }
              `}
            >
              {ride.seats} {ride.seats === 1 ? 'seat left' : 'seats left'}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-danger bg-danger-subtle px-2 py-0.5 rounded border border-red-200 dark:border-red-900/40">
              Sold out
            </span>
          )}
        </div>
      </div>

      {/* 5. Select CTA Row */}
      <div className="mt-3 pt-2.5 border-t border-border/70 flex items-center justify-between text-xs">
        <span className="text-text-muted font-medium">
          Vehicle: <strong className="text-text-primary">{ride.carType || ride.driver?.carModel || 'Sedan'}</strong>
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary group">
          <span>{selected ? 'Viewing Details' : 'Select Ride'}</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.div>
  );
});

VerticalRideCard.displayName = 'VerticalRideCard';
export default VerticalRideCard;
