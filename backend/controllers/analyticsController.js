const Visitor = require('../models/Visitor');
const Pass = require('../models/Pass');
const CheckLog = require('../models/CheckLog');

exports.getStats = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    let visitorQuery = {};
    let passQuery = {};
    let logQuery = {};

    if (orgId) {
      visitorQuery.organizationId = orgId;

      const visitors = await Visitor.find({
        organizationId: orgId
      });

      const visitorIds = visitors.map(visitor => visitor._id);

      passQuery.visitorId = {
        $in: visitorIds
      };

      logQuery.visitorId = {
        $in: visitorIds
      };
    }

    const totalVisitors = await Visitor.countDocuments(visitorQuery);

    const totalPasses = await Pass.countDocuments(passQuery);

    const activeVisitors = await CheckLog.countDocuments({
      ...logQuery,
      checkInTime: { $ne: null },
      checkOutTime: null
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayCheckIns = await CheckLog.countDocuments({
      ...logQuery,
      checkInTime: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    const todayCheckOuts = await CheckLog.countDocuments({
      ...logQuery,
      checkOutTime: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    res.json({
      totalVisitors,
      totalPasses,
      activeVisitors,
      todayCheckIns,
      todayCheckOuts
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    let logQuery = {};

    if (orgId) {
      const visitors = await Visitor.find({
        organizationId: orgId
      });

      const visitorIds = visitors.map(visitor => visitor._id);

      logQuery.visitorId = {
        $in: visitorIds
      };
    }

    const trends = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await CheckLog.countDocuments({
        ...logQuery,
        checkInTime: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });

      trends.push({
        label: day.toLocaleDateString(),
        count
      });
    }

    res.json(trends);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};