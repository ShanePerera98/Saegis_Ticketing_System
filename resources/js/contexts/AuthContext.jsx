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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      authApi.me()
        .then(response => {
          setUser(response.data.user);
          setAbilities(response.data.abilities);
          // Update the same storage type that was originally used
          const storageType = localStorage.getItem('token') ? localStorage : sessionStorage;
          storageType.setItem('user', JSON.stringify(response.data.user));
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

      // Choose storage based on remember me option
      const storage = credentials.remember ? localStorage : sessionStorage;
      
      storage.setItem('token', token);
      storage.setItem('user', JSON.stringify(userData));

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
      // Clear both storage types
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
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

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    
    // Update storage with new user data
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(newUser));
    }
  };

  const value = {
    user,
    abilities,
    loading,
    login,
    logout,
    updateUser,
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
