import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      authApi.me()
        .then(response => {
          setUser(response.data.user);
          setAbilities(response.data.abilities);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        })
        .catch(() => {
          // Token is invalid
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token, user: userData, abilities: userAbilities } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setAbilities(userAbilities);

      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setAbilities([]);
    }
  };

  const hasAbility = (ability) => {
    return abilities.includes(ability);
  };

  const isRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  };

  const isSuperAdmin = () => {
    return user?.role === 'SUPER_ADMIN';
  };

  const isClient = () => {
    return user?.role === 'CLIENT';
  };

  const value = {
    user,
    abilities,
    loading,
    login,
    logout,
    hasAbility,
    isRole,
    isAdmin,
    isSuperAdmin,
    isClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
