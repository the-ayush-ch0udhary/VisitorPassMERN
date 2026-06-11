const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifying JWT token and protect private routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Checking for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token provided'
      });
    }

    // Verifying token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attaching user details to request object
    const user = await User.findById(decoded.id)
      .select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized, user not found'
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error(
      `JWT verification error: ${error.message}`
    );

    return res.status(401).json({
      message: 'Not authorized, token verification failed'
    });
  }
};

module.exports = { protect };