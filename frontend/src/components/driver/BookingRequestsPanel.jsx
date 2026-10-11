import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Users, Clock, Navigation2 } from 'lucide-react';
import { BookingCardSkeleton } from './SkeletonLoaders';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RouteConnector from '../ui/RouteConnector';
import FareLabel from '../ui/FareLabel';
import { formatCurrency, formatTime } from '../../utils/formatters';

const STATUS_MAP = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Accepted', variant: 'success' },
  in_progress: { label: 'En Route', variant: 'info' },
  completed: { label: 'Completed', variant: 'neutral' },
  rejected: { label: 'Rejected', variant: 'error' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
};

const BookingRequestsPanel = ({ bookings, loading, onUpdateStatus }) => {
  const [confirmRejectId, setConfirmRejectId] = React.useState(null);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden shadow-subtle">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <div>
          <h2 className="font-bold text-sm text-text-primary">
            Scheduled Bookings
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {pendingCount} pending passenger reservation{pendingCount !== 1 ? 's' : ''}
          </p>
        </div>
        <span
          className={`w-2 h-2 rounded-full ${
            pendingCount > 0 ? 'bg-warning animate-pulse' : 'bg-border'
          }`}
        />
      </div>

      {/* Bookings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center mb-3 text-text-muted">
              <Users size={20} />
            </div>
            <p className="text-sm font-semibold text-text-primary">No Booking Requests</p>
            <p className="text-xs text-text-muted mt-1 max-w-[200px]">
              Passenger bookings on your scheduled routes will appear here
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {bookings.map((booking, idx) => {
              const statusCfg = STATUS_MAP[booking.status] || { label: booking.status, variant: 'neutral' };

              return (
                <motion.div
                  key={booking._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-4 rounded-lg bg-background border border-border space-y-3"
                >
                  {/* Passenger row */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {booking.user?.name?.charAt(0) || 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-text-primary truncate">
                          {booking.user?.name || 'Passenger'}
                        </p>
                        <p className="text-[11px] text-text-muted truncate max-w-[140px]">
                          {booking.user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusCfg.variant}>
                      {statusCfg.label}
                    </Badge>
                  </div>

                  {/* Route summary */}
                  <RouteConnector
                    pickup={booking.ride?.source || 'Pickup point'}
                    destination={booking.ride?.destination || 'Destination point'}
                  />

                  {/* Fare & Departure */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Clock size={12} />
                      <span>
                        {booking.ride?.time ? formatTime(booking.ride.time) : 'Scheduled'}
                      </span>
                    </div>
                    <FareLabel amount={booking.ride?.price ?? 0} size="sm" />
                  </div>

                  {/* Action controls */}
                  <div className="flex gap-2 pt-1">
                    {booking.status === 'pending' && (
                      confirmRejectId === booking._id ? (
                        <div className="flex flex-col gap-1.5 w-full bg-danger-subtle/50 p-2 rounded-lg border border-red-200 dark:border-red-900/40">
                          <p className="text-[11px] font-semibold text-danger">Reject this passenger reservation?</p>
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setConfirmRejectId(null);
                                onUpdateStatus(booking, 'rejected');
                              }}
                            >
                              <X size={14} className="mr-1" /> Confirm Reject
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              onClick={() => setConfirmRejectId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1 bg-success hover:bg-success/90"
                            onClick={() => onUpdateStatus(booking, 'confirmed')}
                          >
                            <Check size={14} className="mr-1" /> Accept
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => setConfirmRejectId(booking._id)}
                          >
                            <X size={14} className="mr-1" /> Reject
                          </Button>
                        </>
                      )
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => onUpdateStatus(booking, 'in_progress')}
                      >
                        <Navigation2 size={14} className="mr-1" /> Start Ride
                      </Button>
                    )}
                    {booking.status === 'in_progress' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full bg-success hover:bg-success/90"
                        onClick={() => onUpdateStatus(booking, 'completed')}
                      >
                        <Check size={14} className="mr-1" /> Complete Ride
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default BookingRequestsPanel;
