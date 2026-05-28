const express = require('express');
const router = express.Router();
const { createRide, getRides, getRideById, searchRides, getDriverRides } = require('../controllers/rideController');
const { protect, protectDriver } = require('../middleware/authMiddleware');

router.route('/')
  .post(protectDriver, createRide)
  .get(getRides); // Public route to view all rides

// MUST be placed before /:id so it doesn't treat 'search' as an ID
router.route('/search').get(searchRides);

router.route('/driver').get(protectDriver, getDriverRides);

router.route('/:id').get(getRideById); // Public route to view specific ride details

module.exports = router;
