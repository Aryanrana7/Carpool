import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from '../LocationInput';
import PricingPanel from '../PricingPanel';
import RouteConnector from '../ui/RouteConnector';
import Button from '../ui/Button';
import {
  LocateFixed,
  Search,
  ArrowUpDown,
  Zap,
  Calendar,
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
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getLocalISODate, formatDate } from '../../utils/formatters';

const POPULAR_DESTINATIONS = [
  { name: 'Chandigarh Airport', sub: 'Airport Rd', lat: 30.6735, lng: 76.7885, icon: Plane },
  { name: 'Railway Station', sub: 'City Junction', lat: 30.7046, lng: 76.8285, icon: Train },
  { name: 'IT City / Tech Zone', sub: 'Mohali', lat: 30.6869, lng: 76.7221, icon: Building2 },
  { name: 'Sector 17 Plaza', sub: 'City Centre', lat: 30.7415, lng: 76.7794, icon: ShoppingBag },
];

export const FloatingSearchCard = ({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSearch,
  selectedRideType,
  onRideTypeSelect,
  loadingRides,
  distance,
  duration,
  mode = 'scheduled',
  onModeChange,
  onRequestOnDemand,
  requestingOnDemand,
  hasSearched = false,
  hasResults = false,
}) => {
  const [pricingOpen, setPricingOpen] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [geolocating, setGeolocating] = useState(false);

  // Local timezone dates (fixes UTC date drift bug)
  const localToday = getLocalISODate();
  const [departureDate, setDepartureDate] = useState(localToday);
  const [departureTime, setDepartureTime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [showScheduleDetails, setShowScheduleDetails] = useState(false);

  // Auto-minimize on mobile when results arrive so map and results are visible
  useEffect(() => {
    if (hasResults && window.innerWidth < 768) {
      setIsMinimized(true);
    }
  }, [hasResults]);

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

  const routeReady = Boolean(source && destination && distance);

  // Missing field explanation helper text
  const getDisabledReason = () => {
    if (!source && !destination) return 'Enter pickup and destination to search';
    if (!source) return 'Enter pickup location';
    if (!destination) return 'Enter destination location';
    return null;
  };
  const disabledReason = getDisabledReason();

  // ── Minimized Summary Pill on Mobile ─────────────────────────
  if (isMinimized && source && destination) {
    return (
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-[500] w-[calc(100vw-24px)] sm:w-[360px]">
        <div
          onClick={() => setIsMinimized(false)}
          className="bg-surface border border-border rounded-lg p-3 flex items-center justify-between shadow-card cursor-pointer hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-md bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              {mode === 'on_demand' ? <Zap size={14} /> : <Calendar size={14} />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">
                {source.address?.split(',')[0]} → {destination.address?.split(',')[0]}
              </p>
              <p className="text-[11px] text-text-muted">
                {mode === 'on_demand' ? 'On-Demand' : formatDate(departureDate)} · {passengerCount} seat{passengerCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-primary px-2.5 py-1 rounded bg-primary-subtle shrink-0"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-[500] w-[calc(100vw-24px)] sm:w-[380px] flex flex-col gap-2.5">
      {/* ── Main Search Panel ─────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl shadow-overlay overflow-hidden">
        <div className="p-4 sm:p-5">
          {/* Header Mode Segmented Switcher & Minimize Button */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex-1 flex rounded-md p-1 bg-border-subtle border border-border">
              <button
                type="button"
                onClick={() => onModeChange && onModeChange('scheduled')}
                className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'scheduled'
                    ? 'bg-surface text-text-primary shadow-subtle'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Calendar size={13} className={mode === 'scheduled' ? 'text-primary' : 'text-text-muted'} />
                <span>Scheduled</span>
              </button>
              <button
                type="button"
                onClick={() => onModeChange && onModeChange('on_demand')}
                className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'on_demand'
                    ? 'bg-surface text-text-primary shadow-subtle'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Zap size={13} className={mode === 'on_demand' ? 'text-primary' : 'text-text-muted'} />
                <span>On-Demand</span>
              </button>
            </div>

            {/* Mobile Minimize Toggle */}
            {source && destination && (
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="md:hidden p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-border-subtle"
                aria-label="Minimize search panel"
              >
                <ChevronUp size={16} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Vertical Route Section: RouteConnector on left, Inputs in middle, Swap on right */}
            <div className="flex items-stretch gap-2">
              {/* Vertical Route Indicator */}
              <RouteConnector className="py-2.5" />

              {/* Stacked Inputs */}
              <div className="flex-1 space-y-2">
                {/* Pickup Field */}
                <div className="relative">
                  <LocationInput
                    id="pickup-input"
                    placeholder="Pickup location"
                    onPlaceSelected={onSourceChange}
                    initialValue={source?.address}
                  />
                  <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={geolocating}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-primary transition-colors rounded hover:bg-border-subtle cursor-pointer"
                    aria-label="Use current location"
                    title="Use current location"
                  >
                    <LocateFixed size={14} className={geolocating ? 'animate-spin text-primary' : ''} />
                  </button>
                </div>

                {/* Destination Field */}
                <LocationInput
                  id="destination-input"
                  placeholder="Where to? (Destination)"
                  onPlaceSelected={onDestinationChange}
                  initialValue={destination?.address}
                />
              </div>

              {/* Swap Button on Right Edge */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  aria-label="Swap pickup and destination"
                  title="Swap pickup and destination"
                  className="w-8 h-8 rounded-md flex items-center justify-center border border-border bg-surface hover:bg-background text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>
            </div>

            {/* Quick Popular Destination Chips (Lucide icons, NO emojis) */}
            {!destination && (
              <div className="pt-1">
                <p className="micro-label mb-2">Quick Destinations</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {POPULAR_DESTINATIONS.map((dest) => {
                    const IconComponent = dest.icon;
                    return (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => handleSelectPopularDest(dest)}
                        className="px-2.5 py-1.5 rounded-md border border-border bg-surface hover:border-primary hover:bg-background text-left transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <IconComponent size={13} className="text-text-muted shrink-0" />
                        <span className="text-xs font-medium text-text-primary truncate">{dest.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seat Count Stepper */}
            <div className="pt-1 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-text-muted" />
                <span className="text-xs font-semibold text-text-primary">Seats Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={passengerCount <= 1}
                  onClick={() => setPassengerCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded border border-border bg-surface hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-text-primary cursor-pointer"
                  aria-label="Decrease seats"
                >
                  <Minus size={13} />
                </button>
                <span className="w-5 text-center text-xs font-bold tabular-nums text-text-primary">
                  {passengerCount}
                </span>
                <button
                  type="button"
                  disabled={passengerCount >= 4}
                  onClick={() => setPassengerCount((c) => Math.min(4, c + 1))}
                  className="w-7 h-7 rounded border border-border bg-surface hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-text-primary cursor-pointer"
                  aria-label="Increase seats"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Scheduled Mode Date Selector with Friendly Chips */}
            {mode === 'scheduled' && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="micro-label">Departure Date</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">
                    {formatDate(departureDate)}
                  </span>
                </div>

                {/* Friendly Date Chips */}
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setDepartureDate(localToday)}
                    className={`py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                      departureDate === localToday
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    Today
                  </button>

                  {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    const tomorrowStr = getLocalISODate(d);
                    return (
                      <button
                        type="button"
                        onClick={() => setDepartureDate(tomorrowStr)}
                        className={`py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                          departureDate === tomorrowStr
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface border-border text-text-secondary hover:bg-background'
                        }`}
                      >
                        Tomorrow
                      </button>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => setShowScheduleDetails((prev) => !prev)}
                    className="py-1.5 text-xs font-semibold rounded border border-border bg-surface text-text-secondary hover:bg-background transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Custom</span>
                    {showScheduleDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {/* Native Picker when custom expanded */}
                <AnimatePresence>
                  {showScheduleDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2 pt-1"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="dep-date" className="micro-label block mb-1">Pick Date</label>
                          <input
                            id="dep-date"
                            type="date"
                            value={departureDate}
                            min={localToday}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="input-base py-1.5 px-2 text-xs"
                          />
                        </div>
                        <div>
                          <label htmlFor="dep-time" className="micro-label block mb-1">Departure Time</label>
                          <input
                            id="dep-time"
                            type="time"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            className="input-base py-1.5 px-2 text-xs"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Primary Action CTA Button & Accessible Disabled Helper */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loadingRides || requestingOnDemand || !source || !destination}
                loading={loadingRides || requestingOnDemand}
                leftIcon={mode === 'on_demand' ? Zap : Search}
              >
                {mode === 'on_demand' ? 'Request Nearby Ride' : 'Search Scheduled Rides'}
              </Button>

              {disabledReason && (
                <p className="text-[11px] text-text-muted text-center mt-1.5 font-medium">
                  {disabledReason}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* ── Route Info Strip (Distance, Duration & Vehicle Fares) ── */}
        <AnimatePresence>
          {routeReady && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border bg-background/50 px-4 py-2.5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div>
                  <span className="micro-label block">Distance</span>
                  <span className="font-semibold text-text-primary tabular-nums">{distance}</span>
                </div>
                <div className="w-px h-5 bg-border" />
                <div>
                  <span className="micro-label block">Est. Time</span>
                  <span className="font-semibold text-text-primary tabular-nums">{duration}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPricingOpen((p) => !p)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Fare Estimates</span>
                {pricingOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Collapsible Smart Pricing Panel ──────────────── */}
      <AnimatePresence>
        {pricingOpen && source && destination && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-surface border border-border rounded-xl p-4 max-h-[45vh] overflow-y-auto shadow-overlay"
          >
            <PricingPanel
              source={source}
              destination={destination}
              selectedRideType={selectedRideType}
              onRideTypeSelect={onRideTypeSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingSearchCard;
