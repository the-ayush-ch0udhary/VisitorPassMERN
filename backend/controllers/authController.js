const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token after successful login/registration
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organizationId } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    // Checking whether user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: role || 'Visitor',
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
    res.status(500).json({
      message: error.message
    });
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (
      user &&
      (await user.comparePassword(password))
    ) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        token: generateToken(user._id)
      });
    }

    res.status(401).json({
      message: 'Invalid email or password'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get currently logged-in user details
exports.getMe = async (req, res) => {
  try {
    const user = await User
      .findById(req.user._id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get hosts for selected organization
exports.getHosts = async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        message: 'organizationId query parameter is required'
      });
    }

    // Preventing organization users from viewing hosts of other organizations
    if (
      req.user &&
      req.user.organizationId &&
      String(req.user.organizationId) !== String(organizationId)
    ) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    const hosts = await User.find({
      organizationId,
      role: 'Host'
    }).select('name email');

    res.json(hosts);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};