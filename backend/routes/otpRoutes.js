const express = require('express');
const router = express.Router();

const {
    sendOTP,
    verifyOTP
} = require('../controllers/otpController');

const otpLimiter = require('../middleware/rateLimit');

router.post('/send', otpLimiter, sendOTP);

router.post('/verify', otpLimiter, verifyOTP);

module.exports = router;