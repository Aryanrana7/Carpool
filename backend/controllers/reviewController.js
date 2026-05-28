const Review = require('../models/Review');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { bookingId, targetId, rating, reviewText, reviewerType } = req.body;
    
    // Populate ride so we can access ride.driver
    const booking = await Booking.findById(bookingId).populate('ride', 'driver');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed rides' });
    }

    const userId = booking.user;
    // Use the driver embedded in the ride, or fall back to targetId supplied by client
    const driverId = booking.ride?.driver || targetId;

    // Prevent duplicate review
    const existingReview = await Review.findOne({ booking: bookingId, reviewerType });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this ride' });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      user: userId,
      driver: driverId,
      rating: Number(rating),
      reviewText,
      reviewerType
    });

    // Recalculate average rating for the target
    if (reviewerType === 'user') {
      // User is reviewing driver
      const reviews = await Review.find({ driver: driverId, reviewerType: 'user' });
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await Driver.findByIdAndUpdate(driverId, {
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: reviews.length
      });
    } else {
      // Driver is reviewing user
      const reviews = await Review.find({ user: userId, reviewerType: 'driver' });
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await User.findByIdAndUpdate(userId, {
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: reviews.length
      });
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reviews for a driver
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

// @desc    Get reviews for a user
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
