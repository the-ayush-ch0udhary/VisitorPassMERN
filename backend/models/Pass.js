const mongoose = require('mongoose');

// Pass schema for digital badge QR and PDF generated passes
const passSchema = new mongoose.Schema({
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
    type: String, // Base64 data URL for the generated QR Code
    required: true
  },
  pdfPath: {
    type: String, // Filename or path to the generated PDF badge
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pass', passSchema);
