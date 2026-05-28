const Chat = require('../models/Chat');
const Message = require('../models/Message');

const accessChat = async (req, res) => {
  try {
    const { bookingId, participantId } = req.body;
    
    let chat = await Chat.findOne({
      booking: bookingId,
      participants: { $all: [req.user ? req.user._id : req.driver._id, participantId] }
    }).populate('lastMessage');

    if (!chat) {
      chat = await Chat.create({
        booking: bookingId,
        participants: [req.user ? req.user._id : req.driver._id, participantId]
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.user ? req.user._id : req.driver._id;

    let message = await Message.create({
      chat: chatId,
      sender: senderId,
      text,
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { accessChat, getMessages, sendMessage };
