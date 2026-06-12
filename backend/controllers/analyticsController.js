const Visitor = require('../models/Visitor');
const Pass = require('../models/Pass');
const CheckLog = require('../models/CheckLog');
const Appointment = require('../models/Appointment');

// Total numbers for the dashboard stats
exports.getStats = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    let visitorQuery = {};
    let passQuery = {};
    let logQuery = {};

    
    if (orgId) {
      visitorQuery.organizationId = orgId;

      const visitors = await Visitor.find({ organizationId: orgId });
      
      
      let visitorIds = [];
      for (let i = 0; i < visitors.length; i++) {
        visitorIds.push(visitors[i]._id);
      }

      passQuery.visitorId = { $in: visitorIds };
      logQuery.visitorId = { $in: visitorIds };
    }

    
    const totalVisitors = await Visitor.countDocuments(visitorQuery);
    const totalPasses = await Pass.countDocuments(passQuery);

    // active visitors right now
    let activeQuery = { checkInTime: { $ne: null }, checkOutTime: null };
    if (orgId) {
      activeQuery.visitorId = logQuery.visitorId;
    }
    const activeVisitors = await CheckLog.countDocuments(activeQuery);

    // Setup dates
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Counts check-ins today
    let checkInQuery = { checkInTime: { $gte: startOfToday, $lte: endOfToday } };
    if (orgId) {
      checkInQuery.visitorId = logQuery.visitorId;
    }
    const todayCheckIns = await CheckLog.countDocuments(checkInQuery);

    // Counts check-outs today
    let checkOutQuery = { checkOutTime: { $gte: startOfToday, $lte: endOfToday } };
    if (orgId) {
      checkOutQuery.visitorId = logQuery.visitorId;
    }
    const todayCheckOuts = await CheckLog.countDocuments(checkOutQuery);

    // Counts appointment types
    const approvedAppointments = await Appointment.countDocuments({ status: 'Approved' });
    const rejectedAppointments = await Appointment.countDocuments({ status: 'Rejected' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

    res.json({
      totalVisitors,
      totalPasses,
      activeVisitors,
      todayCheckIns,
      todayCheckOuts,
      approvedAppointments,
      rejectedAppointments,
      pendingAppointments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//visitor entry charts for past 7 days
exports.getTrends = async (req, res) => {
  try {
    const orgId = req.user.organizationId;
    let logQuery = {};

    if (orgId) {
      const visitors = await Visitor.find({ organizationId: orgId });
      
      let visitorIds = [];
      for (let i = 0; i < visitors.length; i++) {
        visitorIds.push(visitors[i]._id);
      }

      logQuery.visitorId = { $in: visitorIds };
    }

    const trends = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      
      let dailyQuery = { checkInTime: { $gte: startOfDay, $lte: endOfDay } };
      if (orgId) {
        dailyQuery.visitorId = logQuery.visitorId;
      }

      const count = await CheckLog.countDocuments(dailyQuery);

      trends.push({
        label: day.toLocaleDateString(),
        count: count
      });
    }

    res.json(trends);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};