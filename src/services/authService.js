import { mockUsers } from '../data/users';
import { storageService } from './storageService';

export const authService = {
  getCurrentUser() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.CURRENT_USER, mockUsers.student);
  },

  login(email, password) {
    storageService.initStorage();
    let matchedUser = null;

    if (email === "student@college.edu" || email.includes("student")) {
      matchedUser = mockUsers.student;
    } else if (email === "staff@college.edu" || email.includes("staff") || email.includes("faculty") || email.includes("admin")) {
      matchedUser = mockUsers.staff;
    } else {
      // fallback mock user
      matchedUser = {
        ...mockUsers.student,
        email: email,
        name: email.split("@")[0]
      };
    }

    storageService.setItem(storageService.KEYS.CURRENT_USER, matchedUser);
    return matchedUser;
  },

  switchRole(role) {
    storageService.initStorage();
    const newUser = mockUsers[role] || mockUsers.student;
    storageService.setItem(storageService.KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  updateProfile(profileData) {
    const currentUser = this.getCurrentUser();
    const updatedUser = { ...currentUser, ...profileData };
    storageService.setItem(storageService.KEYS.CURRENT_USER, updatedUser);
    return updatedUser;
  },

  logout() {
    storageService.setItem(storageService.KEYS.CURRENT_USER, null);
  }
};
