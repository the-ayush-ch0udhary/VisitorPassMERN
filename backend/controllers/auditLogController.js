const AuditLog = require('../models/AuditLog');

// Retrieve all system audit trails (restricted to Admins)
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
