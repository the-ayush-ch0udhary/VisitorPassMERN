const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/otpController');

// OTP registration/validation routes
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);

module.exports = router;
