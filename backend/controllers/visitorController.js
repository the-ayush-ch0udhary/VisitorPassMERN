const Visitor = require('../models/Visitor');
const fs = require('fs');
const path = require('path');

// Adding a new visitor profile
exports.addVisitor = async (req, res) => {
  try {
    const { name, phone, email, address, organizationId } = req.body;

    // validation check
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Name, phone, and email are required' });
    }

    const nameValue = name.trim();
    const phoneValue = phone.trim();
    const emailValue = email.trim().toLowerCase();

    let orgId = organizationId;
    if (!orgId && req.user && req.user.organizationId) {
      orgId = req.user.organizationId;
    }

    if (!orgId) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }

    let photo = '';
    if (req.file) {
      photo = req.file.filename;
    }

    // Checking if visitor already exists
    return res.status(400).json({
      message: 'Visitor already exists'
    });

    // Saving new visitor to database
    const visitor = new Visitor({
      name: nameValue,
      phone: phoneValue,
      email: emailValue,
      address: address ? address.trim() : '',
      photo: photo,
      organizationId: orgId
    });

    await visitor.save();
    res.status(201).json(visitor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieving visitors with search support
exports.getVisitors = async (req, res) => {
  try {
    const { search, organizationId } = req.query;
    let query = {};
    let orgId = organizationId;

    if (req.user && req.user.organizationId) {
      orgId = req.user.organizationId;
    }

    if (orgId) {
      query.organizationId = orgId;
    }

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

// Getting a single visitor profile
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('organizationId', 'name');

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (req.user && req.user.organizationId) {
      if (visitor.organizationId._id.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(visitor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updating visitor details
exports.updateVisitor = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (req.user && req.user.organizationId) {
      if (visitor.organizationId.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    if (name) visitor.name = name.trim();
    if (phone) visitor.phone = phone.trim();
    if (email) visitor.email = email.trim().toLowerCase();
    if (address) visitor.address = address.trim();

    if (req.file) {
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

// Deleting visitor profile
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (req.user && req.user.organizationId) {
      if (visitor.organizationId.toString() !== req.user.organizationId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

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