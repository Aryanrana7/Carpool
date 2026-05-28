import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { DriverSocketContext } from '../../context/DriverSocketContext';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import StatCard from '../../components/driver/StatCard';
import BookingRequestsPanel from '../../components/driver/BookingRequestsPanel';
import ActiveRidePanel from '../../components/driver/ActiveRidePanel';
import DriverLiveMap from '../../components/driver/DriverLiveMap';
import RideHistory from '../../components/driver/RideHistory';
import ChatWidget from '../../components/chat/ChatWidget';
import RatingModal from '../../components/RatingModal';
import { StatCardSkeleton } from '../../components/driver/SkeletonLoaders';

import { CheckCircle, DollarSign, Car, Wifi, WifiOff, BarChart2, RefreshCw, PlusCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../../components/StarRating';

const AUTH_HEADER = () => ({ Authorization: `Bearer ${localStorage.getItem('driverToken')}` });

const DriverDashboard = () => {
  const navigate = useNavigate();
  const authContext = useContext(DriverAuthContext);
  const driver = authContext?.driver;
  
  const socketContext = useContext(DriverSocketContext);
  const socket = socketContext?.socket;
  const emitRideStatus = socketContext?.emitRideStatus;
  const startTracking = socketContext?.startTracking;
  const stopTracking = socketContext?.stopTracking;

  const [bookings, setBookings] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driverLiveLocation, setDriverLiveLocation] = useState(null);

  useEffect(() => {
    fetchData();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos =>
        setDriverLiveLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      );
    }
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        api.get('/bookings/driver', { headers: AUTH_HEADER() }),
        api.get('/bookings/driver/stats', { headers: AUTH_HEADER() }),
      ]);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success('Refreshed');
  };

  const handleUpdateStatus = async (booking, status) => {
    try {
      await api.put(`/bookings/${booking._id}/driver-status`, { status }, { headers: AUTH_HEADER() });
      emitRideStatus(booking._id, booking.user?._id, status);
      if (status === 'confirmed') startTracking(booking._id, booking.user?._id);
      if (status === 'completed' || status === 'rejected') stopTracking();
      const msgs = { confirmed: '✅ Accepted', rejected: '❌ Rejected', in_progress: '🚗 Ride started', completed: '🏁 Completed' };
      toast.success(msgs[status] || `Updated to ${status}`);
      
      if (status === 'completed') {
        setRatingBooking(booking);
        setShowRatingModal(true);
      }
      
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleChatOpen = (booking) => {
    setChatBooking(booking);
    setShowChat(true);
  };

  const handleRateOpen = (booking) => {
    setRatingBooking(booking);
    setShowRatingModal(true);
  };

  const activeRide = bookings.find(b => b.status === 'confirmed' || b.status === 'in_progress') || null;
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f8f8] dark:bg-[#0c0c0c]">
      <div className="max-w-[1600px] mx-auto p-6 space-y-5">

        {/* ── Top bar ─────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label mb-1">Driver Console</p>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="text-emerald-500">{driver?.name?.split(' ')[0] || 'Driver'}</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{driver?.carModel} · {driver?.carNumber}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="w-9 h-9 rounded-xl bg-white dark:bg-[#161616] border border-gray-100 dark:border-[#242424] flex items-center justify-center text-gray-500 hover:text-emerald-500 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => navigate('/driver/create-ride')}
              className="btn-success text-sm py-2 px-4"
            >
              <PlusCircle size={15} /> Post a Ride
            </button>
            <button
              onClick={() => { setIsOnline(p => !p); toast(!isOnline ? '🟢 Online' : '🔴 Offline'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-white dark:bg-[#161616] border-gray-200 dark:border-[#242424] text-gray-500'
              }`}
            >
              {isOnline ? <Wifi size={15} /> : <WifiOff size={15} />}
              {isOnline ? 'Online' : 'Offline'}
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* ── Stats cards ─────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard icon={CheckCircle} label="Completed Rides" value={stats?.totalRides ?? 0} sub="All time" color="emerald" trend={8} />
              <StatCard icon={DollarSign} label="Total Earnings" value={`$${stats?.totalEarnings ?? '0.00'}`} sub="From completed rides" color="blue" trend={12} />
              <StatCard icon={BarChart2} label="Rides Posted" value={stats?.totalRidesOffered ?? 0} sub="Published routes" color="violet" />
              <StatCard icon={Star} label="Your Rating" value={driver?.averageRating > 0 ? driver.averageRating.toFixed(1) : '—'} sub={`${driver?.totalReviews ?? 0} reviews`} color="amber" />
              <StatCard icon={Car} label="Status" value={isOnline ? 'Online' : 'Offline'} sub={`${stats?.pendingRequests ?? 0} pending`} color={isOnline ? 'emerald' : 'amber'}>
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
              </StatCard>
            </>
          )}
        </div>

        {/* ── Main 3-column grid ───────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5" style={{ height: '520px' }}>
          <div className="xl:col-span-4 h-full">
            <BookingRequestsPanel bookings={bookings} loading={loading} onUpdateStatus={handleUpdateStatus} />
          </div>
          <div className="xl:col-span-4 h-full">
            <ActiveRidePanel booking={activeRide} onUpdateStatus={handleUpdateStatus} onChatOpen={handleChatOpen} />
          </div>
          <div className="xl:col-span-4 h-full">
            <DriverLiveMap driverLocation={driverLiveLocation} />
          </div>
        </div>

        {/* ── Ride history ─────────────────────────── */}
        <RideHistory bookings={bookings} loading={loading} onRateOpen={handleRateOpen} />
        <div className="h-4" />
      </div>

      <AnimatePresence>
        {showChat && chatBooking && (
          <ChatWidget
            bookingId={chatBooking._id}
            participantId={chatBooking.user?._id}
            participantName={chatBooking.user?.name}
            currentUserId={driver?._id}
            socket={socket}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        bookingId={ratingBooking?._id}
        targetId={ratingBooking?.user?._id}
        reviewerType="driver"
        targetName={ratingBooking?.user?.name || 'Passenger'}
      />
    </div>
  );
};

export default DriverDashboard;
