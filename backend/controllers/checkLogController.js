const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const AuditLog = require('../models/AuditLog');

// Check In a visitor
exports.checkIn = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({ message: 'Pass ID required' });
    }

    const pass = await Pass.findById(passId).populate('visitorId');
    if (!pass) {
      return res.status(404).json({ message: 'Pass not found' });
    }

    // Checking if the pass has expired
    if (new Date() > pass.expiryDate) {
      return res.status(400).json({
        message: 'Pass expired'
      });
    }

    // Checking if visitor is already checked in
    const existingLog = await CheckLog.findOne({
      passId: pass._id,
      checkOutTime: null
    });

    if (existingLog) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    // Creating the new check-in record
    const log = new CheckLog({
      visitorId: pass.visitorId,
      passId: pass._id,
      checkInTime: new Date()
    });

    await log.save();

    // Creating an audit trail log
    await AuditLog.create({
      userId: req.user._id,
      action: 'Check In'
    });

    res.status(201).json(log);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check Out a visitor
exports.checkOut = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({ message: 'Pass ID required' });
    }

    const pass = await Pass.findById(passId).populate('visitorId');
    if (!pass) {
      return res.status(404).json({ message: 'Pass not found' });
    }

    // Finding active check-in log
    const log = await CheckLog.findOne({
      passId: pass._id,
      checkOutTime: null
    });

    if (!log) {
      return res.status(400).json({ message: 'No check-in found' });
    }

    // Setting check out time to current time
    log.checkOutTime = new Date();
    await log.save();

    await AuditLog.create({
      userId: req.user._id,
      action: 'Check Out'
    });

    res.json(log);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting all check logs
exports.getCheckLogs = async (req, res) => {
  try {
    let filter = {};

    // Filtering by organization if user has one
    if (req.user.organizationId) {
      const visitors = await Visitor.find({ organizationId: req.user.organizationId });

      // Getting all visitor IDs into a simple array
      let visitorIds = [];
      for (let i = 0; i < visitors.length; i++) {
        visitorIds.push(visitors[i]._id);
      }

      filter.visitorId = { $in: visitorIds };
    }

    const logs = await CheckLog.find(filter)
      .populate('visitorId')
      .populate('passId')
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};