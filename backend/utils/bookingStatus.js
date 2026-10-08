const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'in_progress'];

const DRIVER_TRANSITIONS = {
  pending: ['confirmed', 'rejected'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  rejected: [],
  cancelled: [],
  completed: [],
};

const PASSENGER_CANCELLABLE = ['pending', 'confirmed'];

const canDriverTransition = (from, to) => {
  return (DRIVER_TRANSITIONS[from] || []).includes(to);
};

const canPassengerCancel = (status) => PASSENGER_CANCELLABLE.includes(status);

const shouldReleaseSeat = (fromStatus, toStatus) => {
  const releasing = toStatus === 'cancelled' || toStatus === 'rejected';
  const alreadyReleased = fromStatus === 'cancelled' || fromStatus === 'rejected';
  return releasing && !alreadyReleased;
};

const releaseSeat = async (rideId) => {
  await Ride.findByIdAndUpdate(rideId, { $inc: { seats: 1 } });
};

const syncRideStatus = async (rideId) => {
  const ride = await Ride.findById(rideId);
  if (!ride || ride.status === 'cancelled') return ride;

  const bookings = await Booking.find({ ride: rideId }).select('status');
  const hasInProgress = bookings.some((b) => b.status === 'in_progress');
  const hasActive = bookings.some((b) => ACTIVE_BOOKING_STATUSES.includes(b.status));
  const hasCompleted = bookings.some((b) => b.status === 'completed');

  let next = 'active';
  if (hasInProgress) next = 'in_progress';
  else if (hasCompleted && !hasActive) next = 'completed';

  if (ride.status !== next) {
    ride.status = next;
    await ride.save();
  }

  return ride;
};

module.exports = {
  ACTIVE_BOOKING_STATUSES,
  DRIVER_TRANSITIONS,
  canDriverTransition,
  canPassengerCancel,
  shouldReleaseSeat,
  releaseSeat,
  syncRideStatus,
};
