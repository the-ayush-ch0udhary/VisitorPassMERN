// Middleware to restrict access based on user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensuring authenticated user exists
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    // Checking whether user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Requires one of these roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { authorize };