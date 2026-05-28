const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    carType: {
      type: String,
      default: 'Sedan',
    },
    rideType: {
      type: String,
      enum: ['mini', 'sedan', 'suv'],
      default: 'sedan',
    },
    priceBreakdown: {
      baseFare: Number,
      distanceFare: Number,
      timeFare: Number,
      surgeMultiplier: Number,
      distanceKm: Number,
      durationMin: Number,
    },
    status: {
      type: String,
      enum: ['active', 'in_progress', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
