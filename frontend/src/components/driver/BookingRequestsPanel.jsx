import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, CheckCircle, XCircle, Users, DollarSign, Clock } from 'lucide-react';
import { BookingCardSkeleton } from './SkeletonLoaders';

const STATUS_BADGE = {
  pending:     'badge-warning',
  confirmed:   'badge-success',
  in_progress: 'badge-info',
  completed:   'badge-violet',
  rejected:    'badge-error',
  cancelled:   'badge-neutral',
};

const STATUS_LABEL = {
  pending: '⏳ Pending', confirmed: '✅ Accepted', in_progress: '🚗 En Route',
  completed: '🎉 Done', rejected: '❌ Rejected', cancelled: '🚫 Cancelled',
};

const BookingRequestsPanel = ({ bookings, loading, onUpdateStatus }) => {
  return (
    <div className="flex flex-col h-full card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-[#1e1e1e] flex-shrink-0">
        <div>
          <h2 className="font-black text-[15px] text-gray-900 dark:text-white">Requests</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {bookings.filter(b => b.status === 'pending').length} pending
          </p>
        </div>
        <span className={`w-2 h-2 rounded-full ${bookings.some(b => b.status === 'pending') ? 'bg-amber-400 animate-pulse' : 'bg-gray-200 dark:bg-[#333]'}`} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-3">
              <Users size={20} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-400">No requests yet</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">New bookings will appear here</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking._id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: idx * 0.04 }}
                className="surface rounded-2xl p-4 hover:border-gray-200 dark:hover:border-[#333] transition-all"
              >
                {/* Passenger + status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {booking.user?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{booking.user?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[110px]">{booking.user?.email}</p>
                    </div>
                  </div>
                  <span className={STATUS_BADGE[booking.status]}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                </div>

                {/* Route */}
                <div className="bg-gray-50 dark:bg-[#0f0f0f] rounded-xl p-3 mb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-indigo-500 flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">{booking.ride?.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation size={11} className="text-violet-500 flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">{booking.ride?.destination}</p>
                  </div>
                </div>

                {/* Fare + time */}
                <div className="flex justify-between items-center mb-3 px-0.5">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    {booking.ride?.time ? new Date(booking.ride.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">${booking.ride?.price ?? '—'}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={() => onUpdateStatus(booking, 'confirmed')} className="btn-success flex-1 py-2 text-xs">
                        <CheckCircle size={13} /> Accept
                      </button>
                      <button onClick={() => onUpdateStatus(booking, 'rejected')} className="btn-danger flex-1 py-2 text-xs">
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button onClick={() => onUpdateStatus(booking, 'in_progress')} className="btn-accent w-full py-2 text-xs">
                      🚗 Start Ride
                    </button>
                  )}
                  {booking.status === 'in_progress' && (
                    <button onClick={() => onUpdateStatus(booking, 'completed')} className="btn-success w-full py-2 text-xs">
                      🏁 Complete Ride
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default BookingRequestsPanel;
