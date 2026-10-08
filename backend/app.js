const express = require('express');
const cors = require('cors');

const createApp = ({ io, driverSockets, userSockets } = {}) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  if (io) app.set('io', io);
  if (driverSockets) app.set('driverSockets', driverSockets);
  if (userSockets) app.set('userSockets', userSockets);

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/rides', require('./routes/rideRoutes'));
  app.use('/api/bookings', require('./routes/bookingRoutes'));
  app.use('/api/drivers', require('./routes/driverRoutes'));
  app.use('/api/pricing', require('./routes/pricingRoutes'));
  app.use('/api/chat', require('./routes/chatRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));

  return app;
};

module.exports = createApp;
