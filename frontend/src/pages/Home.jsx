import React, { useState, useRef, useEffect, useContext, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import HeroBookingSection from '../components/HeroBookingSection';
import RideResultsSection from '../components/RideResultsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import WhyChooseSection from '../components/WhyChooseSection';
import DriverCtaBanner from '../components/DriverCtaBanner';
import FooterSection from '../components/FooterSection';
import OnDemandRideTracker from '../components/overlay/OnDemandRideTracker';
import ChatWidget from '../components/chat/ChatWidget';
import RatingModal from '../components/RatingModal';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
const RideDetailDrawer = React.lazy(() => import('../components/overlay/RideDetailDrawer'));
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const onDemandAssignment = socketContext?.onDemandAssignment;
  const onDemandStatus = socketContext?.onDemandStatus;

  // Search mode: 'scheduled' | 'on_demand'
  const [searchMode, setSearchMode] = useState('scheduled');

  // Location & route
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // Rides (scheduled)
  const [rides, setRides] = useState([]);
  const [featuredRides, setFeaturedRides] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [hoveredRide, setHoveredRide] = useState(null);
  const [loadingRides, setLoadingRides] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // On-demand request state
  const [onDemandRequest, setOnDemandRequest] = useState(null);
  const [requestingOnDemand, setRequestingOnDemand] = useState(false);

  // Drawer & Modals
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Chat & Rating
  const [showChat, setShowChat] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);

  // Smart pricing
  const [selectedRideType, setSelectedRideType] = useState('sedan');
  const [selectedFare, setSelectedFare] = useState(null);

  const searchRequestIdRef = useRef(0);

  // Load genuine featured / upcoming rides from backend on mount
  useEffect(() => {
    const fetchUpcomingRides = async () => {
      setLoadingFeatured(true);
      try {
        const { data } = await api.get('/rides');
        if (Array.isArray(data)) {
          const now = new Date();
          const valid = data.filter((r) => r.status === 'active' && r.seats > 0 && new Date(r.time) >= now);
          setFeaturedRides(valid);
        }
      } catch {
        // silent
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchUpcomingRides();
  }, []);

  // Check for active on-demand request on mount
  useEffect(() => {
    if (!user) return;
    const fetchActive = async () => {
      try {
        const { data } = await api.get('/ride-requests/active');
        if (data.activeRequest) {
          setOnDemandRequest(data.activeRequest);
          setSearchMode('on_demand');
        }
      } catch {
        // silent
      }
    };
    fetchActive();
  }, [user]);

  // Handle socket assignment
  useEffect(() => {
    if (onDemandAssignment && onDemandRequest) {
      if (onDemandAssignment.requestId === onDemandRequest._id) {
        setOnDemandRequest((prev) => ({
          ...prev,
          driver: onDemandAssignment.driver,
          booking: onDemandAssignment.bookingId,
          ride: onDemandAssignment.rideId,
          status: 'accepted',
        }));
        toast.success('Driver assigned! Heading to pickup location.');
      }
    }
  }, [onDemandAssignment]);

  // Handle socket status updates
  useEffect(() => {
    if (onDemandStatus && onDemandRequest) {
      if (onDemandStatus.requestId === onDemandRequest._id) {
        setOnDemandRequest((prev) => ({
          ...prev,
          status: onDemandStatus.status,
        }));
        if (onDemandStatus.status === 'completed') {
          toast.success('Ride completed! Please rate your driver.');
        } else if (onDemandStatus.status === 'cancelled') {
          toast.error('Ride was cancelled.');
        }
      }
    }
  }, [onDemandStatus]);

  const calculateRoute = async (src, dest) => {
    if (!src || !dest) return;
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${src.lng},${src.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.code === 'Ok') {
        const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
        setRoutePoints(coords);
        setDistance((data.routes[0].distance / 1000).toFixed(1) + ' km');
        setDuration((data.routes[0].duration / 60).toFixed(0) + ' mins');
      }
    } catch {
      // silent
    }
  };

  const handleSourceChange = (place) => {
    setSource(place);
    setSelectedRide(null);
    if (destination && place?.lat && destination?.lat) {
      calculateRoute(place, destination);
    } else {
      setRoutePoints([]);
      setDistance('');
      setDuration('');
    }
  };

  const handleDestinationChange = (place) => {
    setDestination(place);
    setSelectedRide(null);
    if (source && source?.lat && place?.lat) {
      calculateRoute(source, place);
    } else {
      setRoutePoints([]);
      setDistance('');
      setDuration('');
    }
  };

  const handleRideTypeSelect = (type, fare) => {
    setSelectedRideType(type);
    setSelectedFare(fare);
  };

  // Scheduled Ride Search
  const handleSearch = async (searchParams = {}) => {
    if (!source?.address || !destination?.address) {
      toast.error('Please select pickup and dropoff locations.');
      return;
    }

    const srcTrimmed = source.address.trim().toLowerCase();
    const dstTrimmed = destination.address.trim().toLowerCase();
    if (
      srcTrimmed === dstTrimmed ||
      (source.lat && destination.lat && source.lat === destination.lat && source.lng === destination.lng)
    ) {
      toast.error('Pickup and dropoff cannot be the same.');
      return;
    }

    const currentRequestId = ++searchRequestIdRef.current;

    setLoadingRides(true);
    setRides([]);
    setSelectedRide(null);
    setShowDrawer(false);
    setHasSearched(true);

    try {
      let searchUrl = `/rides/search?source=${encodeURIComponent(source.address.trim())}&destination=${encodeURIComponent(
        destination.address.trim()
      )}`;
      if (searchParams.date) {
        searchUrl += `&date=${encodeURIComponent(searchParams.date)}`;
      }
      const { data } = await api.get(searchUrl);
      if (searchRequestIdRef.current !== currentRequestId) return;

      let results = data || [];
      if (searchParams.passengerCount && searchParams.passengerCount > 1) {
        results = results.filter((r) => r.seats >= searchParams.passengerCount);
      }
      setRides(results);

      // Smooth scroll to the results section below hero
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      if (searchRequestIdRef.current !== currentRequestId) return;
      console.error('Search rides error:', error);
      toast.error('Network error. Please try again.');
      setRides([]);
    } finally {
      if (searchRequestIdRef.current === currentRequestId) {
        setLoadingRides(false);
      }
    }
  };

  // On-Demand Ride Request
  const handleRequestOnDemand = async ({ passengerCount = 1 }) => {
    if (!user) {
      toast.error('Please sign in to request an on-demand ride');
      navigate('/login');
      return;
    }

    if (!source?.address || !destination?.address) {
      toast.error('Please select pickup and dropoff locations.');
      return;
    }

    const distKm = parseFloat(distance.replace(' km', '')) || 0;
    const durMin = parseFloat(duration.replace(' mins', '')) || 0;

    setRequestingOnDemand(true);
    try {
      const { data } = await api.post('/ride-requests', {
        pickup: {
          address: source.address,
          lat: source.lat,
          lng: source.lng,
        },
        destination: {
          address: destination.address,
          lat: destination.lat,
          lng: destination.lng,
        },
        passengerCount,
        rideType: selectedRideType,
        distanceKm: distKm,
        durationMin: durMin,
      });

      setOnDemandRequest(data.rideRequest);
      toast.success(data.message || 'Ride requested! Searching for drivers…');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request ride');
      if (err.response?.data?.activeRequest) {
        setOnDemandRequest(err.response.data.activeRequest);
      }
    } finally {
      setRequestingOnDemand(false);
    }
  };

  const handleSelectRide = (ride) => {
    setSelectedRide(ride);
    setDrawerLoading(true);
    setShowDrawer(true);
    setTimeout(() => setDrawerLoading(false), 250);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedRide(null);
    setDrawerLoading(false);
  };

  const handleCloseResults = () => {
    setHasSearched(false);
    setSelectedRide(null);
    setRides([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBook = (ride) => {
    navigate('/booking', {
      state: {
        ride,
        route: { source, destination, distance, duration },
        pricing: selectedFare,
        rideType: selectedRideType,
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-68px)] w-full bg-background flex flex-col font-sans transition-colors">
      {/* ── 1. Bold, Full-Width Booking Hero (Centerpiece) ── */}
      <HeroBookingSection
        source={source}
        destination={destination}
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        onSearch={handleSearch}
        mode={searchMode}
        onModeChange={setSearchMode}
        selectedRideType={selectedRideType}
        onRideTypeSelect={handleRideTypeSelect}
        loadingRides={loadingRides}
        onRequestOnDemand={handleRequestOnDemand}
        requestingOnDemand={requestingOnDemand}
        distance={distance}
        duration={duration}
      />

      {/* ── 2. Real-Data Ride Discovery & Route Results ─── */}
      <RideResultsSection
        hasSearched={hasSearched}
        rides={rides}
        loadingRides={loadingRides}
        source={source}
        destination={destination}
        selectedRide={selectedRide}
        onSelectRide={handleSelectRide}
        hoveredRide={hoveredRide}
        onHoverRide={setHoveredRide}
        routePoints={routePoints}
        distance={distance}
        duration={duration}
        showDrawer={showDrawer}
        onResetSearch={handleCloseResults}
        onSwitchToOnDemand={() => {
          setSearchMode('on_demand');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        featuredRides={featuredRides}
        loadingFeatured={loadingFeatured}
      />

      {/* ── 3. How CarPool Works ─────────────────────────── */}
      <HowItWorksSection />

      {/* ── 4. Why Choose CarPool ────────────────────────── */}
      <WhyChooseSection />

      {/* ── 5. Driver Partner Call-To-Action Banner ───────── */}
      <DriverCtaBanner />

      {/* ── 6. Full Commercial Footer ────────────────────── */}
      <FooterSection />

      {/* ── Active On-Demand Tracker Overlay ────────────── */}
      <AnimatePresence>
        {onDemandRequest && (
          <OnDemandRideTracker
            request={onDemandRequest}
            onCancel={() => setOnDemandRequest(null)}
            onChatOpen={() => setShowChat(true)}
            onRateOpen={(req) => {
              setRatingTarget(req);
              setShowRatingModal(true);
            }}
            onClose={() => setOnDemandRequest(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Ride detail drawer (slide-in) ────────────────── */}
      <Suspense fallback={null}>
        <RideDetailDrawer
          show={showDrawer}
          ride={selectedRide}
          loading={drawerLoading}
          route={{ source, destination, distance, duration }}
          pricing={selectedFare}
          rideType={selectedRideType}
          onBook={handleBook}
          onClose={handleCloseDrawer}
        />
      </Suspense>

      {/* ── On-demand Chat Widget ────────────────────────── */}
      <AnimatePresence>
        {showChat && onDemandRequest && onDemandRequest.booking && (
          <ChatWidget
            bookingId={onDemandRequest.booking}
            participantId={onDemandRequest.driver?._id || onDemandRequest.driver}
            participantName={onDemandRequest.driver?.name || 'Driver'}
            currentUserId={user?._id}
            socket={socket}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Rating Modal for completed on-demand ride ─────── */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setOnDemandRequest(null);
        }}
        bookingId={onDemandRequest?.booking}
        targetName={onDemandRequest?.driver?.name || 'Driver'}
        onSuccess={() => {
          setOnDemandRequest(null);
          toast.success('Review recorded!');
        }}
      />
    </div>
  );
};

export default Home;
