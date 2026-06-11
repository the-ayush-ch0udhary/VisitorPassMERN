import React from "react";
import { Navigate } from "react-router-dom";

// Protect routes based on login status and role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem("user");

  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
  }

  // User not logged in
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // User logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized user
  return children;
};

export default ProtectedRoute;
