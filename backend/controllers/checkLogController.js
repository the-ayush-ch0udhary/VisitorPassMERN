const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const AuditLog = require('../models/AuditLog');

exports.checkIn = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({
        message: 'Pass ID required'
      });
    }

    const pass = await Pass.findById(passId).populate('visitorId');

    if (!pass) {
      return res.status(404).json({
        message: 'Pass not found'
      });
    }

    if (new Date() > new Date(pass.expiryDate)) {
      return res.status(400).json({
        message: 'Pass expired'
      });
    }

    const existingLog = await CheckLog.findOne({
      passId: pass._id,
      checkOutTime: null
    });

    if (existingLog) {
      return res.status(400).json({
        message: 'Already checked in'
      });
    }

    const log = new CheckLog({
      visitorId: pass.visitorId._id,
      passId: pass._id,
      checkInTime: new Date()
    });

    await log.save();

    await AuditLog.create({
      userId: req.user._id,
      action: 'Check In'
    });

    res.status(201).json(log);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({
        message: 'Pass ID required'
      });
    }

    const pass = await Pass.findById(passId).populate('visitorId');

    if (!pass) {
      return res.status(404).json({
        message: 'Pass not found'
      });
    }

    const log = await CheckLog.findOne({
      passId: pass._id,
      checkOutTime: null
    });

    if (!log) {
      return res.status(400).json({
        message: 'No check-in found'
      });
    }

    log.checkOutTime = new Date();

    await log.save();

    await AuditLog.create({
      userId: req.user._id,
      action: 'Check Out'
    });

    res.json(log);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getCheckLogs = async (req, res) => {
  try {
    let filter = {};

    if (req.user.organizationId) {
      const visitors = await Visitor.find({
        organizationId: req.user.organizationId
      });

      const visitorIds = visitors.map(visitor => visitor._id);

      filter.visitorId = {
        $in: visitorIds
      };
    }

    const logs = await CheckLog.find(filter)
      .populate('visitorId')
      .populate('passId')
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};