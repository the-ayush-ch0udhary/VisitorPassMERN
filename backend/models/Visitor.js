const mongoose = require('mongoose');

// Stores visitor profile information and OTP verification details
const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    photo: {
      type: String,
      default: ''
    },

    address: {
      type: String,
      default: '',
      trim: true
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);