import { api } from './apiClient';

export const registrationService = {
  async fetchAllRegistrations() {
    const res = await api.get('/registrations');
    return res?.data || [];
  },

  async fetchRegistrationsByEvent(eventId) {
    const res = await api.get(`/registrations/event/${eventId}`);
    return res?.data || [];
  },

  async getRegistrationById(id) {
    const res = await api.get(`/registrations/${id}`);
    return res?.data || null;
  },

  async registerForEvent(registrationData) {
    const res = await api.post('/registrations', registrationData);
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Registration failed');
  },

  async cancelRegistration(id) {
    const res = await api.post(`/registrations/${id}/cancel`);
    return res?.data || null;
  }
};

export default registrationService;
