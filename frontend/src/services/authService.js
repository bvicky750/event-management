import { api } from './apiClient';
import { mockUsers } from '../data/users';
import { storageService } from './storageService';

export const authService = {
  getCurrentUser() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.CURRENT_USER, mockUsers.student);
  },

  async login(emailOrUser, password = 'student123') {
    storageService.initStorage();
    let email = '';

    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      email = emailOrUser.email || 'student@college.edu';
    } else {
      email = String(emailOrUser || 'student@college.edu');
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.data && res.data.user) {
        api.setToken(res.data.token);
        storageService.setItem(storageService.KEYS.CURRENT_USER, res.data.user);
        return res.data.user;
      }
    } catch (apiError) {
      console.warn('[AuthService] API login failed, falling back to local demo profile:', apiError.message);
    }

    // Local fallback for offline/preview
    let matchedUser = null;
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      matchedUser = emailOrUser;
    } else if (email === "student@college.edu" || email.includes("student")) {
      matchedUser = mockUsers.student;
    } else if (email === "staff@college.edu" || email.includes("staff") || email.includes("faculty") || email.includes("admin")) {
      matchedUser = mockUsers.staff;
    } else {
      matchedUser = {
        ...mockUsers.student,
        email: email,
        name: email.split("@")[0]
      };
    }

    storageService.setItem(storageService.KEYS.CURRENT_USER, matchedUser);
    return matchedUser;
  },

  async switchRole(role) {
    storageService.initStorage();
    try {
      const res = await api.post('/auth/switch-demo', { role });
      if (res && res.data && res.data.user) {
        api.setToken(res.data.token);
        storageService.setItem(storageService.KEYS.CURRENT_USER, res.data.user);
        return res.data.user;
      }
    } catch (e) {
      console.warn('[AuthService] Demo switch API failed, using local demo user');
    }

    const newUser = mockUsers[role] || mockUsers.student;
    storageService.setItem(storageService.KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  async updateProfile(profileData) {
    try {
      const res = await api.put('/users/profile', profileData);
      if (res && res.data) {
        storageService.setItem(storageService.KEYS.CURRENT_USER, res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('[AuthService] API profile update failed, updating local storage');
    }

    const currentUser = this.getCurrentUser();
    const updatedUser = { ...currentUser, ...profileData };
    storageService.setItem(storageService.KEYS.CURRENT_USER, updatedUser);
    return updatedUser;
  },

  logout() {
    api.setToken(null);
    storageService.setItem(storageService.KEYS.CURRENT_USER, null);
  }
};

export default authService;
