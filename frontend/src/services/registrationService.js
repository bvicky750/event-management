import { api } from './apiClient';
import { storageService } from './storageService';
import { initialRegistrations, initialPastParticipation } from '../data/registrations';

export const registrationService = {
  async fetchAllRegistrations() {
    try {
      const res = await api.get('/registrations');
      if (res && res.data && Array.isArray(res.data)) {
        storageService.setItem(storageService.KEYS.REGISTRATIONS, res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('[RegistrationService] Fetch registrations API failed, using cache:', err.message);
    }
    return this.getAllRegistrations();
  },

  getAllRegistrations() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.REGISTRATIONS, initialRegistrations);
  },

  getRegistrationsByStudent(studentId) {
    const list = this.getAllRegistrations();
    return list.filter(r => r.studentId === studentId);
  },

  getRegistrationsByEvent(eventId) {
    const list = this.getAllRegistrations();
    return list.filter(r => String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`);
  },

  getRegistrationById(id) {
    const list = this.getAllRegistrations();
    return list.find(r => String(r.id) === String(id) || r.registrationNumber === id) || null;
  },

  isStudentRegistered(studentId, eventId) {
    const list = this.getAllRegistrations();
    return list.some(
      r => r.studentId === studentId && (String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`) && r.status !== 'CANCELLED'
    );
  },

  async registerForEvent(registrationData) {
    try {
      const res = await api.post('/registrations', registrationData);
      if (res && res.data) {
        const list = this.getAllRegistrations();
        const updated = [res.data, ...list];
        storageService.setItem(storageService.KEYS.REGISTRATIONS, updated);
        return res.data;
      }
    } catch (err) {
      console.warn('[RegistrationService] Register API failed, using local registration:', err.message);
    }

    // Local fallback
    const list = this.getAllRegistrations();
    const count = list.length + 1;
    const regNum = `REG-DEMO-2026-${String(count).padStart(3, '0')}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newReg = {
      id: `reg_${Date.now()}`,
      registrationNumber: regNum,
      registrationDate: formattedDate,
      qrCodeToken: regNum,
      status: "CONFIRMED",
      attendanceStatus: "NOT_CHECKED_IN",
      checkInTime: null,
      ...registrationData
    };

    const updated = [newReg, ...list];
    storageService.setItem(storageService.KEYS.REGISTRATIONS, updated);

    // Update event registered count
    const events = storageService.getItem(storageService.KEYS.EVENTS, []);
    const evIndex = events.findIndex(e => String(e.id) === String(registrationData.eventId));
    if (evIndex !== -1) {
      events[evIndex].registeredCount = (events[evIndex].registeredCount || 0) + 1;
      storageService.setItem(storageService.KEYS.EVENTS, events);
    }

    return newReg;
  },

  async cancelRegistration(id) {
    try {
      await api.post(`/registrations/${id}/cancel`);
    } catch (e) {
      console.warn('[RegistrationService] Cancel API failed, updating locally');
    }

    const list = this.getAllRegistrations();
    const index = list.findIndex(r => String(r.id) === String(id));
    if (index !== -1) {
      list[index].status = "CANCELLED";
      storageService.setItem(storageService.KEYS.REGISTRATIONS, list);
      return list[index];
    }
    return null;
  },

  async getPastParticipation(studentId) {
    try {
      const res = await api.get(`/registrations/past/${studentId}`);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      // Local fallback
    }

    storageService.initStorage();
    const past = storageService.getItem(storageService.KEYS.PAST_PARTICIPATION, initialPastParticipation);
    return past.filter(p => p.studentId === studentId);
  }
};

export default registrationService;
