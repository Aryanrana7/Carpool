const jwt = require('jsonwebtoken');
const Driver = require('./models/Driver');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Chat = require('./models/Chat');
const Message = require('./models/Message');

const getAuthorizedBookingForDriver = async (bookingId, driverId) => {
  const booking = await Booking.findById(bookingId).populate('ride', 'driver');
  if (!booking?.ride || !booking.ride.driver.equals(driverId)) return null;
  return booking;
};

const canAccessChat = async (chatId, actor) => {
  const chat = await Chat.findById(chatId).populate({ path: 'booking', populate: { path: 'ride', select: 'driver' } });
  if (!chat?.booking?.ride || !chat.participants.some((id) => id.equals(actor.id))) return false;

  return actor.type === 'user'
    ? chat.booking.user.equals(actor.id)
    : chat.booking.ride.driver.equals(actor.id);
};

const setupRealtime = (io, { driverSockets, userSockets }) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(id).select('_id');
      if (user) {
        socket.data.actor = { id: user._id, type: 'user' };
        return next();
      }

      const driver = await Driver.findById(id).select('_id');
      if (driver) {
        socket.data.actor = { id: driver._id, type: 'driver' };
        return next();
      }

      return next(new Error('Authentication failed'));
    } catch {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const { actor } = socket.data;
    const sockets = actor.type === 'driver' ? driverSockets : userSockets;
    sockets.set(actor.id.toString(), socket.id);

    socket.on('driver:locationUpdate', async ({ bookingId, lat, lng }) => {
      try {
        if (actor.type !== 'driver' || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;

        const booking = await getAuthorizedBookingForDriver(bookingId, actor.id);
        if (!booking || !['confirmed', 'in_progress'].includes(booking.status)) return;

        await Driver.findByIdAndUpdate(actor.id, { currentLocation: { lat, lng } });
        const passengerSocket = userSockets.get(booking.user.toString());
        if (passengerSocket) {
          io.to(passengerSocket).emit('driver:locationUpdate', { lat, lng, driverId: actor.id.toString() });
        }
      } catch (error) {
        console.error('[Socket] Location update error:', error.message);
      }
    });

    socket.on('driver:rideStatus', async ({ bookingId, status }) => {
      if (actor.type !== 'driver') return;
      const booking = await getAuthorizedBookingForDriver(bookingId, actor.id);
      if (!booking || booking.status !== status) return;

      const passengerSocket = userSockets.get(booking.user.toString());
      if (passengerSocket) io.to(passengerSocket).emit('ride:statusUpdate', { bookingId, status });
    });

    socket.on('joinChat', async (chatId) => {
      if (!(await canAccessChat(chatId, actor))) return;
      socket.join(chatId);
    });

    socket.on('sendMessage', async (message) => {
      if (!message?.chat || !(await canAccessChat(message.chat, actor))) return;
      const persistedMessage = await Message.findById(message._id);
      if (!persistedMessage || !persistedMessage.sender.equals(actor.id)) return;
      socket.in(message.chat).emit('receiveMessage', persistedMessage);
    });

    socket.on('typing', async (chatId) => {
      if (await canAccessChat(chatId, actor)) socket.in(chatId).emit('typing');
    });

    socket.on('stopTyping', async (chatId) => {
      if (await canAccessChat(chatId, actor)) socket.in(chatId).emit('stopTyping');
    });

    socket.on('disconnect', () => {
      if (sockets.get(actor.id.toString()) === socket.id) sockets.delete(actor.id.toString());
    });
  });
};

module.exports = { setupRealtime };
