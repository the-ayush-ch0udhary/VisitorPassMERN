const mongoose = require('mongoose');

// Stores system activities for auditing
const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    action: {
      type: String,
      required: true,
      trim: true
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);