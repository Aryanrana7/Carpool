import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, History } from 'lucide-react';
import { Shimmer } from './SkeletonLoaders';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

const STATUS_VARIANT = {
  completed: 'success',
  cancelled: 'error',
  rejected: 'neutral',
  in_progress: 'info',
  confirmed: 'success',
  pending: 'warning',
};

const RideHistory = ({ bookings, loading }) => {
  const history = bookings.filter((b) => ['completed', 'cancelled', 'rejected'].includes(b.status));

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="font-bold text-sm text-text-primary">Trip History & Past Rides</h2>
          <p className="text-xs text-text-muted mt-0.5">{history.length} completed operations recorded</p>
        </div>
      </div>

      {/* Table Headers for Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2.5 bg-background border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        <span className="col-span-3">Date & Time</span>
        <span className="col-span-5">Route Summary</span>
        <span className="col-span-2 text-right">Fare Earnings</span>
        <span className="col-span-2 text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-4 animate-pulse grid grid-cols-12 gap-4 items-center">
              <Shimmer className="h-4 col-span-3" />
              <Shimmer className="h-4 col-span-5" />
              <Shimmer className="h-4 col-span-2" />
              <Shimmer className="h-5 col-span-2 rounded-full" />
            </div>
          ))
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-text-muted">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mx-auto mb-2.5 text-text-muted">
              <History size={18} />
            </div>
            <p className="font-semibold text-sm text-text-primary">No Past Trips Found</p>
            <p className="text-xs text-text-muted mt-0.5">Completed rides and recorded settlements will appear here</p>
          </div>
        ) : (
          history.map((booking, idx) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="px-5 py-3.5 hover:bg-background/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center text-xs"
            >
              {/* Date & Time */}
              <div className="md:col-span-3">
                <p className="font-semibold text-text-primary">
                  {booking.createdAt ? formatDate(booking.createdAt) : '—'}
                </p>
                <p className="text-[11px] text-text-muted">
                  {booking.createdAt ? formatTime(booking.createdAt) : ''}
                </p>
              </div>

              {/* Route */}
              <div className="md:col-span-5 space-y-1 w-full">
                <div className="flex items-center gap-1.5 text-text-primary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="truncate">{booking.ride?.source?.split(',')[0] || 'Pickup point'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <span className="w-1.5 h-1.5 rounded-sm bg-text-primary shrink-0" />
                  <span className="truncate">{booking.ride?.destination?.split(',')[0] || 'Dropoff point'}</span>
                </div>
              </div>

              {/* Earnings */}
              <div className="md:col-span-2 md:text-right flex items-center md:justify-end">
                <span
                  className={`font-bold tabular-nums ${
                    booking.status === 'completed'
                      ? 'text-text-primary'
                      : 'text-text-muted line-through'
                  }`}
                >
                  {formatCurrency(booking.ride?.price ?? 0)}
                </span>
              </div>

              {/* Status */}
              <div className="md:col-span-2 md:text-right flex items-center md:justify-end">
                <Badge variant={STATUS_VARIANT[booking.status] || 'neutral'}>
                  {booking.status}
                </Badge>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideHistory;
