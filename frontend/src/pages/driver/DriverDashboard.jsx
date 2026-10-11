import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { DriverSocketContext } from '../../context/DriverSocketContext';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import StatTile from '../../components/ui/StatTile';
import BookingRequestsPanel from '../../components/driver/BookingRequestsPanel';
import IncomingRequestsPanel from '../../components/driver/IncomingRequestsPanel';
import ActiveRidePanel from '../../components/driver/ActiveRidePanel';
import DriverLiveMap from '../../components/driver/DriverLiveMap';
import RideHistory from '../../components/driver/RideHistory';
import ChatWidget from '../../components/chat/ChatWidget';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import { StatCardSkeleton } from '../../components/driver/SkeletonLoaders';

import {
  CheckCircle2,
  Wallet,
  Car,
  Wifi,
  WifiOff,
  RefreshCw,
  PlusCircle,
  Star,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const AUTH_HEADER = () => ({ Authorization: `Bearer ${localStorage.getItem('driverToken')}` });

const DriverDashboard = () => {
  const navigate = useNavigate();
  const authContext = useContext(DriverAuthContext);
  const driver = authContext?.driver;

  const socketContext = useContext(DriverSocketContext);
  const socket = socketContext?.socket;
  const startTracking = socketContext?.startTracking;
  const stopTracking = socketContext?.stopTracking;
  const updateLocationOnce = socketContext?.updateLocationOnce;

  const isMountedRef = useRef(true);

  const [bookings, setBookings] = useState([]);
  const [activeOnDemandRide, setActiveOnDemandRide] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driverLiveLocation, setDriverLiveLocation] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        api.get('/bookings/driver', { headers: AUTH_HEADER() }),
        api.get('/bookings/driver/stats', { headers: AUTH_HEADER() }),
      ]);
      if (isMountedRef.current) {
        setBookings(bookingsRes.data || []);
        setStats(statsRes.data || null);
      }
    } catch {
      if (isMountedRef.current) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setStatsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    (async () => {
      await fetchDashboardData();
    })();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        if (isMountedRef.current) {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setDriverLiveLocation(loc);
          api.put('/drivers/location', loc, { headers: AUTH_HEADER() }).catch(() => {});
        }
      });
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Console refreshed');
  };

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    try {
      await api.put('/drivers/availability', { isAvailable: nextState }, { headers: AUTH_HEADER() });
      if (nextState && updateLocationOnce) {
        updateLocationOnce();
      }
      toast.success(nextState ? 'Online — accepting ride requests' : 'Offline — matching paused');
    } catch {
      setIsOnline(!nextState);
      toast.error('Failed to update availability status');
    }
  };

  const handleUpdateStatus = async (booking, status) => {
    try {
      await api.put(`/bookings/${booking._id}/driver-status`, { status }, { headers: AUTH_HEADER() });
      if (status === 'confirmed') startTracking(booking._id);
      if (status === 'completed' || status === 'rejected') stopTracking();
      const msgs = {
        confirmed: 'Booking Accepted',
        rejected: 'Booking Rejected',
        in_progress: 'Ride Started',
        completed: 'Trip Completed',
      };
      toast.success(msgs[status] || `Updated to ${status}`);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleOnDemandAccepted = (rideReq, bookingId) => {
    setActiveOnDemandRide(rideReq);
    if (startTracking) {
      startTracking(bookingId, rideReq._id);
    }
    fetchDashboardData();
  };

  const handleOnDemandStatusUpdated = (newStatus) => {
    if (activeOnDemandRide) {
      setActiveOnDemandRide((prev) => ({ ...prev, status: newStatus }));
      if (newStatus === 'completed') {
        if (stopTracking) stopTracking();
        setTimeout(() => setActiveOnDemandRide(null), 3000);
      }
    }
    fetchDashboardData();
  };

  const handleChatOpen = (target) => {
    if (target.user && target.ride) {
      setChatBooking({
        _id: target.booking || target._id,
        user: target.user,
      });
    } else {
      setChatBooking(target);
    }
    setShowChat(true);
  };

  const activeRide = bookings.find((b) => b.status === 'confirmed' || b.status === 'in_progress') || null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ── Console Header ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Welcome back,{' '}
              <span className="text-primary">
                {driver?.name?.split(' ')[0] || 'Driver'}
              </span>
            </h1>
            <p className="text-xs text-text-muted mt-1">
              {driver?.carModel || 'Standard Vehicle'} · {driver?.carNumber || 'Verified Registration'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* HERO CONTROL: Online / Offline status toggle */}
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`
                h-11 px-4 sm:px-5 rounded-lg font-semibold text-sm inline-flex items-center gap-2.5 transition-all shadow-subtle shrink-0 select-none cursor-pointer
                ${
                  isOnline
                    ? 'bg-success text-white hover:bg-success/90 ring-4 ring-success/20'
                    : 'bg-surface text-text-muted border border-border hover:bg-background hover:text-text-primary'
                }
              `}
              aria-label={isOnline ? 'Switch to offline' : 'Switch to online'}
            >
              {isOnline ? (
                <>
                  <Wifi size={16} className="shrink-0" />
                  <span>Online</span>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0 ml-0.5" />
                </>
              ) : (
                <>
                  <WifiOff size={16} className="shrink-0 text-text-muted" />
                  <span>Offline</span>
                  <span className="w-2 h-2 rounded-full bg-text-muted shrink-0 ml-0.5" />
                </>
              )}
            </button>

            {/* Secondary Action: Post Scheduled Ride */}
            <Button
              variant="secondary"
              leftIcon={PlusCircle}
              onClick={() => navigate('/driver/create-ride')}
              className="h-11 px-4 rounded-lg font-semibold text-sm whitespace-nowrap shadow-subtle shrink-0"
            >
              Post Scheduled Ride
            </Button>

            {/* Refresh */}
            <IconButton
              icon={RefreshCw}
              variant="secondary"
              ariaLabel="Refresh console"
              onClick={handleRefresh}
              className={`h-11 w-11 !min-h-[44px] !min-w-[44px] rounded-lg shadow-subtle shrink-0 ${refreshing ? 'animate-spin' : ''}`}
            />
          </div>
        </div>

        {/* ── Truthful Metric Strip ───────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {statsLoading ? (
            Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatTile
                icon={CheckCircle2}
                label="Completed Trips"
                value={stats?.totalRides ?? 0}
                subtext="Finished journeys"
              />
              <StatTile
                icon={Wallet}
                label="Earnings"
                value={formatCurrency(stats?.totalEarnings ?? 0)}
                subtext="Settled revenue"
              />
              <StatTile
                icon={Car}
                label="Rides Posted"
                value={stats?.totalRidesOffered ?? 0}
                subtext="Scheduled routes"
              />
              <StatTile
                icon={Star}
                label="Rating"
                value={driver?.averageRating > 0 ? driver.averageRating.toFixed(1) : ''}
                empty={!driver?.totalReviews || driver.totalReviews === 0}
                emptyText="No reviews yet"
                subtext={
                  driver?.totalReviews > 0
                    ? `${driver.totalReviews} verified review${driver.totalReviews > 1 ? 's' : ''}`
                    : 'Awaiting first review'
                }
              />
              <StatTile
                icon={Wifi}
                label="Dispatch Status"
                value={isOnline ? 'Active' : 'Standby'}
                subtext={isOnline ? 'Receiving broadcasts' : 'Offline'}
              >
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isOnline ? 'bg-success animate-pulse' : 'bg-text-muted'
                  }`}
                />
              </StatTile>
            </>
          )}
        </div>

        {/* ── On-Demand Incoming Broadcasts Section ────────── */}
        <IncomingRequestsPanel
          socket={socket}
          isOnline={isOnline}
          activeOnDemandRide={activeOnDemandRide}
          onRideAccepted={handleOnDemandAccepted}
          onRideStatusUpdated={handleOnDemandStatusUpdated}
          onChatOpen={handleChatOpen}
        />

        {/* ── 3-Column Operations Grid ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:h-[500px]">
          <div className="lg:col-span-4 h-full min-h-[360px] lg:min-h-0">
            <BookingRequestsPanel
              bookings={bookings}
              loading={loading}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
          <div className="lg:col-span-4 h-full min-h-[360px] lg:min-h-0">
            <ActiveRidePanel
              booking={activeRide}
              onUpdateStatus={handleUpdateStatus}
              onChatOpen={handleChatOpen}
            />
          </div>
          <div className="lg:col-span-4 h-full min-h-[360px] lg:min-h-0">
            <DriverLiveMap driverLocation={driverLiveLocation} />
          </div>
        </div>

        {/* ── Past Trip History ───────────────────────────── */}
        <RideHistory bookings={bookings} loading={loading} />
      </div>

      {/* Driver Chat Messenger */}
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
    </div>
  );
};

export default DriverDashboard;
