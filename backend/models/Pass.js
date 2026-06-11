const mongoose = require('mongoose');

// Stores generated visitor passes with QR code and PDF details
const passSchema = new mongoose.Schema(
  {
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: true
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },

    qrCode: {
      type: String,
      required: true
    },

    pdfPath: {
      type: String,
      required: true,
      trim: true
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    expiryDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pass', passSchema);