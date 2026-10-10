import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Car, Bike, Shield, ChevronRight, AlertTriangle } from 'lucide-react';
import Loader from './Loader';
import { formatCurrency, formatDistance, formatDuration } from '../utils/formatters';

const RIDE_TYPE_ICONS = {
  mini: Bike,
  sedan: Car,
  suv: Shield,
};

const RIDE_TYPE_LABELS = {
  mini: { label: 'Mini', desc: 'Compact & economical' },
  sedan: { label: 'Sedan', desc: 'Comfortable daily ride' },
  suv: { label: 'SUV', desc: 'Spacious for groups' },
};

export const PricingPanel = ({ source, destination, selectedRideType, onRideTypeSelect }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!source?.lat || !destination?.lat) return;

    const fetchPricing = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/pricing/calculate', {
          params: {
            srcLat: source.lat,
            srcLng: source.lng,
            dstLat: destination.lat,
            dstLng: destination.lng,
          },
        });
        setPricing(data);
        if (!selectedRideType && onRideTypeSelect && data.fares?.length) {
          const defaultFare = data.fares.find((f) => f.rideType === 'sedan') || data.fares[0];
          onRideTypeSelect(defaultFare.rideType, defaultFare);
        }
      } catch {
        setError('Could not calculate fare estimate for these points.');
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [source?.lat, source?.lng, destination?.lat, destination?.lng]);

  if (!source || !destination) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-primary" />
          <h3 className="micro-label">Fare Estimates</h3>
        </div>
        {pricing && (
          <span className="text-[11px] font-medium text-text-muted tabular-nums">
            {formatDistance(pricing.distanceKm)} · {formatDuration(pricing.durationMin)}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-5">
          <Loader />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-danger bg-danger-subtle p-2.5 rounded-md text-xs border border-red-200 dark:border-red-900/40">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {pricing && !loading && (
        <div className="space-y-2">
          {pricing.fares.map((fare) => {
            const IconComponent = RIDE_TYPE_ICONS[fare.rideType] || Car;
            const meta = RIDE_TYPE_LABELS[fare.rideType] || { label: fare.rideType, desc: 'Ride' };
            const isSelected = selectedRideType === fare.rideType;

            return (
              <button
                key={fare.rideType}
                type="button"
                onClick={() => onRideTypeSelect?.(fare.rideType, fare)}
                className={`w-full flex items-center p-3 rounded-lg border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-subtle text-text-primary'
                    : 'border-border bg-surface hover:border-border-subtle'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 shrink-0 ${
                  isSelected ? 'bg-primary text-white' : 'bg-border-subtle text-text-secondary'
                }`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-text-primary text-xs">{meta.label}</p>
                    <p className="text-sm font-bold text-text-primary tabular-nums">
                      {formatCurrency(fare.finalPrice)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[11px] text-text-muted">{meta.desc}</p>
                    {fare.isPeakHour && (
                      <span className="text-[10px] font-semibold text-warning bg-warning-subtle px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                        {fare.surgeMultiplier}× surge
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && <ChevronRight size={15} className="text-primary ml-1 shrink-0" />}
              </button>
            );
          })}

          {/* Breakdown for Selected Ride Type */}
          <AnimatePresence>
            {selectedRideType && pricing.fares.find((f) => f.rideType === selectedRideType) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-md bg-background border border-border space-y-1.5 text-xs">
                  <p className="micro-label">Fare Breakdown</p>
                  {(() => {
                    const f = pricing.fares.find((fare) => fare.rideType === selectedRideType);
                    return (
                      <>
                        <div className="flex justify-between text-text-secondary">
                          <span>Base Fare</span>
                          <span className="font-medium text-text-primary tabular-nums">{formatCurrency(f.baseFare)}</span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                          <span>Distance ({formatDistance(f.distanceKm)})</span>
                          <span className="font-medium text-text-primary tabular-nums">{formatCurrency(f.distanceFare)}</span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                          <span>Time ({formatDuration(f.durationMin)})</span>
                          <span className="font-medium text-text-primary tabular-nums">{formatCurrency(f.timeFare)}</span>
                        </div>
                        {f.isPeakHour && (
                          <div className="flex justify-between text-warning font-medium">
                            <span>Surge Multiplier</span>
                            <span>{f.surgeMultiplier}×</span>
                          </div>
                        )}
                        <div className="border-t border-border pt-1 flex justify-between font-bold text-text-primary">
                          <span>Estimated Total</span>
                          <span className="text-primary tabular-nums">{formatCurrency(f.finalPrice)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PricingPanel;
