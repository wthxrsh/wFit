import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Return a loading indicator or null while checking auth status
    return <div className="loading-spinner"></div>; 
  }

  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  // User is logged in, render the requested component
  return children;
};

export default PrivateRoute; 