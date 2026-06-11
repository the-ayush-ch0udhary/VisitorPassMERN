const Visitor = require('../models/Visitor');
const Pass = require('../models/Pass');
const CheckLog = require('../models/CheckLog');


exports.getStats = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    let visitorFilter = {};
    let passFilter = {};
    let logFilter = {};

    
    if (orgId) {
      visitorFilter.organizationId = orgId;

      
      const orgVisitors = await Visitor.find({ organizationId: orgId }).select('_id');
      const orgVisitorIds = orgVisitors.map(v => v._id);

      passFilter.visitorId = { $in: orgVisitorIds };
      logFilter.visitorId = { $in: orgVisitorIds };
    }

    // 1. Total Visitors
    const totalVisitors = await Visitor.countDocuments(visitorFilter);

    // 2. Total Passes
    const totalPasses = await Pass.countDocuments(passFilter);

    // 3. Active Visitors (
    const activeVisitors = await CheckLog.countDocuments({
      ...logFilter,
      checkInTime: { $ne: null },
      checkOutTime: null
    });

    // Today's boundaries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 4. Today's Check-ins
    const todayCheckIns = await CheckLog.countDocuments({
      ...logFilter,
      checkInTime: { $gte: startOfToday, $lte: endOfToday }
    });

    // 5. Today's Check-outs
    const todayCheckOuts = await CheckLog.countDocuments({
      ...logFilter,
      checkOutTime: { $gte: startOfToday, $lte: endOfToday }
    });

    res.json({
      totalVisitors,
      totalPasses,
      activeVisitors,
      todayCheckIns,
      todayCheckOuts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTrends = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    let logFilter = {};

    if (orgId) {
      const orgVisitors = await Visitor.find({ organizationId: orgId }).select('_id');
      const orgVisitorIds = orgVisitors.map(v => v._id);
      logFilter.visitorId = { $in: orgVisitorIds };
    }

    
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const label = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const count = await CheckLog.countDocuments({
        ...logFilter,
        checkInTime: { $gte: startOfDay, $lte: endOfDay }
      });

      trends.push({ label, count });
    }

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
