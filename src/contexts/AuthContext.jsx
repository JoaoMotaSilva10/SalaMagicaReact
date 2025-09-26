import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired, getTokenInfo } from '../utils/jwtUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');
    
    if (storedToken && storedUser) {
      // Verifica se o token não expirou
      if (!isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token expirado, remove do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    if (!token || !user) return false;
    return !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};