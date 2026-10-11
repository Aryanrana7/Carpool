const express = require('express');
const {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverAvailability,
  updateDriverLocation,
} = require('../controllers/driverController');
const { protectDriver } = require('../middleware/authMiddleware');

const createDriverRoutes = (authLimiter) => {
  const router = express.Router();
  const authMiddleware = authLimiter || ((req, res, next) => next());

  router.post('/register', authMiddleware, registerDriver);
  router.post('/login', authMiddleware, loginDriver);
  router.route('/profile').get(protectDriver, getDriverProfile);
  router.route('/availability').put(protectDriver, updateDriverAvailability);
  router.route('/location').put(protectDriver, updateDriverLocation);

  return router;
};

module.exports = createDriverRoutes;

