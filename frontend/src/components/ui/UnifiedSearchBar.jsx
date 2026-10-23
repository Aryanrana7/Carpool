import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  ArrowUpDown,
  LocateFixed,
  ChevronDown,
  Plus,
  Minus,
} from 'lucide-react';
import LocationInput from '../LocationInput';
import { getLocalISODate } from '../../utils/formatters';

/**
 * UnifiedSearchBar
 *
 * Implements the iconic BlaBlaCar-style horizontal segmented search widget:
 * - Single continuous floating capsule bar (rounded-2xl lg:rounded-full)
 * - Internal vertical dividers separating segments (From | To | Departure | Passengers | Search)
 * - Micro-labels ("From", "To", "Departure", "Passengers") with prominent values below
 * - Deep Pine Green (#315B45) full-height right-docked Search CTA
 * - 100% accessible, responsive layout (horizontal on tablet/desktop, stacked card on mobile)
 */
export const UnifiedSearchBar = ({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  departureDate,
  onDepartureDateChange,
  passengerCount = 1,
  onPassengerCountChange,
  onSwap,
  onGeolocate,
  geolocating = false,
  onSubmit,
  loading = false,
  buttonText = 'Search',
  buttonIcon: ButtonIcon = Search,
  className = '',
}) => {
  const localToday = getLocalISODate();
  const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);
  const passengerRef = useRef(null);
  const dateInputRef = useRef(null);

  // Close passenger popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (passengerRef.current && !passengerRef.current.contains(event.target)) {
        setPassengerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format friendly departure date label (e.g. "Today", "Tomorrow", "Wed, 14 Oct")
  const getFriendlyDateLabel = (dateStr) => {
    if (!dateStr || dateStr === localToday) return 'Today';

    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    return target.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full max-w-5xl mx-auto ${className}`}
      data-testid="unified-search-bar"
    >
      <div className="bg-surface text-text-primary rounded-2xl lg:rounded-full border border-border shadow-card hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary/60 transition-all duration-200 flex flex-col md:flex-row md:items-stretch overflow-hidden relative">
        {/* ── Segment 1: FROM (Pickup) ────────────────────── */}
        <div className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col justify-center relative group hover:bg-background/60 transition-colors">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider select-none">
              From
            </span>
            {onGeolocate && (
              <button
                type="button"
                onClick={onGeolocate}
                disabled={geolocating}
                className="text-[10px] text-primary hover:text-primary-hover font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Use current GPS location"
              >
                <LocateFixed size={11} className={geolocating ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{geolocating ? 'Locating…' : 'GPS'}</span>
              </button>
            )}
          </div>
          <LocationInput
            id="search-from"
            placeholder="City or place"
            icon={MapPin}
            iconColor="text-primary"
            variant="unified"
            initialValue={source?.address || ''}
            onPlaceSelected={onSourceChange}
          />
        </div>

        {/* ── Location Swap Button (Between From & To) ────── */}
        <div className="relative md:self-center shrink-0 flex items-center justify-center -my-2 md:my-0 md:-mx-3 z-10">
          <button
            type="button"
            onClick={onSwap}
            className="w-8 h-8 rounded-full bg-surface hover:bg-primary-subtle text-primary border border-border hover:border-primary/40 shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Swap pickup and dropoff"
            aria-label="Swap pickup and dropoff"
          >
            <ArrowRightLeft size={13} className="hidden md:block" />
            <ArrowUpDown size={13} className="md:hidden" />
          </button>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px h-9 bg-border/80 self-center shrink-0" aria-hidden="true" />
        <div className="block md:hidden h-px w-full bg-border/60" aria-hidden="true" />

        {/* ── Segment 2: TO (Dropoff) ─────────────────────── */}
        <div className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col justify-center hover:bg-background/60 transition-colors">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5 select-none">
            To
          </span>
          <LocationInput
            id="search-to"
            placeholder="City or place"
            icon={MapPin}
            iconColor="text-text-muted"
            variant="unified"
            initialValue={destination?.address || ''}
            onPlaceSelected={onDestinationChange}
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-9 bg-border/80 self-center shrink-0" aria-hidden="true" />
        <div className="block md:hidden h-px w-full bg-border/60" aria-hidden="true" />

        {/* ── Segment 3: DEPARTURE (Date) ─────────────────── */}
        <div
          className="md:w-44 px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col justify-center cursor-pointer hover:bg-background/60 transition-colors relative group select-none"
        >
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">
            Departure
          </span>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary shrink-0 opacity-80" />
            <span className="text-xs sm:text-sm font-bold text-text-primary truncate">
              {getFriendlyDateLabel(departureDate)}
            </span>
          </div>

          {/* Native HTML5 date picker overlay */}
          <input
            ref={dateInputRef}
            type="date"
            min={localToday}
            value={departureDate}
            onChange={(e) => onDepartureDateChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Select departure date"
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-9 bg-border/80 self-center shrink-0" aria-hidden="true" />
        <div className="block md:hidden h-px w-full bg-border/60" aria-hidden="true" />

        {/* ── Segment 4: PASSENGERS (Seats) ───────────────── */}
        <div
          ref={passengerRef}
          className="md:w-44 px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col justify-center cursor-pointer hover:bg-background/60 transition-colors relative select-none"
          onClick={() => setPassengerDropdownOpen((prev) => !prev)}
        >
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">
            Passengers
          </span>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <Users size={14} className="text-primary shrink-0 opacity-80" />
              <span className="text-xs sm:text-sm font-semibold text-text-primary truncate tabular-nums">
                {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'}
              </span>
            </div>
            <ChevronDown
              size={13}
              className={`text-text-muted transition-transform duration-150 ${passengerDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Passenger Stepper Popover */}
          <AnimatePresence>
            {passengerDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-2 right-0 sm:left-0 z-[700] w-60 p-4 bg-surface rounded-2xl border border-border shadow-overlay"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-text-primary">Seats Needed</p>
                    <p className="text-[11px] text-text-muted">Seats to reserve</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={passengerCount <= 1}
                      onClick={() => onPassengerCountChange(Math.max(1, passengerCount - 1))}
                      className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-primary-subtle text-text-primary hover:text-primary disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Decrease passenger count"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center font-bold text-sm tabular-nums text-text-primary">
                      {passengerCount}
                    </span>
                    <button
                      type="button"
                      disabled={passengerCount >= 4}
                      onClick={() => onPassengerCountChange(Math.min(4, passengerCount + 1))}
                      className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-primary-subtle text-text-primary hover:text-primary disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Increase passenger count"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPassengerDropdownOpen(false)}
                  className="w-full py-1.5 rounded-lg bg-primary-subtle hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Segment 5: DOCKED SEARCH CTA BUTTON ─────────── */}
        <div className="md:w-auto shrink-0 flex items-stretch p-1.5 md:p-0">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto h-12 md:h-full min-h-[52px] md:min-h-[60px] px-7 sm:px-9 rounded-xl md:rounded-none md:rounded-r-2xl lg:md:rounded-r-full bg-primary hover:bg-primary-hover active:bg-[#203f2e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.99] select-none"
          >
            <ButtonIcon size={17} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Searching…' : buttonText}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default UnifiedSearchBar;
