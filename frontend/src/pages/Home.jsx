import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MapPanel from '../components/MapPanel';
import FloatingSearchCard from '../components/overlay/FloatingSearchCard';
import FloatingRideResults from '../components/overlay/FloatingRideResults';
const RideDetailDrawer = React.lazy(() => import('../components/overlay/RideDetailDrawer'));
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();

  // Location & route
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // Rides
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [hoveredRide, setHoveredRide] = useState(null);
  const [loadingRides, setLoadingRides] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Overlays
  const [showResults, setShowResults] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Smart pricing
  const [selectedRideType, setSelectedRideType] = useState('sedan');
  const [selectedFare, setSelectedFare] = useState(null);

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
    if (destination) calculateRoute(place, destination);
  };

  const handleDestinationChange = (place) => {
    setDestination(place);
    if (source) calculateRoute(source, place);
  };

  const handleRideTypeSelect = (type, fare) => {
    setSelectedRideType(type);
    setSelectedFare(fare);
  };

  const handleSearch = async () => {
    if (!source || !destination) {
      toast.error('Please select pickup and dropoff locations.');
      return;
    }
    
    if (source.address === destination.address || (source.lat === destination.lat && source.lng === destination.lng)) {
      toast.error('Pickup and dropoff cannot be the same.', { icon: '⚠️' });
      return;
    }

    setLoadingRides(true);
    setRides([]);
    setSelectedRide(null);
    setShowDrawer(false);
    setHasSearched(true);
    setShowResults(true);

    try {
      const { data } = await api.get(
        `/rides/search?source=${encodeURIComponent(source.address)}&destination=${encodeURIComponent(destination.address)}`
      );
      if (data.length === 0) {
        toast('No exact matches — showing available rides.', { icon: 'ℹ️' });
        const fallback = await api.get('/rides');
        setRides(fallback.data || []);
      } else {
        setRides(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error. Please try again.', { icon: '🔌' });
      setRides([]);
    } finally {
      setLoadingRides(false);
    }
  };

  const handleSelectRide = (ride) => {
    setSelectedRide(ride);
    setShowResults(false); // Hide bottom ride results panel
    setDrawerLoading(true);
    setShowDrawer(true);   // Open right details panel
    setTimeout(() => setDrawerLoading(false), 350);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedRide(null);
    setDrawerLoading(false);
    // Show ride results panel again if search is active
    if (hasSearched) {
      setShowResults(true);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setHasSearched(false);
    setSelectedRide(null);
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
    // Full-screen map container
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#0c0c0c]">

      {/* ── Fullscreen map ─────────────────────────── */}
      <MapPanel
        source={source}
        destination={destination}
        routePoints={routePoints}
        distance={distance}
        duration={duration}
        hasSearched={hasSearched}
        hoveredRide={hoveredRide}
        selectedRide={selectedRide}
        showDrawer={showDrawer}
        fullscreen
      />

      {/* ── Floating search card (top-left) ────────── */}
      <FloatingSearchCard
        source={source}
        destination={destination}
        onSourceChange={handleSourceChange}
        onDestinationChange={handleDestinationChange}
        onSearch={handleSearch}
        selectedRideType={selectedRideType}
        onRideTypeSelect={handleRideTypeSelect}
        loadingRides={loadingRides}
        distance={distance}
        duration={duration}
      />

      {/* ── Floating ride results (bottom-center) ──── */}
      <FloatingRideResults
        show={showResults}
        rides={rides}
        loading={loadingRides}
        selectedRide={selectedRide}
        onSelectRide={handleSelectRide}
        onHoverRide={setHoveredRide}
        onClose={handleCloseResults}
      />

      {/* ── Ride detail drawer (right slide-in) ────── */}
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
    </div>
  );
};

export default Home;
