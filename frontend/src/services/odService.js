import { storageService } from './storageService';
import { initialODRequests } from '../data/odRequests';

export const odService = {
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
    return match ? match.status : null; // 'PENDING', 'APPROVED', 'REJECTED', or null
  },

  getODRecordForEvent(studentId, eventId) {
    const requests = this.getAllODRequests();
    return requests.find(
      r => r.studentId === studentId && (String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`)
    ) || null;
  },

  submitODRequest(formData) {
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

    // Also dispatch a mock notification for staff
    const notifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: `notif_${Date.now()}`,
      recipientRole: "staff",
      recipientId: "staff_001",
      title: "New OD Request Submitted",
      message: `${formData.studentName} (${formData.registerNumber}) applied for OD for ${formData.eventTitle}.`,
      type: "action_required",
      timestamp: formattedDate,
      read: false,
      link: `/staff/od`
    };
    storageService.setItem(storageService.KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

    return newRequest;
  },

  approveODRequest(id, staffName = "Dr. K. Ramanathan") {
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

      // Create notification for student
      const notifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
      const newNotif = {
        id: `notif_${Date.now()}`,
        recipientRole: "student",
        recipientId: requests[index].studentId,
        title: "OD Request Approved! 🎉",
        message: `Your On-Duty application for ${requests[index].eventTitle} was approved by ${staffName}. You can now register for the event.`,
        type: "success",
        timestamp: formattedDate,
        read: false,
        link: `/events/${requests[index].eventId}`
      };
      storageService.setItem(storageService.KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

      return requests[index];
    }
    return null;
  },

  rejectODRequest(id, rejectionReason, staffName = "Dr. K. Ramanathan") {
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

      // Create notification for student
      const notifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
      const newNotif = {
        id: `notif_${Date.now()}`,
        recipientRole: "student",
        recipientId: requests[index].studentId,
        title: "OD Request Rejected ⚠️",
        message: `Your OD request for ${requests[index].eventTitle} was rejected. Reason: ${requests[index].rejectionReason}`,
        type: "warning",
        timestamp: formattedDate,
        read: false,
        link: `/student/od`
      };
      storageService.setItem(storageService.KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

      return requests[index];
    }
    return null;
  }
};
