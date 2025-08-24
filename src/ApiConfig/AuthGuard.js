// src/Auth/AuthGuard.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/Auth';

const AuthGuard = ({ children }) => {
  const { userLoggedIn } = useContext(AuthContext); // Assuming you provide this from context

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
