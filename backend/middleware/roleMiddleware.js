// Middleware to restrict access based on user roles (RBAC)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user object is attached and if the role is authorized
    if (req.user && roles.includes(req.user.role)) {
      next(); // User role is authorized, proceed
    } else {
      res.status(403).json({ 
        message: `Forbidden: Access restricted. Requires one of these roles: [${roles.join(', ')}]` 
      });
    }
  };
};

module.exports = { authorize };
