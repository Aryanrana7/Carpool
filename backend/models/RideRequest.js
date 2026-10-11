const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destination: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    passengerCount: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      default: 1,
    },
    rideType: {
      type: String,
      enum: ['mini', 'sedan', 'suv'],
      default: 'sedan',
    },
    fare: {
      baseFare: { type: Number, required: true },
      distanceFare: { type: Number, required: true },
      timeFare: { type: Number, required: true },
      surgeMultiplier: { type: Number, default: 1.0 },
      totalFare: { type: Number, required: true },
      distanceKm: { type: Number, required: true },
      durationMin: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        'searching',
        'accepted',
        'driver_arriving',
        'in_progress',
        'completed',
        'cancelled',
        'expired',
      ],
      default: 'searching',
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
      index: true,
    },
    declinedDrivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
      },
    ],
    notifiedDrivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
      },
    ],
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      default: null,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    assignedAt: { type: Date, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    cancelledBy: {
      type: String,
      enum: ['user', 'driver', 'system'],
      default: null,
    },
    cancellationReason: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

rideRequestSchema.index({ user: 1, status: 1 });
rideRequestSchema.index({ status: 1, expiresAt: 1 });

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

module.exports = RideRequest;
