import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { MapPin, Navigation, Calendar, CheckCircle, XCircle, Clock, DollarSign, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import ChatWidget from '../components/chat/ChatWidget';
import RatingModal from '../components/RatingModal';

const STATUS_CONFIG = {
  confirmed:   { badge: 'badge-success',  icon: CheckCircle, label: 'Confirmed' },
  completed:   { badge: 'badge-violet',   icon: CheckCircle, label: 'Completed' },
  cancelled:   { badge: 'badge-error',    icon: XCircle,     label: 'Cancelled' },
  rejected:    { badge: 'badge-error',    icon: XCircle,     label: 'Rejected' },
  pending:     { badge: 'badge-warning',  icon: Clock,       label: 'Pending' },
  in_progress: { badge: 'badge-info',     icon: Car,         label: 'En Route' },
};

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex justify-between mb-5">
      <div className="h-5 w-24 skeleton" />
      <div className="h-5 w-20 skeleton" />
    </div>
    <div className="space-y-3 mb-5">
      <div className="h-4 w-full skeleton" />
      <div className="h-4 w-3/4 skeleton" />
    </div>
    <div className="h-px bg-gray-100 dark:bg-[#1e1e1e] mb-4" />
    <div className="flex justify-between">
      <div className="h-4 w-20 skeleton" />
      <div className="h-6 w-14 skeleton" />
    </div>
  </div>
);

const MyRides = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBooking, setRatingBooking] = useState(null);

  const authContext = React.useContext(AuthContext);
  const user = authContext?.user;
  
  const socketContext = React.useContext(SocketContext);
  const socket = socketContext?.socket;
  const rideStatus = socketContext?.rideStatus;

  // Auto-trigger rating modal when ride is completed via socket
  useEffect(() => {
    if (rideStatus?.status === 'completed') {
      const booking = bookings.find(b => b._id === rideStatus.bookingId);
      if (booking) {
        setRatingBooking(booking);
        setShowRatingModal(true);
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/user');
        setBookings(data.reverse());
      } catch {
        setError('Failed to load your trips.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f8f8] dark:bg-[#0c0c0c] pt-10 pb-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p className="section-label mb-2">Account</p>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">My Trips</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {loading ? 'Loading…' : `${bookings.length} bookings total`}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#161616] border border-gray-100 dark:border-[#242424] p-1.5 rounded-xl">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === f
                    ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-bold text-gray-500 dark:text-gray-400">No trips yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Book your first ride to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((booking, idx) => {
                const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;

                return (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                    className="card-hover p-6"
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-5">
                      <span className={cfg.badge}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <Calendar size={11} />
                        {new Date(booking.createdAt).toLocaleDateString('en', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="relative pl-5 mb-5 space-y-4">
                      <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-gray-100 dark:bg-[#2a2a2a]" />
                      <div className="absolute left-0 top-1.5 w-3 h-3 bg-indigo-500 rounded-full" />
                      <div className="absolute left-0 bottom-1.5 w-3 h-3 bg-violet-500 rounded-sm" />
                      <div>
                        <p className="section-label mb-1">Pickup</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                          {booking.ride?.source || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="section-label mb-1">Dropoff</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                          {booking.ride?.destination || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-[#1e1e1e]">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Car size={12} />
                        <span>{booking.ride?.carType || 'Standard'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                          <button
                            onClick={() => handleChatOpen(booking)}
                            className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            💬 Chat
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => handleRateOpen(booking)}
                            className="text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            ⭐️ Rate
                          </button>
                        )}
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-emerald-500" />
                          <span className="text-xl font-black text-gray-900 dark:text-white">
                            {booking.ride?.price ?? '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && bookings.length > 0 && (
              <div className="col-span-full card p-12 text-center">
                <p className="font-semibold text-gray-400">No trips match this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>

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

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        bookingId={ratingBooking?._id}
        targetId={ratingBooking?.ride?.driver?._id || ratingBooking?.ride?.driver}
        reviewerType="user"
        targetName={ratingBooking?.ride?.driver?.name || 'Driver'}
      />
    </div>
  );
};

export default MyRides;
