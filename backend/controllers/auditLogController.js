const AuditLog = require('../models/AuditLog');

// Retrieving all system audit trails
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
