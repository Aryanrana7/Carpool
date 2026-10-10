import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Check, Car, User, Navigation2 } from 'lucide-react';
import RouteConnector from '../ui/RouteConnector';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import FareLabel from '../ui/FareLabel';
import { formatCurrency, formatTime } from '../../utils/formatters';

const STATUS = {
  confirmed: { label: 'Accepted', step: 1, variant: 'success' },
  in_progress: { label: 'En Route', step: 2, variant: 'info' },
  completed: { label: 'Completed', step: 3, variant: 'neutral' },
};

const steps = [
  { label: 'Accepted', step: 1 },
  { label: 'En Route', step: 2 },
  { label: 'Done', step: 3 },
];

const ActiveRidePanel = ({ booking, onUpdateStatus, onChatOpen }) => {
  if (!booking) {
    return (
      <div className="bg-surface border border-border rounded-xl h-full flex flex-col items-center justify-center p-8 text-center shadow-subtle">
        <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center mb-3 text-text-muted">
          <Car size={22} />
        </div>
        <p className="font-semibold text-sm text-text-primary">No Active Ride</p>
        <p className="text-xs text-text-muted mt-1 max-w-[200px]">
          Accept an incoming reservation to initiate live trip navigation
        </p>
      </div>
    );
  }

  const progress = STATUS[booking.status]?.step ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface border border-border rounded-xl h-full flex flex-col overflow-hidden shadow-subtle"
    >
      {/* Header Band */}
      <div className="bg-ink px-5 py-3.5 flex-shrink-0 text-white flex items-center justify-between border-b border-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-subtle block">
            Active Ride Session
          </span>
          <h2 className="text-sm font-bold text-white mt-0.5">Trip In Progress</h2>
        </div>
        <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">
          #{booking._id?.slice(-8).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative px-4 pt-1">
          <div className="absolute left-8 right-8 top-[19px] h-0.5 bg-border z-0">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((progress - 1) / 2) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-primary"
            />
          </div>
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  progress >= s.step
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-surface border-border text-text-muted'
                }`}
              >
                {progress > s.step ? <Check size={13} /> : s.step}
              </div>
              <p
                className={`text-[10px] font-medium mt-1 ${
                  progress >= s.step ? 'text-primary' : 'text-text-muted'
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Passenger Card */}
        <div className="p-3.5 rounded-lg bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              Passenger
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onChatOpen(booking)}
              className="py-1 px-2.5 text-xs h-auto"
            >
              <MessageSquare size={13} className="text-primary mr-1" />
              Chat
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {booking.user?.name?.charAt(0) || <User size={16} />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-text-primary truncate">
                {booking.user?.name || 'Passenger'}
              </p>
              <p className="text-xs text-text-muted truncate">{booking.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-3.5 rounded-lg bg-background border border-border">
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-2.5">
            Route Details
          </span>
          <RouteConnector
            pickup={booking.ride?.source || 'Pickup location'}
            destination={booking.ride?.destination || 'Destination location'}
          />
        </div>

        {/* Fare & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background border border-border text-center flex flex-col items-center justify-center">
            <span className="text-[11px] font-medium text-text-muted block">Fare</span>
            <FareLabel amount={booking.ride?.price ?? 0} size="md" highlight className="mt-0.5" />
          </div>
          <div className="p-3 rounded-lg bg-background border border-border text-center">
            <span className="text-[11px] font-medium text-text-muted block">Departure</span>
            <p className="text-xs font-semibold text-text-primary mt-1">
              {booking.ride?.time ? formatTime(booking.ride.time) : 'Now'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-1">
          {booking.status === 'confirmed' && (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => onUpdateStatus(booking, 'in_progress')}
            >
              <Navigation2 size={16} className="mr-1.5" />
              Start Ride
            </Button>
          )}
          {booking.status === 'in_progress' && (
            <Button
              variant="primary"
              className="w-full bg-success hover:bg-success/90"
              onClick={() => onUpdateStatus(booking, 'completed')}
            >
              <Check size={16} className="mr-1.5" />
              Complete Ride
            </Button>
          )}
          {booking.status === 'completed' && (
            <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-center text-xs font-semibold text-success">
              Trip completed successfully.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveRidePanel;
