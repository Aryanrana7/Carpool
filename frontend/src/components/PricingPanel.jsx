import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Car, TrendingUp, Clock, MapPin, ChevronRight, AlertTriangle } from 'lucide-react';
import Loader from './Loader';

const RIDE_TYPE_META = {
  mini: { icon: '🛵', color: 'from-sky-400 to-blue-600', label: 'Mini', desc: 'Affordable rides' },
  sedan: { icon: '🚗', color: 'from-emerald-400 to-teal-600', label: 'Sedan', desc: 'Comfortable daily' },
  suv: { icon: '🚙', color: 'from-violet-400 to-purple-600', label: 'SUV', desc: 'Spacious premium' },
};

const PricingPanel = ({ source, destination, selectedRideType, onRideTypeSelect }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!source || !destination) return;

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
        // Auto-select sedan if no type selected
        if (!selectedRideType && onRideTypeSelect) {
          onRideTypeSelect('sedan', data.fares.find(f => f.rideType === 'sedan'));
        }
      } catch (err) {
        setError('Could not calculate fare. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [source?.lat, source?.lng, destination?.lat, destination?.lng]);

  if (!source || !destination) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Zap size={16} className="text-[#10b981]" />
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Smart Pricing</h3>
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader />
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl text-xs">
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}

      {pricing && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* Route Stats */}
          <div className="flex space-x-3 bg-gray-50 dark:bg-[#111] rounded-2xl p-3">
            <div className="flex-1 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Distance</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{pricing.distanceKm} km</p>
            </div>
            <div className="w-px bg-gray-200 dark:bg-[#2a2a2a]" />
            <div className="flex-1 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Est. Time</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{pricing.durationMin} min</p>
            </div>
          </div>

          {/* Ride Type Cards */}
          <div className="space-y-2">
            {pricing.fares.map((fare) => {
              const meta = RIDE_TYPE_META[fare.rideType];
              const isSelected = selectedRideType === fare.rideType;
              return (
                <motion.button
                  key={fare.rideType}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onRideTypeSelect?.(fare.rideType, fare)}
                  className={`w-full flex items-center p-3 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[#10b981] bg-[#10b981]/5 dark:bg-[#10b981]/10'
                      : 'border-gray-100 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] hover:border-gray-200 dark:hover:border-[#333]'
                  }`}
                >
                  <div className="text-2xl mr-3">{meta.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-gray-900 dark:text-white text-sm">{meta.label}</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white">${fare.finalPrice}</p>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[10px] text-gray-400">{meta.desc}</p>
                      {fare.isPeakHour && (
                        <span className="text-[9px] bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                          {fare.surgeMultiplier}× surge
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <ChevronRight size={16} className="text-[#10b981] ml-2 flex-shrink-0" />}
                </motion.button>
              );
            })}
          </div>

          {/* Fare Breakdown for selected ride type */}
          <AnimatePresence>
            {selectedRideType && pricing.fares.find(f => f.rideType === selectedRideType) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-[#111] rounded-2xl p-4 space-y-2 border border-gray-100 dark:border-[#2a2a2a]">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Fare Breakdown</p>
                  {(() => {
                    const f = pricing.fares.find(fare => fare.rideType === selectedRideType);
                    return (
                      <>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Base fare</span><span className="font-bold">${f.baseFare}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Distance ({f.distanceKm} km)</span><span className="font-bold">${f.distanceFare}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Time ({f.durationMin} min)</span><span className="font-bold">${f.timeFare}</span>
                        </div>
                        {f.surgeMultiplier > 1.0 && (
                          <div className="flex justify-between text-xs text-orange-500">
                            <span className="flex items-center"><TrendingUp size={10} className="mr-1"/>Surge × {f.surgeMultiplier}</span>
                            <span className="font-bold">+${(f.subtotal * (f.surgeMultiplier - 1)).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 dark:border-[#2a2a2a] pt-2 flex justify-between">
                          <span className="font-black text-gray-900 dark:text-white text-sm">Total</span>
                          <span className="font-black text-[#10b981] text-sm">${f.finalPrice}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default PricingPanel;
