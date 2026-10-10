import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from './LocationInput';
import PricingPanel from './PricingPanel';
import Button from './ui/Button';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Search,
  Zap,
  ArrowRightLeft,
  ArrowUpDown,
  LocateFixed,
  Plane,
  Train,
  Building2,
  ShoppingBag,
  Car,
  Bike,
  Shield,
  Sparkles,
  Navigation,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getLocalISODate } from '../utils/formatters';

const POPULAR_DESTINATIONS = [
  { name: 'Chandigarh Airport', sub: 'Airport Rd', lat: 30.6735, lng: 76.7885, icon: Plane },
  { name: 'Railway Station', sub: 'City Junction', lat: 30.7046, lng: 76.8285, icon: Train },
  { name: 'IT City / Tech Zone', sub: 'Mohali', lat: 30.6869, lng: 76.7221, icon: Building2 },
  { name: 'Sector 17 Plaza', sub: 'City Centre', lat: 30.7415, lng: 76.7794, icon: ShoppingBag },
];

export const HeroBookingSection = ({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSearch,
  mode = 'scheduled',
  onModeChange,
  selectedRideType = 'sedan',
  onRideTypeSelect,
  loadingRides = false,
  onRequestOnDemand,
  requestingOnDemand = false,
  distance,
  duration,
}) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [geolocating, setGeolocating] = useState(false);

  // Time & date default
  const localToday = getLocalISODate();
  const [departureDate, setDepartureDate] = useState(localToday);
  const [departureTime, setDepartureTime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

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

  const handleSwap = () => {
    if (!source && !destination) return;
    const temp = source;
    onSourceChange(destination);
    onDestinationChange(temp);
  };

  const handlePopularSelect = (dest) => {
    onDestinationChange({
      address: `${dest.name}, ${dest.sub}`,
      lat: dest.lat,
      lng: dest.lng,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source?.address || !destination?.address) {
      toast.error('Please specify both pickup and destination locations.');
      return;
    }
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

  return (
    <section className="relative w-full bg-[#F5B716] dark:bg-[#E0A410] border-b border-[#D89F0A] py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 select-none transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* ── 1. Top Centered Headline & Context ─────────── */}
        <div className="text-center space-y-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/10 text-[#0B1220] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Verified Mobility Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1220] font-heading">
            Your Journey. Shared.
          </h1>

          <p className="text-[#1F2937] text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Find verified scheduled carpools or request instant on-demand rides. Share fuel costs, reduce traffic, and travel comfortably.
          </p>
        </div>

        {/* ── 2. Quick Ride Inspired Category Pills ──────── */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-6">
          <button
            type="button"
            onClick={() => onModeChange('scheduled')}
            className={`
              flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer
              ${mode === 'scheduled'
                ? 'bg-[#0B1220] text-white ring-2 ring-black/20 scale-105 shadow-md'
                : 'bg-black/10 text-[#0B1220] hover:bg-black/20'
              }
            `}
          >
            <Calendar size={16} />
            <span>Scheduled Carpools</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('on_demand')}
            className={`
              flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer
              ${mode === 'on_demand'
                ? 'bg-[#0B1220] text-white ring-2 ring-black/20 scale-105 shadow-md'
                : 'bg-black/10 text-[#0B1220] hover:bg-black/20'
              }
            `}
          >
            <Zap size={16} />
            <span>Instant On-Demand</span>
          </button>
        </div>

        {/* ── 3. Elevated Grounded Booking Card ──────────── */}
        <div className="bg-surface text-text-primary rounded-2xl shadow-2xl p-4 sm:p-6 border border-border max-w-5xl mx-auto transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'scheduled' ? (
              /* Scheduled Carpools Horizontal / Responsive Grid */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Pickup Field */}
                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                      Pickup Point
                    </label>
                    <button
                      type="button"
                      onClick={handleGeolocate}
                      disabled={geolocating}
                      className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      title="Use current GPS location"
                    >
                      <LocateFixed size={12} className={geolocating ? 'animate-spin' : ''} />
                      <span>{geolocating ? 'Locating…' : 'My GPS'}</span>
                    </button>
                  </div>
                  <LocationInput
                    placeholder="Enter pickup city or area"
                    icon={MapPin}
                    iconColor="text-primary"
                    initialValue={source?.address || ''}
                    onPlaceSelected={onSourceChange}
                  />
                </div>

                {/* Location Swap Button */}
                <div className="md:col-span-1 flex items-center justify-center pb-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full border border-border bg-background hover:bg-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 shadow-sm cursor-pointer"
                    title="Swap pickup and destination"
                    aria-label="Swap pickup and destination"
                  >
                    <ArrowRightLeft size={16} className="hidden md:block" />
                    <ArrowUpDown size={16} className="md:hidden" />
                  </button>
                </div>

                {/* Destination Field */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Drop Location
                  </label>
                  <LocationInput
                    placeholder="Enter destination"
                    icon={MapPin}
                    iconColor="text-text-muted"
                    initialValue={destination?.address || ''}
                    onPlaceSelected={onDestinationChange}
                  />
                </div>

                {/* Date & Time Field */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Departure Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={localToday}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Seats Stepper */}
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1 text-center">
                    Seats
                  </label>
                  <div className="flex items-center justify-center border border-border rounded-lg h-11 bg-background px-2">
                    <button
                      type="button"
                      disabled={passengerCount <= 1}
                      onClick={() => setPassengerCount((p) => Math.max(1, p - 1))}
                      className="text-text-secondary hover:text-text-primary disabled:opacity-30 font-bold px-1.5 cursor-pointer text-sm"
                    >
                      −
                    </button>
                    <span className="font-bold text-xs tabular-nums text-text-primary px-2">
                      {passengerCount}
                    </span>
                    <button
                      type="button"
                      disabled={passengerCount >= 4}
                      onClick={() => setPassengerCount((p) => Math.min(4, p + 1))}
                      className="text-text-secondary hover:text-text-primary disabled:opacity-30 font-bold px-1.5 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="md"
                    fullWidth
                    leftIcon={Search}
                    disabled={loadingRides}
                    className="h-11 bg-[#0B1220] hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md rounded-lg"
                  >
                    {loadingRides ? 'Searching…' : 'Find Carpools'}
                  </Button>
                </div>
              </div>
            ) : (
              /* Instant On-Demand Mode Form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                        Pickup Location
                      </label>
                      <button
                        type="button"
                        onClick={handleGeolocate}
                        disabled={geolocating}
                        className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <LocateFixed size={12} className={geolocating ? 'animate-spin' : ''} />
                        <span>{geolocating ? 'Locating…' : 'My GPS'}</span>
                      </button>
                    </div>
                    <LocationInput
                      placeholder="Pickup address"
                      icon={MapPin}
                      iconColor="text-primary"
                      initialValue={source?.address || ''}
                      onPlaceSelected={onSourceChange}
                    />
                  </div>

                  <div className="md:col-span-1 flex items-center justify-center pb-1">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-10 h-10 rounded-full border border-border bg-background hover:bg-border-subtle flex items-center justify-center text-text-secondary transition-all cursor-pointer"
                    >
                      <ArrowRightLeft size={16} className="hidden md:block" />
                      <ArrowUpDown size={16} className="md:hidden" />
                    </button>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Destination Address
                    </label>
                    <LocationInput
                      placeholder="Where do you need to go?"
                      icon={MapPin}
                      iconColor="text-text-muted"
                      initialValue={destination?.address || ''}
                      onPlaceSelected={onDestinationChange}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Button
                      variant="primary"
                      type="submit"
                      size="md"
                      fullWidth
                      leftIcon={Zap}
                      disabled={requestingOnDemand}
                      className="h-11 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-md rounded-lg"
                    >
                      {requestingOnDemand ? 'Requesting…' : 'Request Instant Ride'}
                    </Button>
                  </div>
                </div>

                {/* Embedded Pricing Estimator if locations set */}
                {source && destination && (
                  <div className="pt-2 border-t border-border">
                    <PricingPanel
                      source={source}
                      destination={destination}
                      selectedRideType={selectedRideType}
                      onRideTypeSelect={onRideTypeSelect}
                    />
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* ── 4. Popular Destination Quick Chips ─────────── */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mt-5">
          <span className="text-xs font-bold text-[#0B1220] flex items-center gap-1.5 opacity-80">
            <Navigation size={13} />
            <span>Popular Commutes:</span>
          </span>
          {POPULAR_DESTINATIONS.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.name}
                type="button"
                onClick={() => handlePopularSelect(dest)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/10 hover:bg-black/20 text-[#0B1220] transition-all cursor-pointer shadow-2xs"
              >
                <Icon size={12} className="opacity-70" />
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroBookingSection;
