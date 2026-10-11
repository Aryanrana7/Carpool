const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getDriverBookings,
  updateBookingStatusDriver,
  getDriverStats
} = require('../controllers/bookingController');
const { protect, protectDriver, authEither } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/user').get(protect, getUserBookings);
router.route('/driver').get(protectDriver, getDriverBookings);
router.route('/driver/stats').get(protectDriver, getDriverStats);
router.route('/:id').get(authEither, getBookingById);
router.route('/:id/status').put(protect, updateBookingStatus);
router.route('/:id/driver-status').put(protectDriver, updateBookingStatusDriver);

module.exports = router;

