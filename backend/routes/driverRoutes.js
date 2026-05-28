const express = require('express');
const router = express.Router();
const {
  registerDriver,
  loginDriver,
  getDriverProfile,
} = require('../controllers/driverController');
const { protectDriver } = require('../middleware/authMiddleware');

router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.route('/profile').get(protectDriver, getDriverProfile);

module.exports = router;
