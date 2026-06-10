const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');

// Retrieve all passes with role-based restrictions
exports.getPasses = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Visitor') {
      // Find the visitor profile linked to this user
      const visitorProfile = await Visitor.findOne({ email: req.user.email });
      if (visitorProfile) {
        query.visitorId = visitorProfile._id;
      } else {
        return res.json([]);
      }
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
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a single pass by ID
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
      return res.status(404).json({ message: 'Pass not found' });
    }

    res.json(pass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
