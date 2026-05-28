const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Driver = require('./models/Driver');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// ─── Socket.io Setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Map of driverId -> socketId for targeted emissions
const driverSockets = new Map();
// Map of userId -> socketId
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Driver registers its socket
  socket.on('driver:register', ({ driverId }) => {
    driverSockets.set(driverId, socket.id);
    console.log(`[Socket] Driver registered: ${driverId}`);
  });

  // User registers its socket
  socket.on('user:register', ({ userId }) => {
    userSockets.set(userId, socket.id);
    console.log(`[Socket] User registered: ${userId}`);
  });

  // Driver emits its location every 2-5 seconds
  socket.on('driver:locationUpdate', async ({ driverId, lat, lng, bookingId, passengerId }) => {
    try {
      // Persist to DB
      await Driver.findByIdAndUpdate(driverId, { currentLocation: { lat, lng } });

      // Emit to the specific user who booked this ride
      if (passengerId && userSockets.has(passengerId)) {
        io.to(userSockets.get(passengerId)).emit('driver:locationUpdate', { lat, lng, driverId });
      }
    } catch (err) {
      console.error('[Socket] Location update error:', err.message);
    }
  });

  // Driver emits a ride status change
  socket.on('driver:rideStatus', ({ passengerId, bookingId, status }) => {
    if (passengerId && userSockets.has(passengerId)) {
      io.to(userSockets.get(passengerId)).emit('ride:statusUpdate', { bookingId, status });
    }
  });

  // --- Chat Events ---
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`[Socket] Joined chat room: ${chatId}`);
  });

  socket.on('sendMessage', (message) => {
    socket.in(message.chat).emit('receiveMessage', message);
  });

  socket.on('typing', (chatId) => {
    socket.in(chatId).emit('typing');
  });

  socket.on('stopTyping', (chatId) => {
    socket.in(chatId).emit('stopTyping');
  });

  socket.on('disconnect', () => {
    // Clean up maps on disconnect
    for (const [dId, sId] of driverSockets.entries()) {
      if (sId === socket.id) driverSockets.delete(dId);
    }
    for (const [uId, sId] of userSockets.entries()) {
      if (sId === socket.id) userSockets.delete(uId);
    }
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Export io so controllers can emit events
app.set('io', io);
app.set('driverSockets', driverSockets);
app.set('userSockets', userSockets);

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io ready on port ${PORT}`);
});
