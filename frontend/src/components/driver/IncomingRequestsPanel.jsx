import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation2,
  Users,
  Check,
  X,
  Loader2,
  MessageSquare,
  Radio,
  RadioTower,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import RouteConnector from '../ui/RouteConnector';
import { formatCurrency, formatDistance } from '../../utils/formatters';

const AUTH_HEADER = () => ({ Authorization: `Bearer ${localStorage.getItem('driverToken')}` });

const IncomingRequestsPanel = ({
  socket,
  activeOnDemandRide,
  isOnline = true,
  onRideAccepted,
  onRideStatusUpdated,
  onChatOpen,
}) => {
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  // Fetch pending requests on mount
  useEffect(() => {
    let isMounted = true;
    const fetchPending = async () => {
      try {
        const { data } = await api.get('/ride-requests/driver/pending', { headers: AUTH_HEADER() });
        if (isMounted) setRequests(data || []);
      } catch {
        // silent
      }
    };

    fetchPending();

    if (!socket) return;

    const handleNewRequest = (newReq) => {
      setRequests((prev) => {
        if (prev.some((r) => r._id === newReq.requestId)) return prev;
        toast('New on-demand ride request nearby', { icon: '🚘' });
        return [
          {
            _id: newReq.requestId,
            pickup: newReq.pickup,
            destination: newReq.destination,
            passengerCount: newReq.passengerCount,
            rideType: newReq.rideType,
            fare: { totalFare: newReq.fare },
            distanceToPickup: newReq.distanceToPickup,
            expiresAt: newReq.expiresAt,
            user: { name: newReq.passengerName },
          },
          ...prev,
        ];
      });
    };

    const handleRequestTaken = ({ requestId }) => {
      setRequests((prev) => {
        const existed = prev.some((r) => r._id === requestId);
        if (existed) {
          toast('Request was accepted by another driver');
        }
        return prev.filter((r) => r._id !== requestId);
      });
    };

    socket.on('request:new', handleNewRequest);
    socket.on('request:taken', handleRequestTaken);

    return () => {
      isMounted = false;
      socket.off('request:new', handleNewRequest);
      socket.off('request:taken', handleRequestTaken);
    };
  }, [socket]);

  // Handle Accept
  const handleAccept = async (requestId) => {
    setProcessingId(requestId);
    try {
      const { data } = await api.post(
        `/ride-requests/${requestId}/accept`,
        {},
        { headers: AUTH_HEADER() }
      );
      toast.success('Ride claimed! Proceed to pickup location.');
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      if (onRideAccepted) {
        onRideAccepted(data.rideRequest, data.bookingId);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not claim ride');
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Decline
  const handleDecline = async (requestId) => {
    setProcessingId(requestId);
    try {
      await api.post(`/ride-requests/${requestId}/decline`, {}, { headers: AUTH_HEADER() });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast('Request declined');
    } catch {
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } finally {
      setProcessingId(null);
    }
  };

  // Status transitions for active ride
  const handleStatusTransition = async (newStatus) => {
    if (!activeOnDemandRide) return;
    try {
      await api.put(
        `/ride-requests/${activeOnDemandRide._id}/status`,
        { status: newStatus },
        { headers: AUTH_HEADER() }
      );
      toast.success(`Trip status updated: ${newStatus.replace('_', ' ')}`);
      if (onRideStatusUpdated) {
        onRideStatusUpdated(newStatus);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const hasRequests = requests.length > 0;

  return (
    <div
      className="bg-surface border border-border rounded-xl overflow-hidden shadow-subtle transition-all duration-300"
      aria-live="polite"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              hasRequests ? 'bg-primary animate-ping' : isOnline ? 'bg-success' : 'bg-border'
            }`}
          />
          <h2 className="font-bold text-sm text-text-primary">
            Incoming On-Demand Broadcasts
          </h2>
        </div>
        {hasRequests && (
          <Badge variant="warning">
            {requests.length} pending
          </Badge>
        )}
      </div>

      {/* Active On-Demand Ride Controller */}
      {activeOnDemandRide && (
        <div className="p-4 bg-primary-subtle border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Check size={14} /> Active On-Demand Assignment
            </span>
            <Badge variant="info">
              {activeOnDemandRide.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="text-xs text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">
              Passenger: {activeOnDemandRide.user?.name || 'Passenger'}
            </p>
            <p className="truncate text-text-muted">
              Pickup: {activeOnDemandRide.pickup?.address}
            </p>
            <p className="truncate text-text-muted">
              Dropoff: {activeOnDemandRide.destination?.address}
            </p>
          </div>

          {/* Quick Operations Controls */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {activeOnDemandRide.status === 'accepted' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusTransition('driver_arriving')}
              >
                <Navigation2 size={13} className="mr-1" /> Arrived at Pickup
              </Button>
            )}

            {activeOnDemandRide.status === 'driver_arriving' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusTransition('in_progress')}
              >
                <Navigation2 size={13} className="mr-1" /> Start Trip
              </Button>
            )}

            {activeOnDemandRide.status === 'in_progress' && (
              <Button
                variant="primary"
                size="sm"
                className="bg-success hover:bg-success/90"
                onClick={() => handleStatusTransition('completed')}
              >
                <Check size={13} className="mr-1" /> Complete Trip
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onChatOpen && onChatOpen(activeOnDemandRide)}
            >
              <MessageSquare size={13} className="text-primary mr-1" /> Chat
            </Button>
          </div>
        </div>
      )}

      {/* Requests List / Compact Empty State */}
      <div className="divide-y divide-border">
        <AnimatePresence>
          {!hasRequests ? (
            <div className="px-5 py-4 flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-2.5">
                {isOnline ? (
                  <Radio size={16} className="text-success animate-pulse shrink-0" />
                ) : (
                  <RadioTower size={16} className="text-text-muted shrink-0" />
                )}
                <span>
                  {isOnline
                    ? "You're online. Scanning for nearby ride requests..."
                    : "You're offline. Go online to receive on-demand requests."}
                </span>
              </div>
              <span className="text-[11px] font-medium text-text-muted hidden sm:inline">
                {isOnline ? 'Active Dispatch' : 'Standby'}
              </span>
            </div>
          ) : (
            requests.map((req) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="p-4 hover:bg-background/60 transition-colors space-y-3"
              >
                <RouteConnector
                  pickup={req.pickup?.address || 'Pickup point'}
                  destination={req.destination?.address || 'Destination point'}
                />

                {/* Meta details */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                  <span className="font-bold text-sm text-text-primary tabular-nums">
                    {formatCurrency(req.fare?.totalFare || 0)}
                  </span>
                  <div className="flex items-center gap-3 text-text-muted">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {req.passengerCount} seat{req.passengerCount > 1 ? 's' : ''}
                    </span>
                    <span>
                      {req.distanceToPickup ? formatDistance(req.distanceToPickup) + ' away' : 'Nearby'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => handleAccept(req._id)}
                    disabled={processingId === req._id || !!activeOnDemandRide}
                  >
                    {processingId === req._id ? (
                      <Loader2 size={14} className="animate-spin mr-1.5" />
                    ) : (
                      <Check size={14} className="mr-1.5" />
                    )}
                    Accept Ride
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDecline(req._id)}
                    disabled={processingId === req._id}
                    className="text-text-muted hover:text-danger"
                    title="Decline request"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IncomingRequestsPanel;
