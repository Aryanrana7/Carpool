import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Clock, Zap, ShieldCheck, ArrowRight, Star, Car, Bike, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import Button from '../components/ui/Button';
import RouteConnector from '../components/ui/RouteConnector';
import TrustStrip from '../components/ui/TrustStrip';
import FareLabel from '../components/ui/FareLabel';

const RIDE_TYPE_ICONS = {
  mini: Bike,
  sedan: Car,
  suv: Shield,
};

export const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.ride) return <Navigate to="/" replace />;

  const { ride, route, pricing, rideType = 'sedan' } = location.state;
  const baseFare = pricing?.baseFare ?? (ride.price * 0.65);
  const distanceFare = pricing?.distanceFare ?? (ride.price * 0.25);
  const timeFare = pricing?.timeFare ?? (ride.price * 0.10);
  const surge = pricing?.surgeMultiplier ?? 1.0;

  const IconComponent = RIDE_TYPE_ICONS[rideType] || Car;

  const infoItems = [
    { label: 'Route', value: `${route?.distance || '—'} · ${route?.duration || '—'}`, icon: Clock },
    { label: 'Surge', value: surge > 1 ? `${surge}× surge rate` : 'Standard rate', icon: Zap },
    { label: 'Safety', value: 'Verified Driver', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-[calc(100vh-68px)] bg-background flex justify-center items-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-xl space-y-5">
        {/* Step indicator header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-subtle px-2 py-0.5 rounded">
              Step 1 of 2
            </span>
            <span className="text-xs text-text-muted">Review Booking</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Confirm Booking Details
          </h1>
          <p className="text-text-secondary mt-1 text-xs">
            Review your journey route, scheduled departure, and fare breakdown before payment.
          </p>
        </div>

        <div className="space-y-4">
          {/* Route Card */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <p className="micro-label mb-3">Journey Route</p>
            <div className="flex items-stretch gap-3">
              <RouteConnector className="py-1" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-semibold">Pickup</p>
                  <p className="font-semibold text-text-primary text-xs leading-snug">
                    {route?.source?.address || ride.pickupLocation || ride.source}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-semibold">Destination</p>
                  <p className="font-semibold text-text-primary text-xs leading-snug">
                    {route?.destination?.address || ride.dropoffLocation || ride.destination}
                  </p>
                </div>
              </div>

              {route?.distance && (
                <div className="text-right pl-4 border-l border-border shrink-0 self-center">
                  <p className="text-base font-bold text-text-primary tabular-nums">{route.distance}</p>
                  <p className="text-xs text-text-muted mt-0.5 tabular-nums">{route.duration}</p>
                </div>
              )}
            </div>

            {/* Departure details pill if available */}
            {ride.time && (
              <div className="mt-3.5 pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                <span className="font-medium">Scheduled Departure:</span>
                <span className="font-bold text-text-primary tabular-nums">
                  {formatDate(ride.time)} at {formatTime(ride.time)}
                </span>
              </div>
            )}

            {/* Micro badges */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border flex-wrap">
              {infoItems.map(({ label, value, icon: ItemIcon }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-text-secondary bg-border-subtle px-2.5 py-1 rounded font-medium"
                >
                  <ItemIcon size={12} className="text-primary" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Driver Card */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <p className="micro-label mb-3">Driver & Vehicle</p>
            <TrustStrip
              driver={{
                ...ride.driver,
                carModel: ride.driver?.carModel || ride.carType,
                carNumber: ride.driver?.carNumber,
              }}
              size="md"
              showVehicle={true}
            />
          </div>

          {/* Fare Summary Card */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <p className="micro-label mb-3">Fare Summary</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Base Fare</span>
                <span className="font-medium text-text-primary tabular-nums">{formatCurrency(baseFare)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Distance Charge</span>
                <span className="font-medium text-text-primary tabular-nums">{formatCurrency(distanceFare)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Time Charge</span>
                <span className="font-medium text-text-primary tabular-nums">{formatCurrency(timeFare)}</span>
              </div>
              {surge > 1.0 && (
                <div className="flex justify-between text-warning font-semibold">
                  <span>Surge Multiplier ({surge}×)</span>
                  <span>Applied</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-border">
                <span className="font-bold text-text-primary text-sm">Total Fare (1 Seat)</span>
                <FareLabel amount={ride.price} size="lg" highlight />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/payment', { state: { ride, route, pricing, rideType } })}
            rightIcon={ArrowRight}
          >
            Continue to Payment · {formatCurrency(ride.price)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
