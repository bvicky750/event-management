import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      showToast(`Welcome, ${loggedUser.name}! Logged in as ${loggedUser.role.toUpperCase()}`, 'success');
      return loggedUser;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const switchRole = async (role) => {
    const switchedUser = await authService.switchRole(role);
    setUser(switchedUser);
    showToast(`Switched active demo role to ${role.toUpperCase()}: ${switchedUser.name}`, 'info');
    return switchedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    showToast('Profile updated successfully!', 'success');
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        loading,
        login,
        switchRole,
        logout,
        updateProfile,
        isStudent: user?.role === 'student',
        isStaff: user?.role === 'staff'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
