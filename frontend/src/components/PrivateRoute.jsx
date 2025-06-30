import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // While checking auth status, show a loading spinner
    return <div className="loading-spinner"></div>;
  }

  if (!user) {
    // When loading is finished and there's no user, redirect to login
    return <Navigate to="/login" />;
  }

  // When loading is finished and there is a user, show the protected content
  return children;
};

export default PrivateRoute; 