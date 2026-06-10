import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute checks if user is logged in and verifies if their role matches requirements
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Fetch user object from localStorage
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error('Failed to parse user session:', err);
  }

  // If user session is not found, redirect to Login page
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user doesn't have permissions, redirect to Home page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render children components
  return children;
};

export default ProtectedRoute;
