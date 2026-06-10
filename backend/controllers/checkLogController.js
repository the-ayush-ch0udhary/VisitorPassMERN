const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const AuditLog = require('../models/AuditLog');

// Helper to log audit activities inside the backend
const logActivity = async (userId, action) => {
  try {
    const log = new AuditLog({ userId, action });
    await log.save();
  } catch (error) {
    console.error(`Audit logging failed: ${error.message}`);
  }
};

// Check-in a visitor
exports.checkIn = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({ message: 'Pass ID is required for check-in' });
    }

    // Find the pass in the database
    const pass = await Pass.findById(passId).populate('visitorId');
    if (!pass) {
      return res.status(404).json({ message: 'Invalid Pass: Pass not found' });
    }

    // Check if the pass has expired
    if (new Date() > new Date(pass.expiryDate)) {
      return res.status(400).json({ message: 'Access Denied: This pass has expired' });
    }

    // Verify if the visitor is already checked in (no checkOutTime recorded yet)
    const existingLog = await CheckLog.findOne({ passId: pass._id, checkOutTime: null });
    if (existingLog) {
      return res.status(400).json({ message: 'Conflict: Visitor is already checked in' });
    }

    // Create entry log
    const log = new CheckLog({
      visitorId: pass.visitorId._id,
      passId: pass._id,
      checkInTime: new Date()
    });

    await log.save();

    // Log this activity
    await logActivity(req.user._id, `Checked-in visitor ${pass.visitorId.name} with pass ${pass._id}`);

    res.status(201).json({ message: 'Check-in registered successfully', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check-out a visitor
exports.checkOut = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({ message: 'Pass ID is required for check-out' });
    }

    const pass = await Pass.findById(passId).populate('visitorId');
    if (!pass) {
      return res.status(404).json({ message: 'Invalid Pass: Pass not found' });
    }

    // Find the active check-in record for this pass
    const log = await CheckLog.findOne({ passId: pass._id, checkOutTime: null });
    if (!log) {
      return res.status(400).json({ message: 'Error: No active check-in record found for this pass' });
    }

    // Set checkout timestamp
    log.checkOutTime = new Date();
    await log.save();

    // Log this activity
    await logActivity(req.user._id, `Checked-out visitor ${pass.visitorId.name} with pass ${pass._id}`);

    res.json({ message: 'Check-out registered successfully', log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all check logs (filter by organization)
exports.getCheckLogs = async (req, res) => {
  try {
    let filter = {};

    // Multi-tenant filtering (only show logs for user's organization)
    if (req.user.organizationId) {
      // Find all visitors belonging to this organization
      const visitorIds = await Pass.find({}).populate({
        path: 'visitorId',
        match: { organizationId: req.user.organizationId }
      }).select('visitorId');

      const validVisitorIds = visitorIds
        .filter(p => p.visitorId)
        .map(p => p.visitorId._id);

      filter.visitorId = { $in: validVisitorIds };
    }

    const logs = await CheckLog.find(filter)
      .populate('visitorId')
      .populate({
        path: 'passId',
        populate: {
          path: 'appointmentId',
          populate: {
            path: 'hostId',
            select: 'name email'
          }
        }
      })
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
