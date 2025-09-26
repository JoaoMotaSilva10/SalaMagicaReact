import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.tipoUsuario !== 'ADMINISTRADOR') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;