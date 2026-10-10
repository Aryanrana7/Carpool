import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Zap,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  MapPinOff,
  Sparkles,
  Calendar,
  Compass,
  ChevronRight,
  Car,
} from 'lucide-react';
import VerticalRideCard, { SkeletonRideCard } from './ui/VerticalRideCard';
import MapPanel from './MapPanel';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { formatDate } from '../utils/formatters';

export const RideResultsSection = ({
  hasSearched,
  rides = [],
  loadingRides = false,
  source,
  destination,
  selectedRide,
  onSelectRide,
  hoveredRide,
  onHoverRide,
  routePoints = [],
  distance,
  duration,
  showDrawer,
  onResetSearch,
  onSwitchToOnDemand,
  featuredRides = [],
  loadingFeatured = false,
}) => {
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'price' | 'seats'

  const sortedRides = useMemo(() => {
    if (!rides || rides.length === 0) return [];
    const copy = [...rides];
    if (sortBy === 'price') {
      return copy.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === 'seats') {
      return copy.sort((a, b) => (b.seats || 0) - (a.seats || 0));
    }
    return copy.sort((a, b) => new Date(a.time || a.date) - new Date(b.time || b.date));
  }, [rides, sortBy]);

  return (
    <section id="results-section" className="w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-background border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {hasSearched ? (
          /* ── Case A: Active Search Results View ──────────────── */
          <div className="space-y-6">
            {/* Header: Route Summary & Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full">
                    Route Results
                  </span>
                  <span className="text-xs text-text-muted">
                    {rides.length} matching ride{rides.length === 1 ? '' : 's'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {source?.address?.split(',')[0]} → {destination?.address?.split(',')[0]}
                </h2>
                {distance && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    Estimated commute: {distance} · {duration}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort controls */}
                <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 text-xs">
                  <span className="text-[11px] font-semibold text-text-muted px-2 flex items-center gap-1">
                    <SlidersHorizontal size={12} /> Sort:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSortBy('time')}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      sortBy === 'time'
                        ? 'bg-primary-subtle text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Earliest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price')}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      sortBy === 'price'
                        ? 'bg-primary-subtle text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('seats')}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      sortBy === 'seats'
                        ? 'bg-primary-subtle text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Most Seats
                  </button>
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={onResetSearch}
                  className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-surface hover:bg-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* 2-Column Responsive Layout: Left Cards (7 cols), Right Map (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Ride Cards or Empty State */}
              <div className="lg:col-span-7 space-y-3">
                {loadingRides ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonRideCard key={i} />)
                ) : sortedRides.length === 0 ? (
                  <div className="py-12 px-6 text-center bg-surface border border-border rounded-2xl space-y-4 shadow-subtle">
                    <div className="w-14 h-14 rounded-full bg-border-subtle flex items-center justify-center text-text-muted mx-auto">
                      <MapPinOff size={26} />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-base font-bold text-text-primary">
                        No Scheduled Carpools Found
                      </h3>
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        No drivers currently have scheduled rides for this exact route and date. You can modify your schedule or dispatch an instant on-demand request.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center max-w-sm mx-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetSearch}
                      >
                        Modify Date or Route
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={Zap}
                        onClick={onSwitchToOnDemand}
                      >
                        Request On-Demand Ride
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

              {/* Right Column: Sticky Supporting Route Map */}
              <div className="lg:col-span-5 h-[420px] lg:h-[580px] sticky top-24 rounded-2xl overflow-hidden border border-border shadow-card bg-surface">
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
                  onSelectRide={onSelectRide}
                  showDrawer={showDrawer}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ── Case B: Pre-Search Featured Rides & Corridors ─────── */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                  Active Commutes
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  Available Scheduled Carpools
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Verified daily rides currently available for booking across city corridors.
                </p>
              </div>
            </div>

            {/* Grid of Real Available Rides */}
            {loadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRideCard key={i} />
                ))}
              </div>
            ) : featuredRides && featuredRides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredRides.slice(0, 6).map((ride) => (
                  <VerticalRideCard
                    key={ride._id}
                    ride={ride}
                    selected={selectedRide?._id === ride._id}
                    onSelect={onSelectRide}
                    onHoverIn={onHoverRide}
                    onHoverOut={onHoverRide}
                  />
                ))}
              </div>
            ) : (
              /* Fallback corridor preview when DB has no future rides */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { from: 'Chandigarh Sec 17', to: 'Mohali IT City', time: 'Daily 09:00 AM', price: 90, desc: 'Tech corridor daily commute' },
                  { from: 'Panchkula Sec 5', to: 'Chandigarh Airport', time: 'Daily 07:30 AM', price: 150, desc: 'Airport express carpool' },
                  { from: 'Chandigarh Junction', to: 'New Delhi Connaught Pl', time: 'Tomorrow 06:00 AM', price: 450, desc: 'Intercity shared journey' },
                  { from: 'Zirakpur Flyover', to: 'Sector 34 Tech Park', time: 'Daily 08:45 AM', price: 80, desc: 'Urban office route' },
                ].map((corr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-surface hover:border-primary/40 transition-all shadow-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-primary tabular-nums">₹{corr.price}</span>
                        <span className="text-text-muted text-[11px]">{corr.time}</span>
                      </div>
                      <p className="text-xs font-bold text-text-primary">{corr.from}</p>
                      <div className="w-0.5 h-3 bg-border my-1 ml-1" />
                      <p className="text-xs font-bold text-text-primary">{corr.to}</p>
                    </div>
                    <p className="text-[11px] text-text-muted mt-3 pt-2 border-t border-border">
                      {corr.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Corridor Exploration Map */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Commute Corridors & Service Areas
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Live GPS service area for scheduled passenger carpools and on-demand matching.
                  </p>
                </div>
              </div>
              <div className="w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-border shadow-card bg-surface">
                <MapPanel
                  source={source}
                  destination={destination}
                  routePoints={routePoints}
                  distance={distance}
                  duration={duration}
                  hasSearched={false}
                  rides={featuredRides}
                  hoveredRide={hoveredRide}
                  selectedRide={selectedRide}
                  onSelectRide={onSelectRide}
                  showDrawer={showDrawer}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RideResultsSection;
