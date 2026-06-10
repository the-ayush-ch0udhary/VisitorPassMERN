const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Simple token generator utility using JWT secret from .env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token remains valid for 30 days
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organizationId } = req.body;

    // Check if user already exists in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create and save new user (password is automatically hashed pre-save)
    const user = new User({
      name,
      email,
      password,
      role: role || 'Visitor', // Default to Visitor if not specified
      organizationId: organizationId || null
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log in an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Verify user exists and verify password hash matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile details
exports.getMe = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all hosts belonging to a specific organization (useful for dropdown lists)
exports.getHosts = async (req, res) => {
  try {
    const { organizationId } = req.query;
    if (!organizationId) {
      return res.status(400).json({ message: 'organizationId query parameter is required' });
    }
    const hosts = await User.find({ organizationId, role: 'Host' }).select('name email');
    res.json(hosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
