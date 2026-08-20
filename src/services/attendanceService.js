import { storageService } from './storageService';
import { initialAttendanceRecords } from '../data/attendance';
import { registrationService } from './registrationService';

export const attendanceService = {
  getAllAttendance() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.ATTENDANCE, initialAttendanceRecords);
  },

  getAttendanceByEvent(eventId) {
    const list = this.getAllAttendance();
    return list.filter(a => String(a.eventId) === String(eventId) || String(a.eventId) === `evt_${eventId}`);
  },

  recordScan(eventId, qrToken, staffName = "Dr. K. Ramanathan") {
    const registrations = registrationService.getAllRegistrations();
    // find matching registration
    const reg = registrations.find(
      r => (r.qrCodeToken === qrToken || r.registrationNumber === qrToken || r.id === qrToken) &&
           (String(r.eventId) === String(eventId) || String(r.eventId) === `evt_${eventId}`)
    );

    if (!reg) {
      // Check if registration exists for another event
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

    // Check if already checked in
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

    // Success check-in!
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

    // Update registration check-in status
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

  getEventAttendanceMetrics(eventId, totalCapacity = 150) {
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
