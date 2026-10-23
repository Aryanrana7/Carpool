const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { getCorsOptions } = require('./config/corsOptions');

const createApp = ({ io, driverSockets, userSockets, corsOptions: customCorsOptions } = {}) => {
  const app = express();

  app.use(cors(customCorsOptions || getCorsOptions()));
  
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());

  // Rate limiting
  const isTest = process.env.NODE_ENV === 'test';
  const authLimiter = isTest ? (req, res, next) => next() : rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many auth requests, please try again later.' } });
  const searchLimiter = isTest ? (req, res, next) => next() : rateLimit({ windowMs: 1 * 60 * 1000, max: 60, message: { message: 'Too many search/proxy requests.' } });
  const apiLimiter = isTest ? (req, res, next) => next() : rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { message: 'Too many requests.' } });

  if (io) app.set('io', io);
  if (driverSockets) app.set('driverSockets', driverSockets);
  if (userSockets) app.set('userSockets', userSockets);

  app.get('/health', (req, res) => {
    res.json({ ok: true, status: 'healthy' });
  });

  app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
  app.use('/api/drivers', require('./routes/driverRoutes')(authLimiter));
  app.use('/api/proxy', searchLimiter, require('./routes/proxyRoutes'));
  
  // Apply general limiter to remaining routes
  app.use('/api', apiLimiter);
  
  app.use('/api/users', require('./routes/userRoutes')(authLimiter));
  app.use('/api/rides', require('./routes/rideRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/ride-requests', require('./routes/rideRequestRoutes'));
  app.use('/api/pricing', searchLimiter, require('./routes/pricingRoutes'));
  app.use('/api/chat', require('./routes/chatRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  app.use('/api/support', require('./routes/supportRoutes'));

  return app;
};

module.exports = createApp;
