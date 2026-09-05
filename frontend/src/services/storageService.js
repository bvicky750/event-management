import { mockUsers } from '../data/users';
import { initialODRequests } from '../data/odRequests';
import { initialRegistrations, initialPastParticipation } from '../data/registrations';
import { initialAttendanceRecords } from '../data/attendance';
import { initialNotifications } from '../data/notifications';

const STORAGE_KEYS = {
  CURRENT_USER: 'ceh_current_user',
  EVENTS: 'ceh_events',
  OD_REQUESTS: 'ceh_od_requests',
  REGISTRATIONS: 'ceh_registrations',
  PAST_PARTICIPATION: 'ceh_past_participation',
  ATTENDANCE: 'ceh_attendance',
  NOTIFICATIONS: 'ceh_notifications',
  CUSTOM_USERS: 'ceh_custom_users'
};

export const storageService = {
  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUsers.student));
    }
    
    // We do NOT inject mock events. Events are strictly loaded from the MySQL API.
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.OD_REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.OD_REQUESTS, JSON.stringify(initialODRequests));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(initialRegistrations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAST_PARTICIPATION)) {
      localStorage.setItem(STORAGE_KEYS.PAST_PARTICIPATION, JSON.stringify(initialPastParticipation));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendanceRecords));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    }
  },

  getItem(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  },

  resetAllToDefault() {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUsers.student));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OD_REQUESTS, JSON.stringify(initialODRequests));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(initialRegistrations));
    localStorage.setItem(STORAGE_KEYS.PAST_PARTICIPATION, JSON.stringify(initialPastParticipation));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendanceRecords));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    window.location.reload();
  },

  KEYS: STORAGE_KEYS
};

export default storageService;
