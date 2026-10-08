const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Driver = require('./models/Driver');
const createApp = require('./app');

dotenv.config();
connectDB();

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const driverSockets = new Map();
const userSockets = new Map();

app.set('io', io);
app.set('driverSockets', driverSockets);
app.set('userSockets', userSockets);

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('driver:register', ({ driverId }) => {
    driverSockets.set(driverId, socket.id);
    console.log(`[Socket] Driver registered: ${driverId}`);
  });

  socket.on('user:register', ({ userId }) => {
    userSockets.set(userId, socket.id);
    console.log(`[Socket] User registered: ${userId}`);
  });

  socket.on('driver:locationUpdate', async ({ driverId, lat, lng, passengerId }) => {
    try {
      await Driver.findByIdAndUpdate(driverId, { currentLocation: { lat, lng } });

      if (passengerId && userSockets.has(passengerId)) {
        io.to(userSockets.get(passengerId)).emit('driver:locationUpdate', { lat, lng, driverId });
      }
    } catch (err) {
      console.error('[Socket] Location update error:', err.message);
    }
  });

  socket.on('driver:rideStatus', ({ passengerId, bookingId, status }) => {
    if (passengerId && userSockets.has(passengerId)) {
      io.to(userSockets.get(passengerId)).emit('ride:statusUpdate', { bookingId, status });
    }
  });

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
    for (const [dId, sId] of driverSockets.entries()) {
      if (sId === socket.id) driverSockets.delete(dId);
    }
    for (const [uId, sId] of userSockets.entries()) {
      if (sId === socket.id) userSockets.delete(uId);
    }
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io ready on port ${PORT}`);
});
