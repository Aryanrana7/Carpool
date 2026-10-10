import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  Car,
  MessageSquare,
  Star,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import ChatWidget from '../components/chat/ChatWidget';
import RatingModal from '../components/RatingModal';
import ActiveTripModal from '../components/ActiveTripModal';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import RouteConnector from '../components/ui/RouteConnector';

const FILTERS = [
  { id: 'all', label: 'All Trips' },
  { id: 'in_progress', label: 'En Route' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const SkeletonCard = () => (
  <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton width="90px" height="22px" />
      <Skeleton width="80px" height="16px" />
    </div>
    <div className="space-y-2 py-2">
      <Skeleton width="100%" height="16px" />
      <Skeleton width="75%" height="16px" />
    </div>
    <div className="pt-2 border-t border-border flex justify-between items-center">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="70px" height="20px" />
    </div>
  </div>
);

export const MyRides = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const [showChat, setShowChat] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBooking, setRatingBooking] = useState(null);

  const [showActiveModal, setShowActiveModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const rideStatus = socketContext?.rideStatus;
  const handledBookingsRef = useRef(new Set());

  // Auto-trigger rating modal when ride is completed via socket
  useEffect(() => {
    if (rideStatus?.status === 'completed' && rideStatus?.bookingId) {
      if (!handledBookingsRef.current.has(rideStatus.bookingId)) {
        const booking = bookings.find((b) => b._id === rideStatus.bookingId);
        if (booking) {
          handledBookingsRef.current.add(rideStatus.bookingId);
          queueMicrotask(() => {
            setRatingBooking(booking);
            setShowRatingModal(true);
            setShowActiveModal(false);
          });
        }
      }
    }
  }, [rideStatus, bookings]);

  const handleChatOpen = (booking) => {
    setChatBooking(booking);
    setShowChat(true);
  };

  const handleRateOpen = (booking) => {
    setRatingBooking(booking);
    setShowRatingModal(true);
  };

  const handleReviewSuccess = (bookingId, newReview) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, review: newReview } : b))
    );
  };

  const handleOpenActiveRide = (booking) => {
    setActiveBooking(booking);
    setShowActiveModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await api.put(`/bookings/${cancelTarget._id}/status`, { status: 'cancelled' });
      setBookings((prev) =>
        prev.map((b) => (b._id === cancelTarget._id ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled successfully');
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my-bookings');
        setBookings(data.reverse());
      } catch {
        setError('Failed to retrieve your trip bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter);

  return (
    <div className="min-h-[calc(100vh-68px)] bg-background py-8 sm:py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
            <p className="micro-label">Passenger Account</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-0.5">
              My Trips & Bookings
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              {loading ? 'Retrieving records…' : `${bookings.length} total ride bookings on record`}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-md bg-surface border border-border overflow-x-auto scrollbar-none shadow-subtle">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-xs font-medium text-danger bg-danger-subtle p-3.5 rounded-md border border-red-200 dark:border-red-900/40">
            {error}
          </div>
        )}

        {/* Trips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No Trips Booked Yet"
            description="You haven't booked any rides yet. Search for available carpools or request an instant on-demand pickup."
            actionLabel="Find a Ride"
            onAction={() => (window.location.href = '/')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((booking) => (
                <div
                  key={booking._id}
                  className={`
                    bg-surface border rounded-lg p-5 transition-all text-left flex flex-col justify-between
                    ${booking.status === 'in_progress'
                      ? 'border-primary ring-1 ring-primary/30 shadow-card'
                      : 'border-border hover:border-border-subtle shadow-subtle'
                    }
                  `}
                >
                  <div>
                    {/* Header: Status Badge & Booking Date */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge status={booking.status} size="sm" />
                      <span className="text-xs text-text-muted tabular-nums">
                        {formatDate(booking.createdAt, { relative: false })}
                      </span>
                    </div>

                    {/* Route Visualizer */}
                    <div className="flex items-stretch gap-2.5 mb-4">
                      <RouteConnector className="py-1" />
                      <div className="flex-1 space-y-2 text-xs">
                        <div>
                          <p className="text-[10px] text-text-muted uppercase font-semibold">Pickup</p>
                          <p className="font-semibold text-text-primary leading-snug">
                            {booking.ride?.pickupLocation || booking.ride?.source || 'Pickup point'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-muted uppercase font-semibold">Dropoff</p>
                          <p className="font-semibold text-text-primary leading-snug">
                            {booking.ride?.dropoffLocation || booking.ride?.destination || 'Destination point'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Driver, Price & Actions */}
                  <div className="pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Car size={14} className="text-text-muted" />
                      <span className="font-medium text-text-primary">
                        {booking.ride?.carType || 'Sedan'}
                      </span>
                      {booking.ride?.driver?.name && (
                        <span>· {booking.ride.driver.name}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {booking.status === 'in_progress' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={Car}
                          onClick={() => handleOpenActiveRide(booking)}
                        >
                          View Active Ride
                        </Button>
                      )}

                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setCancelTarget(booking)}
                        >
                          Cancel
                        </Button>
                      )}

                      {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={MessageSquare}
                          onClick={() => handleChatOpen(booking)}
                        >
                          Chat
                        </Button>
                      )}

                      {booking.status === 'completed' && (
                        booking.review ? (
                          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800/40 flex items-center gap-1">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            {booking.review.rating}/5 Rated
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={Star}
                            onClick={() => handleRateOpen(booking)}
                          >
                            Rate Driver
                          </Button>
                        )
                      )}

                      <span className="text-base font-bold text-text-primary tabular-nums pl-1">
                        {formatCurrency(booking.ride?.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && bookings.length > 0 && (
              <div className="col-span-full p-8 text-center bg-surface border border-border rounded-lg text-xs text-text-muted">
                No trips match this filter criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="cancel-title"
              className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full shadow-modal space-y-4"
            >
              <div className="flex items-center gap-3 text-danger">
                <AlertTriangle size={20} />
                <h3 id="cancel-title" className="text-base font-bold text-text-primary">
                  Cancel Booking?
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to cancel this booking? The held seat will be restored to the driver's ride.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelTarget(null)}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  loading={isCancelling}
                  onClick={confirmCancelBooking}
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Active Trip Modal */}
      <ActiveTripModal
        isOpen={showActiveModal}
        booking={activeBooking}
        onClose={() => setShowActiveModal(false)}
        onChatOpen={handleChatOpen}
      />

      {/* Chat Widget */}
      <AnimatePresence>
        {showChat && chatBooking && (
          <ChatWidget
            bookingId={chatBooking._id}
            participantId={chatBooking.ride?.driver?._id || chatBooking.ride?.driver}
            participantName={chatBooking.ride?.driver?.name || 'Driver'}
            currentUserId={user?._id}
            socket={socket}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        bookingId={ratingBooking?._id}
        targetName={ratingBooking?.ride?.driver?.name || 'Driver'}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default MyRides;
