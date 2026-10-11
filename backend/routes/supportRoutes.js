const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { optionalAuth, authEither } = require('../middleware/authMiddleware');

// Public or authenticated contact inquiry
router.post('/contact', optionalAuth, supportController.submitContact);

// Public or authenticated problem/safety report
router.post('/report', optionalAuth, supportController.submitReport);

// View user's own submitted reports (requires authenticated passenger or driver)
router.get('/my-reports', authEither, supportController.getMyReports);

// Public or authenticated feedback submission
router.post('/feedback', optionalAuth, supportController.submitFeedback);

module.exports = router;
