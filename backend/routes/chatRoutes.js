const express = require('express');
const router = express.Router();
const { accessChat, getMessages, sendMessage } = require('../controllers/chatController');
const { authEither } = require('../middleware/authMiddleware');

router.route('/').post(authEither, accessChat);
router.route('/:chatId').get(authEither, getMessages);
router.route('/message').post(authEither, sendMessage);

module.exports = router;
