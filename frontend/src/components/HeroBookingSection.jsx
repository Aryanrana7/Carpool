import React, { useState } from 'react';
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
    <section className="relative w-full bg-gradient-to-b from-[#1C2E25] via-[#22382D] to-[#1C2E25] text-[#FAF9F5] border-b border-[#2D4538] py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors">
      {/* ── Signature Motif: Shared Journey Route Background ─ */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] flex items-center justify-center overflow-hidden" aria-hidden="true">
        <svg width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Commuter 1 route line */}
          <path d="M100 500 C 300 450, 400 350, 600 300" stroke="#087F5B" strokeWidth="3" strokeDasharray="6 6" />
          {/* Commuter 2 route line */}
          <path d="M1100 500 C 900 450, 800 350, 600 300" stroke="#D9EEE4" strokeWidth="3" strokeDasharray="6 6" />
          {/* Combined shared journey highway */}
          <path d="M600 300 C 600 200, 600 150, 600 60" stroke="#087F5B" strokeWidth="4" />
          {/* Shared destination hub */}
          <circle cx="600" cy="300" r="14" fill="#087F5B" />
          <circle cx="600" cy="300" r="6" fill="#F6F4EC" />
          <circle cx="100" cy="500" r="8" fill="#087F5B" />
          <circle cx="1100" cy="500" r="8" fill="#D9EEE4" />
          <circle cx="600" cy="60" r="10" fill="#E8A45B" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── 1. Top Centered Headline & Context ─────────── */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#087F5B]/20 text-[#D9EEE4] border border-[#087F5B]/35 text-xs font-bold uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#087F5B] animate-pulse" />
            <span>Verified Mobility Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-heading">
            Your Journey. Shared.
          </h1>

          <p className="text-[#C2D4CB] text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Connect with verified daily carpools or dispatch instant on-demand rides. Share travel costs, reduce road congestion, and commute with confidence.
          </p>
        </div>

        {/* ── 2. Refined Emerald Ride-Mode Segmented Control ─ */}
        <div className="flex items-center justify-center mb-7">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#14211A] border border-[#2B4034] shadow-inner gap-1">
            <button
              type="button"
              onClick={() => onModeChange('scheduled')}
              className={`
                flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer
                ${mode === 'scheduled'
                  ? 'bg-[#087F5B] text-white shadow-sm ring-1 ring-[#087F5B]/50'
                  : 'text-[#C2D4CB] hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Calendar size={15} />
              <span>Scheduled Carpools</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('on_demand')}
              className={`
                flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer
                ${mode === 'on_demand'
                  ? 'bg-[#087F5B] text-white shadow-sm ring-1 ring-[#087F5B]/50'
                  : 'text-[#C2D4CB] hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Zap size={15} />
              <span>Instant On-Demand</span>
            </button>
          </div>
        </div>

        {/* ── 3. Elevated Grounded Booking Card (White Surface) ── */}
        <div className="bg-white dark:bg-[#15201B] text-[#18241F] dark:text-[#F6F4EC] rounded-2xl shadow-xl p-5 sm:p-6 border border-[#DCE4DE] dark:border-[#2B3D35] max-w-5xl mx-auto transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'scheduled' ? (
              /* Scheduled Carpools Horizontal / Responsive Grid */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Pickup Field */}
                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#66756D] dark:text-[#A3B5AC]">
                      Pickup Point
                    </label>
                    <button
                      type="button"
                      onClick={handleGeolocate}
                      disabled={geolocating}
                      className="text-[11px] text-[#087F5B] hover:text-[#066649] font-semibold flex items-center gap-1 cursor-pointer"
                      title="Use current GPS location"
                    >
                      <LocateFixed size={12} className={geolocating ? 'animate-spin' : ''} />
                      <span>{geolocating ? 'Locating…' : 'My GPS'}</span>
                    </button>
                  </div>
                  <LocationInput
                    placeholder="Enter pickup city or area"
                    icon={MapPin}
                    iconColor="text-[#087F5B]"
                    initialValue={source?.address || ''}
                    onPlaceSelected={onSourceChange}
                  />
                </div>

                {/* Signature Emerald Location-Swap Button */}
                <div className="md:col-span-1 flex items-center justify-center pb-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-xl bg-[#E8F5EF] text-[#087F5B] hover:bg-[#087F5B] hover:text-white border border-[#087F5B]/25 transition-all active:scale-95 shadow-xs flex items-center justify-center cursor-pointer"
                    title="Swap pickup and destination"
                    aria-label="Swap pickup and destination"
                  >
                    <ArrowRightLeft size={16} className="hidden md:block" />
                    <ArrowUpDown size={16} className="md:hidden" />
                  </button>
                </div>

                {/* Destination Field */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66756D] dark:text-[#A3B5AC] mb-1">
                    Drop Location
                  </label>
                  <LocationInput
                    placeholder="Enter destination"
                    icon={MapPin}
                    iconColor="text-[#66756D]"
                    initialValue={destination?.address || ''}
                    onPlaceSelected={onDestinationChange}
                  />
                </div>

                {/* Date & Time Field */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66756D] dark:text-[#A3B5AC] mb-1">
                    Departure Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={localToday}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full h-11 px-3 text-xs font-medium rounded-lg border border-[#DCE4DE] dark:border-[#2B3D35] bg-white dark:bg-[#18241F] text-[#18241F] dark:text-[#F6F4EC] focus:outline-none focus:ring-2 focus:ring-[#087F5B] transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Seats Stepper */}
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66756D] dark:text-[#A3B5AC] mb-1 text-center">
                    Seats
                  </label>
                  <div className="flex items-center justify-center border border-[#DCE4DE] dark:border-[#2B3D35] rounded-lg h-11 bg-white dark:bg-[#18241F] px-2">
                    <button
                      type="button"
                      disabled={passengerCount <= 1}
                      onClick={() => setPassengerCount((p) => Math.max(1, p - 1))}
                      className="text-[#66756D] hover:text-[#087F5B] disabled:opacity-30 font-bold px-1 cursor-pointer text-sm"
                    >
                      −
                    </button>
                    <span className="font-bold text-xs tabular-nums px-2">
                      {passengerCount}
                    </span>
                    <button
                      type="button"
                      disabled={passengerCount >= 4}
                      onClick={() => setPassengerCount((p) => Math.min(4, p + 1))}
                      className="text-[#66756D] hover:text-[#087F5B] disabled:opacity-30 font-bold px-1 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Emerald Search Action */}
                <div className="md:col-span-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="md"
                    fullWidth
                    leftIcon={Search}
                    disabled={loadingRides}
                    className="h-11 bg-[#087F5B] hover:bg-[#066649] text-white font-bold text-xs uppercase tracking-wider shadow-md rounded-lg"
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
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#66756D] dark:text-[#A3B5AC]">
                        Pickup Location
                      </label>
                      <button
                        type="button"
                        onClick={handleGeolocate}
                        disabled={geolocating}
                        className="text-[11px] text-[#087F5B] hover:text-[#066649] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <LocateFixed size={12} className={geolocating ? 'animate-spin' : ''} />
                        <span>{geolocating ? 'Locating…' : 'My GPS'}</span>
                      </button>
                    </div>
                    <LocationInput
                      placeholder="Pickup address"
                      icon={MapPin}
                      iconColor="text-[#087F5B]"
                      initialValue={source?.address || ''}
                      onPlaceSelected={onSourceChange}
                    />
                  </div>

                  <div className="md:col-span-1 flex items-center justify-center pb-1">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-10 h-10 rounded-xl bg-[#D9EEE4] text-[#087F5B] hover:bg-[#087F5B] hover:text-white border border-[#087F5B]/30 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <ArrowRightLeft size={16} className="hidden md:block" />
                      <ArrowUpDown size={16} className="md:hidden" />
                    </button>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66756D] dark:text-[#A3B5AC] mb-1">
                      Destination Address
                    </label>
                    <LocationInput
                      placeholder="Where do you need to go?"
                      icon={MapPin}
                      iconColor="text-[#66756D]"
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
                      className="h-11 bg-[#087F5B] hover:bg-[#066649] text-white font-bold text-xs uppercase tracking-wider shadow-md rounded-lg"
                    >
                      {requestingOnDemand ? 'Requesting…' : 'Request Instant Ride'}
                    </Button>
                  </div>
                </div>

                {/* Embedded Pricing Estimator if locations set */}
                {source && destination && (
                  <div className="pt-2 border-t border-[#DCE4DE] dark:border-[#2B3D35]">
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
          <span className="text-xs font-semibold text-[#C2D4CB] flex items-center gap-1.5">
            <Navigation size={13} className="text-[#087F5B]" />
            <span>Popular Commutes:</span>
          </span>
          {POPULAR_DESTINATIONS.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.name}
                type="button"
                onClick={() => handlePopularSelect(dest)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-[#FAF9F5] border border-white/15 transition-all cursor-pointer shadow-xs"
              >
                <Icon size={12} className="opacity-80 text-[#D9EEE4]" />
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
