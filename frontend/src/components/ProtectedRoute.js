import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user doesn't have required role, show unauthorized page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Unauthorized />;
  }

  // If authenticated and authorized, render the children
  return children;
};

export default ProtectedRoute;