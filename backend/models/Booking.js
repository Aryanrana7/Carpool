const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'cancelled', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  { user: 1, ride: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed', 'in_progress'] },
    },
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
