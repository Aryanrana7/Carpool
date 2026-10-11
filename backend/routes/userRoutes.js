const express = require('express');
const { authUser, registerUser, googleAuth, linkGoogleAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const createUserRoutes = (authLimiter) => {
  const router = express.Router();
  const authMiddleware = authLimiter || ((req, res, next) => next());

  router.route('/').post(authMiddleware, registerUser);
  router.post('/login', authMiddleware, authUser);
  router.post('/google', authMiddleware, googleAuth);
  router.post('/link-google', protect, linkGoogleAccount);

  return router;
};

module.exports = createUserRoutes;
