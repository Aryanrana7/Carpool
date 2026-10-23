import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from './LocationInput';
import PricingPanel from './PricingPanel';
import RouteConnector from './ui/RouteConnector';
import TrustStrip from './ui/TrustStrip';
import FareLabel from './ui/FareLabel';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';
import {
  LocateFixed,
  Search,
  ArrowUpDown,
  Zap,
  Calendar,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Plane,
  Train,
  Building2,
  ShoppingBag,
  Plus,
  Minus,
  Edit2,
  MapPinOff,
  SlidersHorizontal,
  Car,
  Bike,
  Shield,
  ArrowRight,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getLocalISODate, formatDate, formatTime } from '../utils/formatters';

const POPULAR_DESTINATIONS = [
  { name: 'Chandigarh Airport', sub: 'Airport Rd', lat: 30.6735, lng: 76.7885, icon: Plane },
  { name: 'Railway Station', sub: 'City Junction', lat: 30.7046, lng: 76.8285, icon: Train },
  { name: 'IT City / Tech Zone', sub: 'Mohali', lat: 30.6869, lng: 76.7221, icon: Building2 },
  { name: 'Sector 17 Plaza', sub: 'City Centre', lat: 30.7415, lng: 76.7794, icon: ShoppingBag },
];

/* ── Skeleton Loading Card ────────────────────────────── */
const SkeletonRideCard = () => (
  <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton width="40%" height="20px" />
      <Skeleton width="30%" height="24px" />
    </div>
    <div className="space-y-2 py-1">
      <Skeleton width="80%" height="16px" />
      <Skeleton width="65%" height="16px" />
    </div>
    <div className="pt-2 border-t border-border flex justify-between items-center">
      <Skeleton width="50%" height="16px" />
      <Skeleton width="25%" height="22px" />
    </div>
  </div>
);

/* ── Rich Vertical Ride Card ─────────────────────────── */
const VerticalRideCard = React.memo(({
  ride,
  selected,
  onSelect,
  onHoverIn,
  onHoverOut,
  onBook,
}) => {
  const isSeatsLow = ride.seats === 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      onClick={() => onSelect(ride)}
      onMouseEnter={() => onHoverIn?.(ride)}
      onMouseLeave={() => onHoverOut?.(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ride);
        }
      }}
      className={`
        w-full rounded-xl p-4 text-left transition-all duration-200 cursor-pointer border
        ${selected
          ? 'border-primary bg-primary-subtle/50 ring-2 ring-primary/20 shadow-card'
          : 'border-border bg-surface hover:border-primary/40 hover:bg-background/50 shadow-subtle'
        }
      `}
    >
      {/* 1. Header Row: Departure Time + Prominent Fare */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-text-primary">
          <Clock size={15} className="text-primary shrink-0" />
          <span className="font-heading text-sm font-bold tabular-nums">
            {formatTime(ride.time || ride.date)}
          </span>
          <span className="text-[11px] text-text-muted">
            ({formatDate(ride.time || ride.date, { relative: true })})
          </span>
        </div>
        <FareLabel amount={ride.price} size="lg" highlight perSeat />
      </div>

      {/* 2. Route Timeline via RouteConnector */}
      <div className="mb-3.5 pl-0.5">
        <RouteConnector
          pickup={ride.pickupLocation?.split(',')[0] || ride.source}
          destination={ride.dropoffLocation?.split(',')[0] || ride.destination}
          className="text-xs"
        />
      </div>

      {/* 3. Driver Credibility via TrustStrip */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <TrustStrip
          driver={ride.driver}
          size="sm"
          showVehicle={true}
          className="min-w-0 flex-1"
        />

        {/* 4. Seats Left Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {ride.seats > 0 ? (
            <span
              className={`
                text-[11px] font-semibold px-2 py-0.5 rounded tabular-nums border
                ${isSeatsLow
                  ? 'bg-warning-subtle text-warning border-amber-200 dark:border-amber-900/40'
                  : 'bg-border-subtle text-text-secondary border-border'
                }
              `}
            >
              {ride.seats} {ride.seats === 1 ? 'seat left' : 'seats left'}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-danger bg-danger-subtle px-2 py-0.5 rounded border border-red-200 dark:border-red-900/40">
              Sold out
            </span>
          )}
        </div>
      </div>

      {/* 5. Select CTA Row */}
      <div className="mt-3 pt-2.5 border-t border-border/70 flex items-center justify-between gap-3 text-xs">
        <span className="text-text-muted font-medium truncate">
          Vehicle: <strong className="text-text-primary">{ride.carType || ride.driver?.carModel || 'Sedan'}</strong>
        </span>
        <button
          type="button"
          onClick={() => onSelect(ride)}
          className={`
            inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer shadow-sm shrink-0
            ${selected
              ? 'bg-primary-hover text-white ring-2 ring-primary ring-offset-1'
              : 'bg-primary hover:bg-primary-hover text-white'
            }
          `}
        >
          <span className="text-white">{selected ? 'Viewing Details' : 'Select Ride'}</span>
          <ArrowRight size={13} className="text-white transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  );
});

VerticalRideCard.displayName = 'VerticalRideCard';

/* ── Main Left-Panel Search & Results Component ───────── */
export const SearchAndResultsPanel = ({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSearch,
  selectedRideType,
  onRideTypeSelect,
  loadingRides = false,
  rides = [],
  selectedRide,
  onSelectRide,
  onHoverRide,
  distance,
  duration,
  mode = 'scheduled',
  onModeChange,
  onRequestOnDemand,
  requestingOnDemand = false,
  hasSearched = false,
  onResetSearch,
}) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [geolocating, setGeolocating] = useState(false);
  const [isEditingSearch, setIsEditingSearch] = useState(false);
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'price' | 'seats'

  // Local timezone dates (fixes UTC date drift bug)
  const localToday = getLocalISODate();
  const [departureDate, setDepartureDate] = useState(localToday);
  const [departureTime, setDepartureTime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Automatically show results view when search succeeds
  useEffect(() => {
    if (hasSearched && rides.length > 0) {
      setIsEditingSearch(false);
    }
  }, [hasSearched, rides.length]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setGeolocating(true);
    toast.loading('Locating pickup point…', { id: 'geo' });

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const { data } = await api.get('/proxy/reverse', { params: { lat: latitude, lon: longitude } });
          onSourceChange({ address: data.display_name, lat: latitude, lng: longitude });
          toast.success('Pickup set to current location', { id: 'geo' });
        } catch {
          toast.error('Failed to resolve address coordinates', { id: 'geo' });
        } finally {
          setGeolocating(false);
        }
      },
      () => {
        toast.error('Location permission denied', { id: 'geo' });
        setGeolocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSwapLocations = () => {
    if (!source && !destination) return;
    const temp = source;
    onSourceChange(destination);
    onDestinationChange(temp);
  };

  const handleSelectPopularDest = (dest) => {
    onDestinationChange({
      address: `${dest.name}, ${dest.sub}`,
      lat: dest.lat,
      lng: dest.lng,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'on_demand') {
      if (onRequestOnDemand) {
        onRequestOnDemand({ passengerCount });
      }
    } else {
      if (onSearch) {
        onSearch({
          date: departureDate,
          time: departureTime,
          passengerCount,
        });
      }
    }
  };

  const sortedRides = useMemo(() => {
    if (!rides || rides.length === 0) return [];
    const copy = [...rides];
    if (sortBy === 'price') {
      return copy.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === 'seats') {
      return copy.sort((a, b) => (b.seats || 0) - (a.seats || 0));
    }
    return copy.sort((a, b) => new Date(a.time || a.date).getTime() - new Date(b.time || b.date).getTime());
  }, [rides, sortBy]);

  const disabledReason = useMemo(() => {
    if (!source && !destination) return 'Enter pickup and destination to search';
    if (!source) return 'Enter pickup location';
    if (!destination) return 'Enter destination location';
    return null;
  }, [source, destination]);

  const showResultsView = hasSearched && !isEditingSearch;

  return (
    <div className="flex flex-col h-full bg-surface text-text-primary">
      {/* ── Top Header Bar ──────────────────────────────────── */}
      <div className="p-4 sm:p-5 border-b border-border shrink-0 bg-surface">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-heading">
              Tricity Mobility Platform
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-heading mt-0.5">
              Find a Shared Ride
            </h1>
          </div>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Daily carpools & on-demand rides across Chandigarh, Mohali, Panchkula & neighboring cities.
        </p>

        {/* Segmented Mode Switcher */}
        <div className="flex rounded-lg p-1 bg-border-subtle border border-border mt-3.5">
          <button
            type="button"
            onClick={() => onModeChange && onModeChange('scheduled')}
            className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'scheduled'
                ? 'bg-surface text-text-primary shadow-subtle border border-border/80'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Calendar size={14} className={mode === 'scheduled' ? 'text-primary' : 'text-text-muted'} />
            <span>Scheduled Carpool</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange && onModeChange('on_demand')}
            className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'on_demand'
                ? 'bg-surface text-text-primary shadow-subtle border border-border/80'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Zap size={14} className={mode === 'on_demand' ? 'text-primary' : 'text-text-muted'} />
            <span>Instant On-Demand</span>
          </button>
        </div>
      </div>

      {/* ── Scrollable Body Area ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* If in Results Mode, show compact route summary + Edit button */}
        {showResultsView ? (
          <div className="space-y-4">
            {/* Active Route Summary Pill */}
            <div className="bg-background border border-border rounded-xl p-3.5 flex items-center justify-between shadow-subtle">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-text-primary truncate">
                  {source?.address?.split(',')[0]} → {destination?.address?.split(',')[0]}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {formatDate(departureDate)} · {passengerCount} seat{passengerCount > 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={Edit2}
                onClick={() => setIsEditingSearch(true)}
              >
                Modify Search
              </Button>
            </div>

            {/* Results Filter Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-border gap-2 flex-wrap">
              <p className="text-xs font-bold text-text-primary font-heading">
                {loadingRides
                  ? 'Searching available carpools…'
                  : `${sortedRides.length} matching ride${sortedRides.length !== 1 ? 's' : ''} found`}
              </p>

              {!loadingRides && sortedRides.length > 1 && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-text-muted mr-1">Sort:</span>
                  <button
                    type="button"
                    onClick={() => setSortBy('time')}
                    className={`px-2 py-0.5 rounded font-semibold border transition-colors cursor-pointer ${
                      sortBy === 'time'
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Earliest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price')}
                    className={`px-2 py-0.5 rounded font-semibold border transition-colors cursor-pointer ${
                      sortBy === 'price'
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('seats')}
                    className={`px-2 py-0.5 rounded font-semibold border transition-colors cursor-pointer ${
                      sortBy === 'seats'
                        ? 'bg-primary-subtle text-primary border-primary'
                        : 'border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Most Seats
                  </button>
                </div>
              )}
            </div>

            {/* Ride Cards List */}
            <div className="space-y-3">
              {loadingRides ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRideCard key={i} />)
              ) : sortedRides.length === 0 ? (
                <div className="py-8 px-4 text-center bg-background border border-border rounded-xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-border-subtle flex items-center justify-center text-text-muted mx-auto">
                    <MapPinOff size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      No Scheduled Rides Found
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                      No drivers are currently scheduled for this exact route and date.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => setIsEditingSearch(true)}
                    >
                      Change Date or Route
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      leftIcon={Zap}
                      onClick={() => {
                        onModeChange && onModeChange('on_demand');
                        setIsEditingSearch(true);
                      }}
                    >
                      Request On-Demand Ride Instead
                    </Button>
                  </div>
                </div>
              ) : (
                sortedRides.map((ride) => (
                  <VerticalRideCard
                    key={ride._id}
                    ride={ride}
                    selected={selectedRide?._id === ride._id}
                    onSelect={onSelectRide}
                    onHoverIn={onHoverRide}
                    onHoverOut={onHoverRide}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          /* ── Search Form View ──────────────────────────────── */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header when modifying an existing search */}
            {hasSearched && (
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold text-text-primary">Modify Search</span>
                <button
                  type="button"
                  onClick={() => setIsEditingSearch(false)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Back to Results ({rides.length})
                </button>
              </div>
            )}

            {/* Route Inputs Container */}
            <div className="bg-background border border-border rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-stretch gap-2.5">
                {/* Vertical Connector motif */}
                <RouteConnector className="py-3" />

                {/* Inputs column */}
                <div className="flex-1 space-y-2">
                  {/* Origin */}
                  <div className="relative">
                    <label htmlFor="pickup-input" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Pickup Origin
                    </label>
                    <LocationInput
                      id="pickup-input"
                      placeholder="Enter pickup point (e.g. Sector 17, Chandigarh)"
                      onPlaceSelected={onSourceChange}
                      initialValue={source?.address}
                    />
                    <button
                      type="button"
                      onClick={handleGeolocate}
                      disabled={geolocating}
                      className="absolute right-2.5 top-[27px] p-1.5 text-text-muted hover:text-primary transition-colors rounded hover:bg-border-subtle cursor-pointer"
                      aria-label="Use current location"
                      title="Use current location"
                    >
                      <LocateFixed size={15} className={geolocating ? 'animate-spin text-primary' : ''} />
                    </button>
                  </div>

                  {/* Destination */}
                  <div>
                    <label htmlFor="destination-input" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Final Destination
                    </label>
                    <LocationInput
                      id="destination-input"
                      placeholder="Where to? (e.g. Cyber City, Gurgaon / Delhi)"
                      onPlaceSelected={onDestinationChange}
                      initialValue={destination?.address}
                    />
                  </div>
                </div>

                {/* Location Swap Button */}
                <div className="flex items-center justify-center pt-5">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    aria-label="Swap pickup and destination"
                    title="Swap pickup and destination"
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-border bg-surface hover:bg-background text-text-secondary hover:text-text-primary transition-colors cursor-pointer shadow-subtle"
                  >
                    <ArrowUpDown size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Tricity Destinations */}
            {!destination && (
              <div className="pt-1">
                <p className="micro-label mb-2">Quick Destinations</p>
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_DESTINATIONS.map((dest) => {
                    const IconComponent = dest.icon;
                    return (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => handleSelectPopularDest(dest)}
                        className="p-2.5 rounded-lg border border-border bg-surface hover:border-primary/50 hover:bg-background text-left transition-colors flex items-center gap-2 cursor-pointer shadow-subtle"
                      >
                        <div className="w-7 h-7 rounded-md bg-border-subtle flex items-center justify-center text-text-secondary shrink-0">
                          <IconComponent size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-primary truncate leading-snug">{dest.name}</p>
                          <p className="text-[10px] text-text-muted truncate">{dest.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scheduled Options */}
            {mode === 'scheduled' && (
              <div className="space-y-3 pt-1">
                {/* Date Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Departure Date
                  </label>
                  <div className="flex items-center gap-1.5 mb-2">
                    <button
                      type="button"
                      onClick={() => setDepartureDate(localToday)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                        departureDate === localToday
                          ? 'bg-primary-subtle text-primary border-primary'
                          : 'border-border bg-surface text-text-secondary hover:bg-background'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setDepartureDate(tomorrow.toISOString().split('T')[0]);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                        departureDate !== localToday &&
                        departureDate ===
                          new Date(Date.now() + 86400000).toISOString().split('T')[0]
                          ? 'bg-primary-subtle text-primary border-primary'
                          : 'border-border bg-surface text-text-secondary hover:bg-background'
                      }`}
                    >
                      Tomorrow
                    </button>
                  </div>
                  <input
                    type="date"
                    min={localToday}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer tabular-nums"
                  />
                </div>

                {/* Time & Seats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Seats Needed
                    </label>
                    <div className="flex items-center justify-between h-10 px-2 rounded-lg border border-border bg-surface">
                      <button
                        type="button"
                        onClick={() => setPassengerCount((p) => Math.max(1, p - 1))}
                        disabled={passengerCount <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded text-text-secondary hover:bg-border-subtle disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold text-text-primary font-heading tabular-nums">
                        {passengerCount} seat{passengerCount > 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPassengerCount((p) => Math.min(4, p + 1))}
                        disabled={passengerCount >= 4}
                        className="w-7 h-7 flex items-center justify-center rounded text-text-secondary hover:bg-border-subtle disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* On-Demand Options */}
            {mode === 'on_demand' && (
              <div className="pt-1">
                <PricingPanel
                  source={source}
                  destination={destination}
                  selectedRideType={selectedRideType}
                  onRideTypeSelect={onRideTypeSelect}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={Boolean(disabledReason) || loadingRides || requestingOnDemand}
                loading={loadingRides || requestingOnDemand}
                rightIcon={ArrowRight}
                className="h-12 text-sm font-bold shadow-subtle"
              >
                {loadingRides
                  ? 'Searching Available Routes…'
                  : requestingOnDemand
                  ? 'Broadcasting Ride Request…'
                  : mode === 'on_demand'
                  ? 'Request Instant On-Demand Ride'
                  : 'Search Scheduled Rides'}
              </Button>

              {/* Informative helper reason if button is disabled */}
              {disabledReason && (
                <p className="text-[11px] text-text-muted text-center mt-2">
                  {disabledReason}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SearchAndResultsPanel;
