const Visitor = require('../models/Visitor');
const fs = require('fs');
const path = require('path');

// Adding a new visitor profile
exports.addVisitor = async (req, res) => {
  try {
    const { name, phone, email, address, organizationId } = req.body;

    const nameValue = name?.trim();
    const phoneValue = phone?.trim();
    const emailValue = email?.trim().toLowerCase();

    if (!nameValue || !phoneValue || !emailValue) {
      return res.status(400).json({
        message: 'Name, phone, and email are required'
      });
    }

    // Determining organization
    let orgId = organizationId;

    if (!orgId && req.user && req.user.organizationId) {
      orgId = req.user.organizationId;
    }

    if (!orgId) {
      return res.status(400).json({
        message: 'Organization ID is required'
      });
    }

    const photo = req.file ? req.file.filename : '';

    // Checking if visitor already exists in same organization
    const existingVisitor = await Visitor.findOne({
      email: emailValue,
      organizationId: orgId
    });

    if (existingVisitor) {
      return res.status(200).json(existingVisitor);
    }

    const visitor = new Visitor({
      name: nameValue,
      phone: phoneValue,
      email: emailValue,
      address: address?.trim() || '',
      photo,
      organizationId: orgId
    });

    await visitor.save();

    res.status(201).json(visitor);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Retrieving visitors with search support
exports.getVisitors = async (req, res) => {
  try {
    const { search, organizationId } = req.query;

    let query = {};
    let orgId = organizationId;

    // Organization users can only access their own organization
    if (req.user && req.user.organizationId) {
      orgId = req.user.organizationId;
    }

    if (orgId) {
      query.organizationId = orgId;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          email: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          phone: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    const visitors = await Visitor.find(query)
      .populate('organizationId', 'name');

    res.json(visitors);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Getting a single visitor profile
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate('organizationId', 'name');

    if (!visitor) {
      return res.status(404).json({
        message: 'Visitor not found'
      });
    }

    if (
      req.user &&
      req.user.organizationId &&
      String(visitor.organizationId._id || visitor.organizationId) !==
      String(req.user.organizationId)
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    res.json(visitor);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Updating visitor details
exports.updateVisitor = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: 'Visitor not found'
      });
    }

    if (
      req.user &&
      req.user.organizationId &&
      String(visitor.organizationId) !==
      String(req.user.organizationId)
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    visitor.name = name?.trim() || visitor.name;
    visitor.phone = phone?.trim() || visitor.phone;
    visitor.email = email?.trim().toLowerCase() || visitor.email;
    visitor.address = address?.trim() || visitor.address;

    // Replacing photo if new upload exists
    if (req.file) {
      if (visitor.photo) {
        const oldPath = path.join(
          __dirname,
          '..',
          'uploads',
          visitor.photo
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      visitor.photo = req.file.filename;
    }

    await visitor.save();

    res.json(visitor);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Deleting visitor profile
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: 'Visitor not found'
      });
    }

    if (
      req.user &&
      req.user.organizationId &&
      String(visitor.organizationId) !==
      String(req.user.organizationId)
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    // Removing photo from uploads folder
    if (visitor.photo) {
      const photoPath = path.join(
        __dirname,
        '..',
        'uploads',
        visitor.photo
      );

      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Visitor.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Visitor deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};