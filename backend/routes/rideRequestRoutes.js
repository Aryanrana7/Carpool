const express = require('express');
const router = express.Router();
const {
  createRideRequest,
  getActivePassengerRequest,
  getDriverPendingRequests,
  acceptRideRequest,
  declineRideRequest,
  updateRideRequestStatus,
  cancelRideRequest,
  getRideRequestById,
} = require('../controllers/rideRequestController');
const { protect, protectDriver, authEither } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRideRequest);

router.route('/active')
  .get(protect, getActivePassengerRequest);

router.route('/driver/pending')
  .get(protectDriver, getDriverPendingRequests);

router.route('/:id')
  .get(authEither, getRideRequestById);

router.route('/:id/accept')
  .post(protectDriver, acceptRideRequest);

router.route('/:id/decline')
  .post(protectDriver, declineRideRequest);

router.route('/:id/status')
  .put(protectDriver, updateRideRequestStatus);

router.route('/:id/cancel')
  .put(authEither, cancelRideRequest);

module.exports = router;
