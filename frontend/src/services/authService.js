import { api } from './apiClient';
import { storageService } from './storageService';

export const authService = {
  getCurrentUser() {
    storageService.initStorage();
    const token = storageService.getItem('tp_token', null);
    if (!token) return null;
    return storageService.getItem(storageService.KEYS.CURRENT_USER, null);
  },

  async login(email, password = 'staff123') {
    storageService.initStorage();
    const cleanEmail = String(email).trim().toLowerCase();

    const res = await api.post('/auth/login', { email: cleanEmail, password });
    if (res && res.data && res.data.user) {
      api.setToken(res.data.token);
      storageService.setItem('tp_token', res.data.token);
      storageService.setItem(storageService.KEYS.CURRENT_USER, res.data.user);
      return res.data.user;
    }
    throw new Error(res?.message || 'Login failed');
  },

  async fetchCurrentUser() {
    try {
      const res = await api.get('/auth/me');
      if (res && res.data) {
        storageService.setItem(storageService.KEYS.CURRENT_USER, res.data);
        return res.data;
      }
    } catch (e) {
      this.logout();
    }
    return null;
  },

  logout() {
    api.setToken(null);
    storageService.removeItem('tp_token');
    storageService.removeItem(storageService.KEYS.CURRENT_USER);
    try {
      localStorage.removeItem('tp_token');
      localStorage.removeItem('ceh_auth_token');
      localStorage.removeItem(storageService.KEYS.CURRENT_USER);
    } catch (e) {
      console.error('Logout cleanup error:', e);
    }
  }
};

export default authService;
