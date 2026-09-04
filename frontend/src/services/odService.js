import { api } from './apiClient';
import { storageService } from './storageService';
import { initialODRequests } from '../data/odRequests';

export const odService = {
  async fetchAllODRequests() {
    try {
      const res = await api.get('/od');
      if (res && res.data && Array.isArray(res.data)) {
        storageService.setItem(storageService.KEYS.OD_REQUESTS, res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('[ODService] Fetch OD requests API failed, using cache:', err.message);
    }
    return this.getAllODRequests();
  },

  getAllODRequests() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.OD_REQUESTS, initialODRequests);
  },

  getODRequestsByStudent(studentId) {
    const requests = this.getAllODRequests();
    return requests.filter(r => r.studentId === studentId);
  },

  getODRequestById(id) {
    const requests = this.getAllODRequests();
    return requests.find(r => String(r.id) === String(id)) || null;
  },

  getODStatusForEvent(studentId, eventId) {
    const requests = this.getAllODRequests();
    const match = requests.find(
      r => r.studentId === studentId && (String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`)
    );
    return match ? match.status : null;
  },

  getODRecordForEvent(studentId, eventId) {
    const requests = this.getAllODRequests();
    return requests.find(
      r => r.studentId === studentId && (String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`)
    ) || null;
  },

  async submitODRequest(formData) {
    try {
      const res = await api.post('/od', formData);
      if (res && res.data) {
        const requests = this.getAllODRequests();
        storageService.setItem(storageService.KEYS.OD_REQUESTS, [res.data, ...requests]);
        return res.data;
      }
    } catch (err) {
      console.warn('[ODService] Submit OD API failed, saving locally:', err.message);
    }

    // Local fallback
    const requests = this.getAllODRequests();
    const newId = `od_req_${Date.now()}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newRequest = {
      id: newId,
      status: "PENDING",
      appliedAt: formattedDate,
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      ...formData
    };

    const updated = [newRequest, ...requests];
    storageService.setItem(storageService.KEYS.OD_REQUESTS, updated);
    return newRequest;
  },

  async approveODRequest(id, staffName = "Dr. K. Ramanathan") {
    try {
      const res = await api.put(`/od/${id}/approve`, { staffName });
      if (res && res.data) {
        const requests = this.getAllODRequests();
        const index = requests.findIndex(r => String(r.id) === String(id));
        if (index !== -1) {
          requests[index] = res.data;
          storageService.setItem(storageService.KEYS.OD_REQUESTS, requests);
        }
        return res.data;
      }
    } catch (err) {
      console.warn('[ODService] Approve OD API failed, updating locally:', err.message);
    }

    const requests = this.getAllODRequests();
    const index = requests.findIndex(r => String(r.id) === String(id));
    if (index !== -1) {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      requests[index] = {
        ...requests[index],
        status: "APPROVED",
        reviewedAt: formattedDate,
        reviewedBy: staffName,
        rejectionReason: null
      };
      storageService.setItem(storageService.KEYS.OD_REQUESTS, requests);
      return requests[index];
    }
    return null;
  },

  async rejectODRequest(id, rejectionReason, staffName = "Dr. K. Ramanathan") {
    try {
      const res = await api.put(`/od/${id}/reject`, { reason: rejectionReason, staffName });
      if (res && res.data) {
        const requests = this.getAllODRequests();
        const index = requests.findIndex(r => String(r.id) === String(id));
        if (index !== -1) {
          requests[index] = res.data;
          storageService.setItem(storageService.KEYS.OD_REQUESTS, requests);
        }
        return res.data;
      }
    } catch (err) {
      console.warn('[ODService] Reject OD API failed, updating locally:', err.message);
    }

    const requests = this.getAllODRequests();
    const index = requests.findIndex(r => String(r.id) === String(id));
    if (index !== -1) {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      requests[index] = {
        ...requests[index],
        status: "REJECTED",
        reviewedAt: formattedDate,
        reviewedBy: staffName,
        rejectionReason: rejectionReason || "The request did not meet the department criteria or overlaps with internal exams."
      };
      storageService.setItem(storageService.KEYS.OD_REQUESTS, requests);
      return requests[index];
    }
    return null;
  }
};

export default odService;
