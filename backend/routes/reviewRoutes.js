const express = require('express');
const router = express.Router();
const { createReview, getDriverReviews, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview);
router.route('/driver/:id').get(getDriverReviews);
router.route('/user/:id').get(getUserReviews);

module.exports = router;

