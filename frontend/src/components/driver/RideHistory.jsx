import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, DollarSign, Calendar } from 'lucide-react';
import { Shimmer } from './SkeletonLoaders';

const STATUS_BADGE = {
  completed: 'badge-success',
  cancelled:  'badge-error',
  rejected:   'badge-neutral',
  in_progress:'badge-info',
  confirmed:  'badge-violet',
  pending:    'badge-warning',
};

const RideHistory = ({ bookings, loading }) => {
  const history = bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status));

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-[#1e1e1e]">
        <div>
          <h2 className="font-black text-[15px] text-gray-900 dark:text-white">Ride History</h2>
          <p className="text-xs text-gray-400 mt-0.5">{history.length} completed trips</p>
        </div>
      </div>

      {/* Table head */}
      <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-50 dark:border-[#1e1e1e]">
        {['Date', 'Route', '', 'Earnings', 'Status'].map((h, i) => (
          <span key={i} className={`section-label ${i === 1 ? 'col-span-2' : ''}`}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50 dark:divide-[#1a1a1a]">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-4 animate-pulse grid grid-cols-5 gap-4 items-center">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 col-span-2" />
              <Shimmer className="h-4 w-12" />
              <Shimmer className="h-5 w-20 rounded-full" />
            </div>
          ))
        ) : history.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="font-semibold text-sm text-gray-400">No history yet</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Completed rides appear here</p>
          </div>
        ) : (
          history.map((booking, idx) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#0f0f0f] transition-colors grid grid-cols-5 gap-4 items-center"
            >
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '—'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>

              <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin size={10} className="text-indigo-500 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">{booking.ride?.source?.split(',')[0] || '—'}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Navigation size={10} className="text-violet-500 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">{booking.ride?.destination?.split(',')[0] || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <DollarSign size={12} className="text-emerald-500" />
                <p className={`font-black text-sm ${booking.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600 line-through'}`}>
                  {booking.ride?.price ?? '0'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <span className={STATUS_BADGE[booking.status]}>{booking.status}</span>
                {booking.status === 'completed' && (
                  <button
                    onClick={() => onRateOpen && onRateOpen(booking)}
                    className="text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors"
                  >
                    ⭐️ Rate
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideHistory;
