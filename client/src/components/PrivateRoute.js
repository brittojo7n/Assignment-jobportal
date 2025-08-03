import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem('token');
        return { isAuthenticated: false, role: null };
      }
      return { isAuthenticated: true, role: decoded.user.role };
    } catch (error) {
      localStorage.removeItem('token');
      return { isAuthenticated: false, role: null };
    }
  }
  return { isAuthenticated: false, role: null };
};

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;