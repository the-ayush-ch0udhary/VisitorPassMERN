const Visitor = require('../models/Visitor');
const fs = require('fs');
const path = require('path');

// Add a new visitor profile
exports.addVisitor = async (req, res) => {
  try {
    const { name, phone, email, address, organizationId } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Name, phone, and email are required' });
    }

    // Determine the organization ID:
    // 1. From request body (public registration form)
    // 2. From logged-in user (security / host who is registering the visitor)
    let orgId = organizationId;
    if (!orgId && req.user && req.user.organizationId) {
      orgId = req.user.organizationId;
    }

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }

    // Multer uploads photo filename to req.file
    const photo = req.file ? req.file.filename : '';

    // Check if visitor already exists
    const existingVisitor = await Visitor.findOne({
      email,
      organizationId: orgId
    });

    if (existingVisitor) {
      return res.status(200).json(existingVisitor);
    }

    // Create new visitor only if not found
    const visitor = new Visitor({
      name,
      phone,
      email,
      address: address || '',
      photo,
      organizationId: orgId
    });

    await visitor.save();

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve visitors with search/filtering support
exports.getVisitors = async (req, res) => {
  try {
    const { search, organizationId } = req.query;
    let query = {};

    // Filter by organization if specified, or default to user's organization (except system admin)
    let orgId = organizationId;
    if (!orgId && req.user && req.user.organizationId) {
      orgId = req.user.organizationId;
    }

    if (orgId) {
      query.organizationId = orgId;
    }

    // Apply search query across name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const visitors = await Visitor.find(query).populate('organizationId', 'name');
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single visitor profile
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('organizationId', 'name');
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a visitor's profile details
exports.updateVisitor = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    visitor.name = name || visitor.name;
    visitor.phone = phone || visitor.phone;
    visitor.email = email || visitor.email;
    visitor.address = address || visitor.address;

    // Handle new photo upload
    if (req.file) {
      // Optional: Delete old photo from filesystem if it exists
      if (visitor.photo) {
        const oldPath = path.join(__dirname, '..', 'uploads', visitor.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      visitor.photo = req.file.filename;
    }

    await visitor.save();
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a visitor profile and its photo file
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // Delete photo from uploads folder if it exists
    if (visitor.photo) {
      const photoPath = path.join(__dirname, '..', 'uploads', visitor.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
