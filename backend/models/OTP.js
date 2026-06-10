const mongoose = require('mongoose');

// OTP schema for storing transient verification codes
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OTP', otpSchema);
