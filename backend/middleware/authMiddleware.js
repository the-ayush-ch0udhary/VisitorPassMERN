const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify JWT tokens
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in database and attach user info to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Pass control to next middleware/handler
    } catch (error) {
      console.error(`JWT verification error: ${error.message}`);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  // If no token is present, return unauthorized
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
