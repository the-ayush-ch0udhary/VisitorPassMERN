const mongoose = require('mongoose');

// Visitor schema to store profiles of registered visitors
const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: '' // Filename of uploaded picture
  },
  address: {
    type: String,
    default: ''
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
