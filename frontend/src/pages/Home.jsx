import React, { useState, useRef, useEffect, useContext, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MapPanel from '../components/MapPanel';
import SearchAndResultsPanel from '../components/SearchAndResultsPanel';
import OnDemandRideTracker from '../components/overlay/OnDemandRideTracker';
import ChatWidget from '../components/chat/ChatWidget';
import RatingModal from '../components/RatingModal';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
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

  // Mobile active tab: 'search' | 'map'
  const [mobileTab, setMobileTab] = useState('search');

  // Location & route
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // Rides (scheduled)
  const [rides, setRides] = useState([]);
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
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRoutePoints(coords);
        setDistance((data.routes[0].distance / 1000).toFixed(1) + ' km');
        setDuration((data.routes[0].duration / 60).toFixed(0) + ' mins');
      }
    } catch { /* silent */ }
  };

  const handleSourceChange = (place) => {
    setSource(place);
    setRides([]);
    setHasSearched(false);
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
    setRides([]);
    setHasSearched(false);
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
    if (srcTrimmed === dstTrimmed || (source.lat && destination.lat && source.lat === destination.lat && source.lng === destination.lng)) {
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
      let searchUrl = `/rides/search?source=${encodeURIComponent(source.address.trim())}&destination=${encodeURIComponent(destination.address.trim())}`;
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
    <div className="relative w-full h-[calc(100vh-68px)] overflow-hidden bg-background flex flex-col md:flex-row">
      {/* ── Left Column: Grounded Search & Results Panel ─── */}
      <aside
        className={`
          w-full md:w-[420px] lg:w-[450px] shrink-0 h-full border-r border-border bg-surface flex flex-col z-10 shadow-sm overflow-hidden
          ${mobileTab === 'map' ? 'hidden md:flex' : 'flex'}
        `}
      >
        {onDemandRequest ? (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-heading font-bold text-base text-ink">Active Trip Tracking</h2>
                <p className="text-xs text-text-muted mt-0.5">Real-time driver dispatch & status</p>
              </div>
              <button
                type="button"
                onClick={() => setOnDemandRequest(null)}
                className="text-xs font-semibold text-text-muted hover:text-text-primary px-2.5 py-1 rounded bg-border-subtle hover:bg-border transition-colors"
              >
                Close View
              </button>
            </div>
            <OnDemandRideTracker
              request={onDemandRequest}
              embedded={true}
              onCancel={() => setOnDemandRequest(null)}
              onChatOpen={() => setShowChat(true)}
              onRateOpen={(req) => {
                setRatingTarget(req);
                setShowRatingModal(true);
              }}
              onClose={() => setOnDemandRequest(null)}
            />
          </div>
        ) : (
          <SearchAndResultsPanel
            source={source}
            destination={destination}
            onSourceChange={handleSourceChange}
            onDestinationChange={handleDestinationChange}
            onSearch={handleSearch}
            selectedRideType={selectedRideType}
            onRideTypeSelect={handleRideTypeSelect}
            loadingRides={loadingRides}
            rides={rides}
            selectedRide={selectedRide}
            onSelectRide={handleSelectRide}
            onHoverRide={setHoveredRide}
            distance={distance}
            duration={duration}
            mode={searchMode}
            onModeChange={setSearchMode}
            onRequestOnDemand={handleRequestOnDemand}
            requestingOnDemand={requestingOnDemand}
            hasSearched={hasSearched}
            onResetSearch={handleCloseResults}
          />
        )}
      </aside>

      {/* ── Right Column: Interactive Map Panel ──────────── */}
      <section
        className={`
          flex-1 h-full relative overflow-hidden bg-slate-100 dark:bg-[#070C18]
          ${mobileTab === 'search' ? 'hidden md:block' : 'block'}
        `}
      >
        <MapPanel
          source={source}
          destination={destination}
          routePoints={routePoints}
          distance={distance}
          duration={duration}
          hasSearched={hasSearched}
          rides={rides}
          hoveredRide={hoveredRide}
          selectedRide={selectedRide}
          onSelectRide={handleSelectRide}
          showDrawer={showDrawer}
        />
      </section>

      {/* ── Mobile Segmented View Switcher (Only visible on screens < md) ── */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[500] bg-surface/95 backdrop-blur-md border border-border shadow-modal rounded-full p-1 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMobileTab('search')}
          className={`
            flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all
            ${mobileTab === 'search'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <Search size={13} />
          <span>{rides.length > 0 ? `Rides (${rides.length})` : 'Search'}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('map')}
          className={`
            flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all
            ${mobileTab === 'map'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <MapPin size={13} />
          <span>Map</span>
        </button>
      </div>

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
