const express = require('express');
const router = express.Router();
const { createReview, getDriverReviews, getUserReviews } = require('../controllers/reviewController');

const { authEither } = require('../middleware/authMiddleware');

router.route('/').post(authEither, createReview);
router.route('/driver/:id').get(getDriverReviews);
router.route('/user/:id').get(getUserReviews);

module.exports = router;
