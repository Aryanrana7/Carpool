import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from '../LocationInput';
import PricingPanel from '../PricingPanel';
import { MapPin, Navigation, LocateFixed, Search, Loader2, ChevronDown, ChevronUp, Navigation2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FloatingSearchCard = ({
  source, destination,
  onSourceChange, onDestinationChange,
  onSearch,
  selectedRideType, onRideTypeSelect,
  loadingRides,
  distance, duration,
}) => {
  const [pricingOpen, setPricingOpen] = useState(false);

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast.loading('Detecting location…', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          onSourceChange({ address: data.display_name, lat: latitude, lng: longitude });
          toast.success('Location detected!', { id: 'geo' });
        } catch { toast.error('Failed to get address', { id: 'geo' }); }
      },
      () => toast.error('Location access denied', { id: 'geo' })
    );
  };

  const handleSubmit = (e) => { e.preventDefault(); onSearch(); };

  const routeReady = !!(source && destination && distance);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-5 left-5 z-[500] w-[320px] flex flex-col gap-3"
    >
      {/* ── Main search card ─────────────────────────── */}
      <div
        className="rounded-3xl shadow-2xl shadow-black/40 overflow-hidden"
        style={{ background: 'rgba(14,14,14,0.72)', backdropFilter: 'blur(28px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-5 pt-5 pb-4">
          {/* Logo / title */}
          <div className="flex items-center gap-2 mb-4">
            <Navigation2 size={16} className="text-indigo-400" />
            <span className="text-[13px] font-black text-white/90 tracking-tight">Plan your ride</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Route connector visual */}
            <div className="relative">
              <div className="space-y-2">
                {/* Pickup */}
                <div className="relative">
                  <LocationInput
                    placeholder="Pickup location"
                    onPlaceSelected={onSourceChange}
                    icon={MapPin}
                    iconColor="text-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleGeolocate}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Use my location"
                  >
                    <LocateFixed size={13} />
                  </button>
                </div>

                {/* Connector dot */}
                <div className="flex items-center gap-2 px-3 py-0.5">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-3 bg-white/10 rounded-full" />
                  </div>
                </div>

                {/* Destination */}
                <LocationInput
                  placeholder="Where to?"
                  onPlaceSelected={onDestinationChange}
                  icon={Navigation}
                  iconColor="text-violet-400"
                />
              </div>
            </div>

            {/* Search button */}
            <motion.button
              type="submit"
              disabled={loadingRides || !source || !destination}
              whileHover={{ scale: 1.02, boxShadow: '0 12px 24px -4px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.96, boxShadow: '0 0 25px rgba(99,102,241,0.7)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 mt-1"
            >
              {loadingRides
                ? <><Loader2 size={15} className="animate-spin" /> Searching…</>
                : <><Search size={15} /> Search Rides</>
              }
            </motion.button>
          </form>
        </div>

        {/* ── Route info strip (appears when route is calculated) ── */}
        <AnimatePresence>
          {routeReady && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-white/5">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <p className="text-white/40 font-semibold uppercase tracking-widest" style={{ fontSize: 9 }}>Distance</p>
                    <p className="font-black text-white text-sm">{distance}</p>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div>
                    <p className="text-white/40 font-semibold uppercase tracking-widest" style={{ fontSize: 9 }}>Est. Time</p>
                    <p className="font-black text-white text-sm">{duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPricingOpen(p => !p)}
                  className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  Fares {pricingOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pricing panel (collapsible) ──────────────── */}
      <AnimatePresence>
        {pricingOpen && source && destination && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl shadow-2xl shadow-black/40 p-5 overflow-y-auto max-h-[55vh] scrollbar-none"
            style={{ background: 'rgba(14,14,14,0.72)', backdropFilter: 'blur(28px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <PricingPanel
              source={source}
              destination={destination}
              selectedRideType={selectedRideType}
              onRideTypeSelect={(type, fare) => {
                onRideTypeSelect(type, fare);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingSearchCard;
