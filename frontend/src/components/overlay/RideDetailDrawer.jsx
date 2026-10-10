import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Navigation,
  Clock,
  Star,
  Zap,
  ShieldCheck,
  Users,
  ArrowRight,
  Car,
  Bike,
  Shield,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import RouteConnector from '../ui/RouteConnector';

const RIDE_TYPE_ICONS = {
  mini: Bike,
  sedan: Car,
  suv: Shield,
};

const RIDE_LABEL = {
  mini: 'Mini',
  sedan: 'Sedan',
  suv: 'SUV',
};

/* ── Skeleton ─────────────────────────────────────── */
const DrawerSkeleton = () => (
  <div className="p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton width="48px" height="48px" />
      <div className="space-y-1.5 flex-1">
        <Skeleton width="50%" height="16px" />
        <Skeleton width="35%" height="12px" />
      </div>
    </div>
    <Skeleton height="90px" />
    <Skeleton height="110px" />
    <Skeleton height="50px" />
  </div>
);

/* ── Fare row ─────────────────────────────────────── */
const FareRow = ({ label, value, highlight, surge }) => (
  <div className={`flex justify-between items-center text-xs ${highlight ? 'pt-2.5 border-t border-border mt-2 font-bold text-sm' : 'text-text-secondary'}`}>
    <span className={surge ? 'text-warning font-medium' : ''}>{label}</span>
    <span className={`tabular-nums ${highlight ? 'text-text-primary text-base' : 'text-text-primary font-medium'}`}>
      {value}
    </span>
  </div>
);

export const RideDetailDrawer = ({
  show,
  ride,
  loading,
  route,
  pricing,
  rideType = 'sedan',
  onBook,
  onClose,
}) => {
  const base = pricing?.baseFare ?? (ride ? ride.price * 0.65 : null);
  const dist = pricing?.distanceFare ?? (ride ? ride.price * 0.25 : null);
  const time = pricing?.timeFare ?? (ride ? ride.price * 0.10 : null);
  const surge = pricing?.surgeMultiplier ?? 1.0;

  const IconComponent = RIDE_TYPE_ICONS[rideType] || Car;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[600] bg-ink/40 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-label="Ride Details"
            className="fixed top-0 right-0 bottom-0 z-[700] w-full sm:w-[400px] flex flex-col bg-surface shadow-modal border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <p className="micro-label">Scheduled Ride</p>
                <h2 className="text-base font-bold text-text-primary mt-0.5">
                  Ride Details
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close ride details"
                className="w-8 h-8 rounded-md border border-border bg-surface hover:bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading ? (
                <DrawerSkeleton />
              ) : ride ? (
                <>
                  {/* Driver & Vehicle */}
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center font-bold text-base shrink-0">
                        {ride.driver?.name?.charAt(0).toUpperCase() || 'D'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-text-primary truncate">
                          {ride.driver?.name || 'Verified Driver'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
                          {ride.driver?.rating > 0 ? (
                            <div className="flex items-center gap-0.5 text-amber-500">
                              <Star size={11} className="fill-amber-400 text-amber-400" />
                              <span className="font-semibold tabular-nums">{ride.driver.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-text-muted">New driver</span>
                          )}
                          <span>·</span>
                          <span className="truncate">{ride.carType || RIDE_LABEL[rideType] || 'Sedan'}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-md bg-border-subtle flex items-center justify-center text-text-secondary shrink-0">
                        <IconComponent size={16} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border flex-wrap">
                      <Badge status="confirmed" label={`${ride.seats} seats left`} size="sm" />
                      {surge > 1 && (
                        <span className="text-[11px] font-semibold text-warning bg-warning-subtle px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                          {surge}× surge rate
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Route Visualizer */}
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <p className="micro-label mb-3">Journey Route</p>
                    <div className="flex items-stretch gap-2.5">
                      <RouteConnector className="py-1" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-[10px] text-text-muted uppercase font-semibold">Pickup</p>
                          <p className="text-xs font-semibold text-text-primary leading-snug">
                            {route?.source?.address || ride.pickupLocation || ride.source}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-muted uppercase font-semibold">Destination</p>
                          <p className="text-xs font-semibold text-text-primary leading-snug">
                            {route?.destination?.address || ride.dropoffLocation || ride.destination}
                          </p>
                        </div>
                      </div>
                    </div>

                    {(route?.distance || route?.duration) && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-text-secondary">
                        <span className="tabular-nums">Distance: <strong className="text-text-primary">{route.distance}</strong></span>
                        <span className="tabular-nums">Est. Time: <strong className="text-text-primary">{route.duration}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Scheduled Departure Time */}
                  {ride.time && (
                    <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-border-subtle flex items-center justify-center text-text-secondary shrink-0">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="micro-label">Departure</p>
                        <p className="text-xs font-bold text-text-primary mt-0.5 tabular-nums">
                          {formatDate(ride.time)} at {formatTime(ride.time)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="bg-surface border border-border rounded-lg p-4 space-y-2">
                    <p className="micro-label">Fare Details</p>
                    <div className="space-y-1.5">
                      {base !== null && <FareRow label="Base fare" value={formatCurrency(base)} />}
                      {dist !== null && <FareRow label="Distance fare" value={formatCurrency(dist)} />}
                      {time !== null && <FareRow label="Time fare" value={formatCurrency(time)} />}
                      {surge > 1 && <FareRow label={`Peak Surge (${surge}×)`} value="Included" surge />}
                      <FareRow label="Total Amount" value={formatCurrency(ride.price)} highlight />
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Bottom Actions */}
            {!loading && ride && (
              <div className="p-4 border-t border-border bg-surface shrink-0 space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => onBook(ride)}
                  rightIcon={ArrowRight}
                >
                  Book Seat Now · {formatCurrency(ride.price)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RideDetailDrawer;
