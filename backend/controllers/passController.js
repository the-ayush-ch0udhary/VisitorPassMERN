const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');

// Retrieving all passes with role-based restrictions
exports.getPasses = async (req, res) => {
  try {
    let query = {};

    // Visitor can only view their own passes
    if (req.user.role === 'Visitor') {
      const visitorProfile = await Visitor.findOne({
        email: req.user.email
      });

      if (!visitorProfile) {
        return res.json([]);
      }

      query.visitorId = visitorProfile._id;
    }

    // Filtering by organization for Admin/Host/Security users
    if (
      req.user.organizationId &&
      req.user.role !== 'Visitor'
    ) {
      const visitors = await Visitor.find({
        organizationId: req.user.organizationId
      }).select('_id');

      query.visitorId = {
        $in: visitors.map(visitor => visitor._id)
      };
    }

    const passes = await Pass.find(query)
      .populate('visitorId')
      .populate({
        path: 'appointmentId',
        populate: {
          path: 'hostId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(passes);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Retrieving a single pass by ID
exports.getPassById = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate('visitorId')
      .populate({
        path: 'appointmentId',
        populate: {
          path: 'hostId',
          select: 'name email'
        }
      });

    if (!pass) {
      return res.status(404).json({
        message: 'Pass not found'
      });
    }

    // Preventing access to passes from another organization
    if (
      req.user.organizationId &&
      pass.visitorId &&
      String(pass.visitorId.organizationId) !==
        String(req.user.organizationId)
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    res.json(pass);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};