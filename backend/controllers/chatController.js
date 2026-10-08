const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Booking = require('../models/Booking');

const getActorId = (req) => req.user?._id || req.driver?._id;

const getAuthorizedBooking = async (bookingId, req) => {
  const booking = await Booking.findById(bookingId).populate('ride', 'driver');
  if (!booking || !booking.ride) return null;

  const actorId = getActorId(req);
  const isPassenger = Boolean(req.user && booking.user.equals(actorId));
  const isDriver = Boolean(req.driver && booking.ride.driver.equals(actorId));

  if (!isPassenger && !isDriver) return null;
  return { booking, isPassenger, isDriver };
};

const getAuthorizedChat = async (chatId, req) => {
  const chat = await Chat.findById(chatId).populate({ path: 'booking', populate: { path: 'ride', select: 'driver' } });
  if (!chat?.booking?.ride) return null;

  const actorId = getActorId(req);
  const isPassenger = Boolean(req.user && chat.booking.user.equals(actorId));
  const isDriver = Boolean(req.driver && chat.booking.ride.driver.equals(actorId));
  const isParticipant = chat.participants.some((participant) => participant.equals(actorId));

  return isParticipant && (isPassenger || isDriver) ? chat : null;
};

const accessChat = async (req, res) => {
  try {
    const { bookingId, participantId } = req.body;
    const authorized = await getAuthorizedBooking(bookingId, req);
    if (!authorized) return res.status(403).json({ message: 'Not authorized to access this booking chat' });

    const actorId = getActorId(req);
    const otherParticipantId = authorized.isPassenger
      ? authorized.booking.ride.driver
      : authorized.booking.user;

    if (participantId && participantId !== otherParticipantId.toString()) {
      return res.status(400).json({ message: 'Chat participant does not match this booking' });
    }

    let chat = await Chat.findOne({ booking: bookingId }).populate('lastMessage');

    if (!chat) {
      chat = await Chat.create({
        booking: bookingId,
        participants: [actorId, otherParticipantId]
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const chat = await getAuthorizedChat(req.params.chatId, req);
    if (!chat) return res.status(403).json({ message: 'Not authorized to read this chat' });

    const messages = await Message.find({ chat: chat._id })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = getActorId(req);
    const chat = await getAuthorizedChat(chatId, req);
    if (!chat) return res.status(403).json({ message: 'Not authorized to send to this chat' });
    if (!text?.trim()) return res.status(400).json({ message: 'Message text is required' });

    const message = await Message.create({
      chat: chat._id,
      sender: senderId,
      text: text.trim(),
    });

    await Chat.findByIdAndUpdate(chat._id, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { accessChat, getMessages, sendMessage };
