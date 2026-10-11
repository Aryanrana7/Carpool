import React, { useState, useMemo } from 'react';
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
  Navigation,
  Car,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import VerticalRideCard, { SkeletonRideCard } from './ui/VerticalRideCard';
import MapPanel from './MapPanel';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { formatDate } from '../utils/formatters';

const CORRIDOR_PREVIEWS = [
  { id: 'all', name: 'All Corridors', desc: 'All regional commuting routes' },
  { id: 'it', name: 'Mohali IT City', filter: 'Mohali', desc: 'Tech zone daily offices' },
  { id: 'airport', name: 'Airport Express', filter: 'Airport', desc: 'Airport corridor connections' },
  { id: 'intercity', name: 'Intercity Delhi', filter: 'Delhi', desc: 'Interstate express highways' },
];

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
  const [selectedCorridorFilter, setSelectedCorridorFilter] = useState('all');

  // Sorted search results
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

  // Filtered featured rides in pre-search mode
  const filteredFeaturedRides = useMemo(() => {
    if (!featuredRides || featuredRides.length === 0) return [];
    if (selectedCorridorFilter === 'all') return featuredRides;
    const target = CORRIDOR_PREVIEWS.find((c) => c.id === selectedCorridorFilter);
    if (!target?.filter) return featuredRides;
    const kw = target.filter.toLowerCase();
    const matching = featuredRides.filter((r) =>
      (r.source && r.source.toLowerCase().includes(kw)) ||
      (r.destination && r.destination.toLowerCase().includes(kw))
    );
    return matching.length > 0 ? matching : featuredRides;
  }, [featuredRides, selectedCorridorFilter]);

  return (
    <section id="results-section" className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5] dark:bg-[#0F1714] border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {hasSearched ? (
          /* ── Case A: Active Search Results View ──────────────── */
          <div className="space-y-6">
            {/* Header: Route Summary & Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full">
                    Route Results
                  </span>
                  <span className="text-xs font-semibold text-text-secondary">
                    {rides.length} matching carpool{rides.length === 1 ? '' : 's'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-text-primary font-heading">
                  {source?.address?.split(',')[0]} → {destination?.address?.split(',')[0]}
                </h2>
                {distance && (
                  <p className="text-xs text-text-secondary mt-1">
                    Commute estimate: <strong className="text-text-primary">{distance}</strong> · <strong className="text-text-primary">{duration}</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Sort controls */}
                <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 text-xs shadow-xs">
                  <span className="text-[11px] font-semibold text-text-muted px-2 flex items-center gap-1 select-none">
                    <SlidersHorizontal size={12} /> Sort:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSortBy('time')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      sortBy === 'time'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
                    }`}
                  >
                    Earliest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('price')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      sortBy === 'price'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
                    }`}
                  >
                    Lowest Fare
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('seats')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      sortBy === 'seats'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
                    }`}
                  >
                    Most Seats
                  </button>
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={onResetSearch}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-surface hover:bg-border-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer shadow-xs"
                >
                  Clear Search
                </button>
              </div>
            </div>

            {/* 2-Column Responsive Layout: Left Cards (7 cols), Right Map (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Ride Cards or Empty State */}
              <div className="lg:col-span-7 space-y-4">
                {loadingRides ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonRideCard key={i} />)
                ) : sortedRides.length === 0 ? (
                  <div className="py-14 px-6 text-center bg-surface border border-border rounded-2xl space-y-4 shadow-subtle">
                    <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-xs">
                      <MapPinOff size={28} />
                    </div>
                    <div className="max-w-md mx-auto space-y-1.5">
                      <h3 className="text-lg font-extrabold text-text-primary font-heading">
                        No Scheduled Carpools Found
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        No verified drivers have currently scheduled rides along this exact origin and destination. You can adjust your route or request an instant on-demand pickup.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center max-w-sm mx-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetSearch}
                      >
                        Search Different Route
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
              <div className="lg:col-span-5 h-[420px] lg:h-[580px] sticky top-24 rounded-2xl overflow-hidden border border-border shadow-card bg-surface isolate">
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
          /* ── Case B: Pre-Search Featured Rides & Coverage ──────── */
          <div className="space-y-14">
            {/* ── Block 1: Available Scheduled Carpools ───────── */}
            <div className="space-y-6">
              {/* Refined Section Header with Clear Hierarchy */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>Verified Daily Commutes</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary font-heading">
                    Available Scheduled Carpools
                  </h2>

                  <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
                    Browse verified driver commutes ready for booking along high-frequency regional corridors. Reserve a seat in advance to travel comfortably and split fuel expenses.
                  </p>
                </div>

                {/* Corridor Filter Chips & Live Ride Count */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
                  {featuredRides.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary tabular-nums shadow-xs">
                      <Car size={13} className="text-primary" />
                      <span><strong>{featuredRides.length}</strong> active carpool{featuredRides.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  <div className="inline-flex items-center p-1 rounded-xl bg-surface border border-border shadow-xs gap-1 flex-wrap">
                    {CORRIDOR_PREVIEWS.map((corr) => (
                      <button
                        key={corr.id}
                        type="button"
                        onClick={() => setSelectedCorridorFilter(corr.id)}
                        className={`
                          px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer
                          ${selectedCorridorFilter === corr.id
                            ? 'bg-primary text-white shadow-xs'
                            : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
                          }
                        `}
                      >
                        {corr.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid of Real Available Scheduled Ride Cards */}
              {loadingFeatured ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRideCard key={i} />
                  ))}
                </div>
              ) : filteredFeaturedRides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {filteredFeaturedRides.map((ride) => (
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
                /* High-Polish Clean Empty State When No Active Rides Exist */
                <div className="py-16 px-6 text-center bg-surface border border-border rounded-2xl max-w-2xl mx-auto space-y-4 shadow-subtle">
                  <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-xs">
                    <Compass size={28} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-text-primary font-heading">
                      No Scheduled Rides Available Today
                    </h3>
                    <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                      All current departures for this corridor have completed or filled up. Use the search form above to find upcoming dates or publish your own ride as a driver.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Search Custom Route</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ── Block 2: Intentional Commute Corridors & Map Section ─ */}
            <div className="pt-10 border-t border-border space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                    <Navigation size={13} className="text-primary" />
                    <span>Regional Transit Network</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-text-primary font-heading">
                    Commute Corridors & Coverage Area
                  </h3>
                  <p className="text-xs text-text-secondary max-w-2xl">
                    Live OpenStreetMap GPS coverage spanning the Tricity urban network (Chandigarh, Mohali, Panchkula) and connecting intercity highways to New Delhi.
                  </p>
                </div>
              </div>

              {/* Generous Responsive Map Container */}
              <div className="w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-border shadow-card bg-surface isolate">
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
