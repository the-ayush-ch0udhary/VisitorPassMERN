const mongoose = require('mongoose');

// Organization schema for multi-tenant support
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Automatically create createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Organization', organizationSchema);
