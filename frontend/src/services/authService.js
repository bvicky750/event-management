import { mockUsers } from '../data/users';
import { storageService } from './storageService';

export const authService = {
  getCurrentUser() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.CURRENT_USER, mockUsers.student);
  },

  login(emailOrUser, password) {
    storageService.initStorage();
    let matchedUser = null;

    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      matchedUser = emailOrUser;
    } else {
      const email = String(emailOrUser || '');
      if (email === "student@college.edu" || email.includes("student")) {
        matchedUser = mockUsers.student;
      } else if (email === "meenakshi.it@college.edu") {
        matchedUser = {
          id: "staff_002",
          name: "Prof. S. Meenakshi",
          employeeId: "EMP-IT-082",
          email: "meenakshi.it@college.edu",
          role: "staff",
          department: "Information Technology",
          designation: "Assistant Professor (Sr. Gr)",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          cabin: "IT Block - Room 201"
        };
      } else if (email === "balaji.ece@college.edu") {
        matchedUser = {
          id: "staff_003",
          name: "Dr. R. Balaji",
          employeeId: "EMP-ECE-045",
          email: "balaji.ece@college.edu",
          role: "staff",
          department: "Electronics and Communication",
          designation: "Professor & HOD",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
          cabin: "ECE Block - Room 102"
        };
      } else if (email === "staff@college.edu" || email.includes("staff") || email.includes("faculty") || email.includes("admin")) {
        matchedUser = mockUsers.staff;
      } else {
        matchedUser = {
          ...mockUsers.student,
          email: email,
          name: email.split("@")[0]
        };
      }
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
