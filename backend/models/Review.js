const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, trim: true },
  reviewerType: { type: String, enum: ['user', 'driver'], required: true },
}, { timestamps: true });

// Prevent multiple reviews from the same person for the same booking
reviewSchema.index({ booking: 1, reviewerType: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
