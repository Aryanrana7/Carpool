const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');

router.get('/geocode', proxyController.geocode);
router.get('/reverse', proxyController.reverse);

module.exports = router;
