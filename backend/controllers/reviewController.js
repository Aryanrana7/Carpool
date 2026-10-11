const Review = require('../models/Review');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

// @desc    Create a review (passenger reviewing driver only)
// @route   POST /api/reviews
// @access  Private (Passenger only)
const createReview = async (req, res) => {
  try {
    // Only authenticated passengers can submit reviews
    if (!req.user || req.driver) {
      return res.status(403).json({ message: 'Only passengers can submit reviews for drivers' });
    }

    const { bookingId, rating, reviewText } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const ratingNum = Number(rating);
    if (!ratingNum || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    if (reviewText && typeof reviewText === 'string' && reviewText.trim().length > 500) {
      return res.status(400).json({ message: 'Review text cannot exceed 500 characters' });
    }

    // Populate ride so we can access ride.driver
    const booking = await Booking.findById(bookingId).populate('ride');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify booking belongs to the authenticated passenger
    if (!booking.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    // Must be completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed rides' });
    }

    const driverId = booking.ride?.driver;
    if (!driverId) {
      return res.status(400).json({ message: 'No driver associated with this ride' });
    }

    // Prevent duplicate review for this booking
    const existingReview = await Review.findOne({ booking: bookingId, reviewerType: 'user' });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this ride' });
    }

    // Create passenger-to-driver review
    const review = await Review.create({
      booking: bookingId,
      user: req.user._id,
      driver: driverId,
      rating: ratingNum,
      reviewText: reviewText ? reviewText.trim() : '',
      reviewerType: 'user',
    });

    // Recalculate average rating for the driver based exclusively on passenger reviews
    const reviews = await Review.find({ driver: driverId, reviewerType: 'user' });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await Driver.findByIdAndUpdate(driverId, {
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this ride' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reviews for a driver (passenger reviews)
// @route   GET /api/reviews/driver/:id
// @access  Public
const getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ driver: req.params.id, reviewerType: 'user' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reviews for a user (deprecated/placeholder - returns empty or legacy)
// @route   GET /api/reviews/user/:id
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.id, reviewerType: 'driver' })
      .populate('driver', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReview,
  getDriverReviews,
  getUserReviews,
};
