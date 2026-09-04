import { api } from './apiClient';
import { storageService } from './storageService';
import { initialAttendanceRecords } from '../data/attendance';
import { registrationService } from './registrationService';

export const attendanceService = {
  async fetchAllAttendance() {
    try {
      const res = await api.get('/attendance');
      if (res && res.data && Array.isArray(res.data)) {
        storageService.setItem(storageService.KEYS.ATTENDANCE, res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('[AttendanceService] Fetch attendance API failed, using cache:', err.message);
    }
    return this.getAllAttendance();
  },

  getAllAttendance() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.ATTENDANCE, initialAttendanceRecords);
  },

  getAttendanceByEvent(eventId) {
    const list = this.getAllAttendance();
    return list.filter(a => String(a.eventId) === String(eventId) || String(a.eventId) === `evt_${eventId}`);
  },

  async recordScan(eventId, qrToken, staffName = "Dr. K. Ramanathan") {
    try {
      const res = await api.post('/attendance/scan', {
        eventId,
        qrToken,
        staffName
      });

      if (res && res.success) {
        // Update local cache
        const attendance = this.getAllAttendance();
        if (res.record) {
          storageService.setItem(storageService.KEYS.ATTENDANCE, [res.record, ...attendance]);
        }
        return res;
      }
    } catch (err) {
      if (err.data && err.data.errorType) {
        return {
          success: false,
          errorType: err.data.errorType,
          message: err.data.message || err.message,
          student: err.data.student,
          checkInTime: err.data.checkInTime
        };
      }
      console.warn('[AttendanceService] Scan API failed, falling back to local scan check:', err.message);
    }

    // Local fallback check
    const registrations = registrationService.getAllRegistrations();
    const reg = registrations.find(
      r => (r.qrCodeToken === qrToken || r.registrationNumber === qrToken || r.id === qrToken) &&
           (String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`)
    );

    if (!reg) {
      const wrongEventReg = registrations.find(r => r.qrCodeToken === qrToken || r.registrationNumber === qrToken);
      if (wrongEventReg) {
        return {
          success: false,
          errorType: "WRONG_EVENT",
          message: `Ticket is for another event: "${wrongEventReg.eventTitle}". Not valid for this event.`
        };
      }
      return {
        success: false,
        errorType: "INVALID_QR",
        message: "Invalid QR code or student is not registered for this event."
      };
    }

    const attendance = this.getAllAttendance();
    const alreadyPresent = attendance.find(
      a => (String(a.eventId) === String(eventId) || String(a.eventId) === `evt_${eventId}`) &&
           (a.studentId === reg.studentId || a.registerNumber === reg.registerNumber)
    );

    if (alreadyPresent) {
      return {
        success: false,
        errorType: "ALREADY_CHECKED_IN",
        message: `${reg.studentName} (${reg.registerNumber}) is ALREADY checked in at ${alreadyPresent.checkInTime}.`,
        student: reg,
        checkInTime: alreadyPresent.checkInTime
      };
    }

    const now = new Date();
    const checkInTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newRecord = {
      id: `att_${Date.now()}`,
      eventId: String(eventId),
      studentId: reg.studentId,
      studentName: reg.studentName,
      registerNumber: reg.registerNumber,
      department: reg.department,
      checkInTime: checkInTimeStr,
      date: dateStr,
      status: "PRESENT",
      verifiedBy: staffName
    };

    const updatedAttendance = [newRecord, ...attendance];
    storageService.setItem(storageService.KEYS.ATTENDANCE, updatedAttendance);

    const regIndex = registrations.findIndex(r => r.id === reg.id);
    if (regIndex !== -1) {
      registrations[regIndex].attendanceStatus = "PRESENT";
      registrations[regIndex].checkInTime = checkInTimeStr;
      storageService.setItem(storageService.KEYS.REGISTRATIONS, registrations);
    }

    return {
      success: true,
      student: reg,
      checkInTime: checkInTimeStr,
      record: newRecord
    };
  },

  async getEventAttendanceMetrics(eventId, totalCapacity = 150) {
    try {
      const res = await api.get(`/attendance/metrics/${eventId}`);
      if (res && res.data) {
        return res.data;
      }
    } catch (e) {
      // Local calculation
    }

    const registrations = registrationService.getRegistrationsByEvent(eventId);
    const presentRecords = this.getAttendanceByEvent(eventId);

    const registeredCount = registrations.length;
    const presentCount = presentRecords.length;
    const absentCount = Math.max(0, registeredCount - presentCount);
    const attendanceRate = registeredCount > 0 ? ((presentCount / registeredCount) * 100).toFixed(1) : "0.0";

    return {
      registeredCount,
      presentCount,
      absentCount,
      attendanceRate,
      capacity: totalCapacity
    };
  },

  exportAttendanceCSV(eventId, eventTitle = "Event") {
    const attendance = this.getAttendanceByEvent(eventId);
    const headers = ["Student Name", "Register Number", "Department", "Check-in Time", "Date", "Status", "Verified By"];
    const rows = attendance.map(a => [
      `"${a.studentName}"`,
      `"${a.registerNumber}"`,
      `"${a.department}"`,
      `"${a.checkInTime}"`,
      `"${a.date}"`,
      `"${a.status}"`,
      `"${a.verifiedBy || 'Staff'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Attendance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default attendanceService;
