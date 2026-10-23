import React, { useState } from 'react';
import LocationInput from './LocationInput';
import PricingPanel from './PricingPanel';
import Button from './ui/Button';
import UnifiedSearchBar from './ui/UnifiedSearchBar';
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
    <section className="relative w-full bg-[#EDF5F0] dark:bg-[#111C16] text-text-primary border-b border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors">
      {/* ── Soft Rolling Hills / Topographic Waves Motif ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden dark:opacity-15" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 1440 560" fill="none" preserveAspectRatio="none">
          <path d="M0 220 C320 140 680 320 1440 160 L1440 560 L0 560 Z" fill="#E0EDE4" opacity="0.45" />
          <path d="M0 290 C420 200 860 380 1440 240 L1440 560 L0 560 Z" fill="#E6F2EA" opacity="0.65" />
          <path d="M0 360 C520 270 980 410 1440 310 L1440 560 L0 560 Z" fill="#EEF6F1" opacity="0.85" />
          <path d="M0 430 C600 350 1100 460 1440 380 L1440 560 L0 560 Z" fill="#F7FAF8" opacity="0.95" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto isolate">
        {/* ── 1. Top Centered Headline & Context ─────────── */}
        <div className="text-center space-y-3.5 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary font-heading antialiased">
            Your Journey. Shared.
          </h1>

          <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Connect with verified daily carpools or dispatch instant on-demand rides. Share travel costs, reduce road congestion, and commute with confidence.
          </p>
        </div>

        {/* ── 2. Pine Green Ride-Mode Segmented Control ─── */}
        <div className="flex items-center justify-center mb-7">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#DFECE4] dark:bg-[#1D2D24] border border-[#D2E2D8] dark:border-[#24382D] shadow-inner gap-1">
            <button
              type="button"
              onClick={() => onModeChange('scheduled')}
              className={`
                flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer
                ${mode === 'scheduled'
                  ? 'bg-primary text-white shadow-sm ring-1 ring-primary/50'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/5'
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
                  ? 'bg-primary text-white shadow-sm ring-1 ring-primary/50'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/5'
                }
              `}
            >
              <Zap size={15} />
              <span>Instant On-Demand</span>
            </button>
          </div>
        </div>

        {/* ── 3. Unified BlaBlaCar-Style Search Bar (Scheduled) OR On-Demand Card ── */}
        {mode === 'scheduled' ? (
          <UnifiedSearchBar
            source={source}
            destination={destination}
            onSourceChange={onSourceChange}
            onDestinationChange={onDestinationChange}
            departureDate={departureDate}
            onDepartureDateChange={setDepartureDate}
            passengerCount={passengerCount}
            onPassengerCountChange={setPassengerCount}
            onSwap={handleSwap}
            onGeolocate={handleGeolocate}
            geolocating={geolocating}
            onSubmit={handleSubmit}
            loading={loadingRides}
            buttonText="Search"
            buttonIcon={Search}
          />
        ) : (
          /* Instant On-Demand Mode Form */
          <div className="bg-surface text-text-primary rounded-2xl shadow-card p-5 sm:p-6 border border-border max-w-5xl mx-auto transition-colors">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="text-[11px] text-primary hover:text-primary-hover font-semibold flex items-center gap-1 cursor-pointer"
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
                    className="w-10 h-10 rounded-xl bg-primary-subtle text-primary hover:bg-primary hover:text-white border border-border dark:border-[#24382D] transition-all flex items-center justify-center cursor-pointer shadow-xs"
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
                    iconColor="text-text-secondary"
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
                    className="h-11 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-sm rounded-xl transition-all"
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
            </form>
          </div>
        )}

        {/* ── 4. Popular Destination Quick Chips ─────────── */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mt-5">
          <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <Navigation size={13} className="text-primary" />
            <span>Popular Commutes:</span>
          </span>
          {POPULAR_DESTINATIONS.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.name}
                type="button"
                onClick={() => handlePopularSelect(dest)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-surface hover:bg-primary-subtle text-text-primary border border-border transition-all cursor-pointer shadow-xs"
              >
                <Icon size={12} className="opacity-80 text-primary" />
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
