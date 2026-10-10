import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Bike, Shield, Clock, Star, ChevronRight, Zap, MapPinOff, ArrowUpDown, Filter } from 'lucide-react';
import { formatCurrency, formatTime } from '../../utils/formatters';
import Skeleton from '../ui/Skeleton';
import Badge from '../ui/Badge';
import FareLabel from '../ui/FareLabel';
import TrustStrip from '../ui/TrustStrip';

const RIDE_TYPE_ICONS = {
  mini: Bike,
  sedan: Car,
  suv: Shield,
};

/* ── Skeleton Card ────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="shrink-0 w-64 bg-surface border border-border rounded-lg p-3.5 space-y-2.5">
    <div className="flex justify-between items-center">
      <Skeleton width="45%" height="16px" />
      <Skeleton width="30%" height="20px" />
    </div>
    <Skeleton width="80%" height="14px" />
    <div className="flex justify-between items-center pt-1 border-t border-border">
      <Skeleton width="40%" height="14px" />
      <Skeleton width="30%" height="14px" />
    </div>
  </div>
);

/* ── Individual Ride Card ─────────────────────────────── */
const RideHorizontalCard = React.memo(({ ride, selected, onSelect, onHoverIn, onHoverOut }) => {
  const isSeatsLow = ride.seats === 1;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(ride)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ride);
        }
      }}
      onMouseEnter={() => onHoverIn?.(ride)}
      onMouseLeave={() => onHoverOut?.(null)}
      className={`
        shrink-0 w-64 rounded-lg p-3.5 cursor-pointer border text-left transition-all duration-150
        ${selected
          ? 'border-primary bg-primary-subtle ring-2 ring-primary/20 shadow-subtle'
          : 'border-border bg-surface hover:border-primary/50 shadow-subtle'
        }
      `}
    >
      {/* 1. Departure Time and Fare (Visually Strongest) */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-text-primary">
          <Clock size={13} className="text-primary shrink-0" />
          <span className="text-xs font-bold tabular-nums">
            {formatTime(ride.time || ride.date)}
          </span>
        </div>
        <FareLabel amount={ride.price} size="md" />
      </div>

      {/* 2. Route Hint (From -> To) */}
      <p className="text-xs font-medium text-text-secondary truncate mb-2.5">
        {ride.pickupLocation?.split(',')[0] || ride.source} → {ride.dropoffLocation?.split(',')[0] || ride.destination}
      </p>

      {/* 3. Driver & Vehicle Info via TrustStrip */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-border gap-2">
        <TrustStrip driver={ride.driver} size="sm" showVehicle={false} className="min-w-0 flex-1" />

        {/* 4. Seats Left Badge */}
        <div className="shrink-0">
          {ride.seats > 0 ? (
            <span
              className={`
                text-[10px] font-semibold px-1.5 py-0.5 rounded tabular-nums border
                ${isSeatsLow
                  ? 'bg-warning-subtle text-warning border-amber-200 dark:border-amber-900/40'
                  : 'bg-border-subtle text-text-secondary border-border'
                }
              `}
            >
              {ride.seats} {ride.seats === 1 ? 'seat left' : 'seats'}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-danger bg-danger-subtle px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/40">
              Sold out
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

RideHorizontalCard.displayName = 'RideHorizontalCard';

/* ── Main Floating Results Dock ───────────────────────── */
export const FloatingRideResults = ({
  show,
  rides = [],
  loading = false,
  selectedRide,
  onSelectRide,
  onHoverRide,
  onClose,
  onSwitchToOnDemand,
}) => {
  const listRef = useRef(null);
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'price' | 'seats'

  const sortedRides = useMemo(() => {
    if (!rides || rides.length === 0) return [];
    const copy = [...rides];
    if (sortBy === 'price') {
      return copy.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === 'seats') {
      return copy.sort((a, b) => (b.seats || 0) - (a.seats || 0));
    }
    return copy.sort((a, b) => new Date(a.time || a.date).getTime() - new Date(b.time || b.date).getTime());
  }, [rides, sortBy]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="results-panel"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-[500] w-[calc(100vw-16px)] sm:w-[calc(100vw-24px)] md:w-[calc(100%-400px)] max-w-2xl"
        >
          <div className="bg-surface border border-border rounded-xl p-3.5 sm:p-4 shadow-overlay">
            {/* Header & Filter Controls */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Car size={16} className="text-primary shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                  {loading
                    ? 'Searching active routes…'
                    : `${rides.length} matching ride${rides.length !== 1 ? 's' : ''} found`}
                </h3>
              </div>

              {/* Sort Chips */}
              {!loading && rides.length > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-text-muted">Sort:</span>
                  <button
                    type="button"
                    onClick={() => setSortBy('time')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                      sortBy === 'time'
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Earliest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                      sortBy === 'price'
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('seats')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                      sortBy === 'seats'
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Most Seats
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close results panel"
                className="w-7 h-7 rounded-md border border-border bg-surface hover:bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Horizontal Scrollable Results */}
            <div
              ref={listRef}
              className="flex gap-2.5 overflow-x-auto scrollbar-none py-1"
            >
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              ) : sortedRides.length === 0 ? (
                <div className="flex-1 py-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-muted mx-auto mb-2.5">
                    <MapPinOff size={18} />
                  </div>
                  <p className="text-text-primary text-sm font-semibold">
                    No rides available for this route.
                  </p>
                  <p className="text-text-secondary text-xs mt-1 max-w-sm mx-auto mb-3">
                    No driver is currently scheduled for this journey. You can adjust your date or request an on-demand ride.
                  </p>
                  {onSwitchToOnDemand && (
                    <button
                      type="button"
                      onClick={onSwitchToOnDemand}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
                    >
                      <Zap size={13} />
                      <span>Request On-Demand Ride Instead</span>
                    </button>
                  )}
                </div>
              ) : (
                sortedRides.map((ride) => (
                  <RideHorizontalCard
                    key={ride._id}
                    ride={ride}
                    selected={selectedRide?._id === ride._id}
                    onSelect={onSelectRide}
                    onHoverIn={onHoverRide}
                    onHoverOut={onHoverRide}
                  />
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingRideResults;
