import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children, redirect }) => {
  const authenticate = localStorage.getItem('session_key') ? true : false;
  const location = useLocation();
  return authenticate ? (
    children
  ) : (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(redirect || location.pathname)}`}
    />
  );
};

export default ProtectedRoute;
