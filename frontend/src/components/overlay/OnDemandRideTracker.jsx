import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  MapPin,
  Car,
  Star,
  MessageSquare,
  Clock,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import TrustStrip from '../ui/TrustStrip';
import FareLabel from '../ui/FareLabel';

const STATUS_STEPS = [
  { key: 'searching', label: 'Finding Driver' },
  { key: 'accepted', label: 'Driver Assigned' },
  { key: 'driver_arriving', label: 'Arriving' },
  { key: 'in_progress', label: 'On Trip' },
  { key: 'completed', label: 'Completed' },
];

const getStepIndex = (status) => {
  switch (status) {
    case 'searching': return 0;
    case 'accepted': return 1;
    case 'driver_arriving': return 2;
    case 'in_progress': return 3;
    case 'completed': return 4;
    default: return 0;
  }
};

export const OnDemandRideTracker = ({
  request,
  onCancel,
  onChatOpen,
  onRateOpen,
  onClose,
  embedded = false,
}) => {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [localStatus, setLocalStatus] = useState(request?.status || 'searching');

  useEffect(() => {
    if (request?.status) {
      setLocalStatus(request.status);
    }
  }, [request?.status]);

  useEffect(() => {
    if (!request) return;
    const isPast = request.expiresAt && new Date(request.expiresAt).getTime() <= Date.now();
    if (isPast && localStatus === 'searching') {
      setLocalStatus('expired');
      setCountdown(0);
      return;
    }

    if (localStatus !== 'searching') return;
    const expiresAt = new Date(request.expiresAt).getTime();

    const checkTime = () => {
      const remaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        setLocalStatus('expired');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [request, localStatus]);

  if (!request) return null;

  const statusToRender = localStatus || request.status;
  const isSearching = statusToRender === 'searching';
  const hasDriver = Boolean(request.driver);
  const currentStep = getStepIndex(statusToRender);

  const handleCancelRequest = async () => {
    setCancelling(true);
    try {
      await api.put(`/ride-requests/${request._id}/cancel`, {
        reason: 'Cancelled by passenger',
      });
      toast.success('Ride request cancelled');
      setShowCancelConfirm(false);
      if (onCancel) onCancel();
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (status === 403 || status === 404 || status === 400) {
        // If session was switched or request is already expired/closed, resolve smoothly
        toast(message || 'Ride request was closed', { icon: 'ℹ️' });
        setShowCancelConfirm(false);
        if (onCancel) onCancel();
      } else {
        toast.error(message || 'Failed to cancel request');
      }
    } finally {
      setCancelling(false);
    }
  };

  const handleDismiss = () => {
    if (onClose) onClose();
    else if (onCancel) onCancel();
  };

  return (
    <>
      <motion.div
        initial={embedded ? { opacity: 0, y: 10 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={embedded ? { opacity: 0, y: -10 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.2 }}
        role="region"
        aria-live="polite"
        aria-label="Active Ride Request Tracking"
        className={
          embedded
            ? "w-full bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-sm"
            : "fixed bottom-6 left-1/2 -translate-x-1/2 z-[1150] w-[calc(100vw-32px)] max-w-lg bg-surface/98 backdrop-blur-md border border-border rounded-2xl p-5 shadow-2xl"
        }
      >
        {/* Top Status Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Badge status={statusToRender} />
            {isSearching && (
              <span className="text-xs font-semibold tabular-nums text-text-muted flex items-center gap-1">
                <Clock size={12} className="text-primary" /> {countdown}s remaining
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {statusToRender === 'completed' && onRateOpen && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={Star}
                onClick={() => onRateOpen(request)}
              >
                Rate Driver
              </Button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close ride tracker"
              className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-sunken transition-colors"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Visual Status Stepper */}
        {!['cancelled', 'expired'].includes(statusToRender) && (
          <div className="my-3 py-2 px-1">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStep >= idx;
                const isCurrent = currentStep === idx;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors
                        ${isCurrent
                          ? 'bg-primary text-white border-primary ring-4 ring-primary/20'
                          : isPassed
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface text-text-muted border-border'
                        }
                      `}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-text-secondary mt-1 hidden sm:block whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Searching Functional Radar Animation */}
        {isSearching && (
          <div className="my-3 p-4 rounded-lg bg-background border border-border flex flex-col items-center justify-center text-center">
            <div className="relative w-12 h-12 flex items-center justify-center mb-2">
              <span className="absolute w-12 h-12 rounded-full bg-primary/20 animate-ping" />
              <div className="relative z-10 w-8 h-8 rounded-full bg-primary-subtle text-primary border border-primary/30 flex items-center justify-center">
                <Zap size={16} />
              </div>
            </div>
            <p className="text-xs font-bold text-text-primary">
              Broadcasting request to nearby drivers…
            </p>
            <p className="text-[11px] text-text-muted mt-0.5 max-w-xs">
              Matching with online drivers within radius. First driver to accept confirms your trip.
            </p>
          </div>
        )}

        {/* Expired State Notice */}
        {statusToRender === 'expired' && (
          <div className="my-3 p-4 rounded-lg bg-surface-sunken border border-border flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-accent-muted text-text-muted flex items-center justify-center mb-2">
              <Clock size={18} />
            </div>
            <p className="text-xs font-bold text-text-primary">
              No Nearby Drivers Available
            </p>
            <p className="text-[11px] text-text-muted mt-0.5 max-w-xs">
              Drivers in this pickup radius didn’t respond in time. You can try searching again or choose a scheduled ride.
            </p>
          </div>
        )}

        {/* Assigned Driver Card */}
        {hasDriver && (
          <div className="my-3 p-3.5 rounded-lg bg-background border border-border space-y-2.5">
            <TrustStrip
              driver={{
                ...request.driver,
                carModel: request.driver.carModel,
                carNumber: request.driver.carNumber,
              }}
              size="md"
              showVehicle={true}
            />

            {/* Chat Action */}
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={MessageSquare}
                onClick={() => onChatOpen && onChatOpen(request)}
              >
                Chat with Driver
              </Button>
            </div>
          </div>
        )}

        {/* Route & Fare Summary */}
        <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-border text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <MapPin size={12} className="text-primary shrink-0" />
              <span className="truncate">{request.pickup?.address?.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Navigation size={12} className="text-text-primary shrink-0" />
              <span className="truncate">{request.destination?.address?.split(',')[0]}</span>
            </div>
          </div>

          <div className="text-right flex flex-col justify-center items-end">
            <p className="micro-label">Total Fare</p>
            <FareLabel amount={request.fare?.totalFare} size="md" highlight />
            <p className="text-[10px] text-text-muted mt-0.5">
              {request.passengerCount} seat{request.passengerCount > 1 ? 's' : ''} · {request.rideType}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-3">
          {['searching', 'accepted', 'driver_arriving'].includes(statusToRender) ? (
            <Button
              variant="destructive"
              size="sm"
              fullWidth
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel Request
            </Button>
          ) : statusToRender === 'in_progress' ? (
            <p className="text-xs font-medium text-primary text-center py-1">
              Ride in progress. Heading toward your destination.
            </p>
          ) : statusToRender === 'expired' ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                leftIcon={RefreshCw}
                onClick={handleDismiss}
              >
                Try Again
              </Button>
            </div>
          ) : null}
        </div>
      </motion.div>

      {/* Cancel Confirmation Dialog */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[1250] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <div
              role="alertdialog"
              aria-modal="true"
              className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full shadow-modal space-y-4"
            >
              <div className="flex items-center gap-2.5 text-danger">
                <AlertTriangle size={20} />
                <h3 className="text-base font-bold text-text-primary">
                  Cancel Request?
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to cancel this on-demand ride request?
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Request
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  loading={cancelling}
                  onClick={handleCancelRequest}
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OnDemandRideTracker;
