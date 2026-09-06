import { mockUsers } from '../data/users';

const STORAGE_KEYS = {
  CURRENT_USER: 'ceh_current_user',
  CUSTOM_USERS: 'ceh_custom_users'
};

export const storageService = {
  initStorage() {
    // Purge obsolete event local storage cache to reclaim quota
    try {
      localStorage.removeItem('ceh_events');
      localStorage.removeItem('eh_events');
      localStorage.removeItem('ceh_od_requests');
      localStorage.removeItem('ceh_registrations');
      localStorage.removeItem('ceh_past_participation');
      localStorage.removeItem('ceh_attendance');
      localStorage.removeItem('ceh_notifications');
    } catch (e) {
      // ignore
    }

    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUsers.student));
    }
  },

  getItem(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`[Storage] Error reading ${key} from localStorage:`, e.message);
      return defaultValue;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Error writing ${key} to localStorage:`, e.message);
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Storage] Error removing ${key} from localStorage:`, e.message);
    }
  },

  resetAllToDefault() {
    try {
      localStorage.removeItem('ceh_events');
      localStorage.removeItem('eh_events');
      localStorage.removeItem('tp_token');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUsers.student));
    } catch (e) {
      // ignore
    }
    window.location.reload();
  },

  KEYS: STORAGE_KEYS
};

export default storageService;
