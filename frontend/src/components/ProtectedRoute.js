import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, roles }) => {
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded Token:', decodedToken); // Add this line to log the decoded token
      userRole = decodedToken.role;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return token && roles.includes(userRole) ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
