import attendanceModel from '../models/attendanceModel.js';
import registrationModel from '../models/registrationModel.js';
import eventModel from '../models/eventModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllAttendance = async (req, res, next) => {
  try {
    const list = await attendanceModel.findAll();
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const list = await attendanceModel.findByEventId(eventId);
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getEventMetrics = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const metrics = await attendanceModel.getMetrics(eventId);
    return successResponse(res, metrics);
  } catch (error) {
    next(error);
  }
};

export const recordScan = async (req, res, next) => {
  try {
    const { eventId, qrToken, staffName } = req.body;
    const verifierName = staffName || req.user?.name || 'Dr. K. Ramanathan';
    const verifierUserId = req.user?.id || null;

    if (!eventId || !qrToken) {
      return errorResponse(res, 'Event ID and QR token are required for attendance scan.', 400);
    }

    // 1. Find registration by QR token / registration number / id
    const reg = await registrationModel.findById(qrToken);

    if (!reg) {
      return res.status(400).json({
        success: false,
        errorType: 'INVALID_QR',
        message: 'Invalid QR code or student is not registered.'
      });
    }

    // 2. Verify event matches
    if (String(reg.eventId) !== String(eventId)) {
      return res.status(400).json({
        success: false,
        errorType: 'WRONG_EVENT',
        message: `Ticket is for another event: "${reg.eventTitle}". Not valid for this event.`
      });
    }

    // 3. Check if student already checked in
    const existingAttendance = await attendanceModel.findByEventAndStudent(eventId, reg.studentId);
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        errorType: 'ALREADY_CHECKED_IN',
        message: `${reg.studentName} (${reg.registerNumber}) is ALREADY checked in at ${existingAttendance.checkInTime}.`,
        student: reg,
        checkInTime: existingAttendance.checkInTime
      });
    }

    // 4. Record attendance
    const now = new Date();
    const checkInTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newRecord = await attendanceModel.create({
      eventId: String(eventId),
      registrationId: reg.id,
      studentId: reg.studentId,
      studentName: reg.studentName,
      registerNumber: reg.registerNumber,
      department: reg.department,
      checkInTime: checkInTimeStr,
      date: dateStr,
      status: 'PRESENT',
      verifiedBy: verifierName,
      verifiedByUserId: verifierUserId
    });

    // 5. Update registration record attendance status
    await registrationModel.updateAttendance(reg.id, 'PRESENT', checkInTimeStr);

    return res.status(200).json({
      success: true,
      student: reg,
      checkInTime: checkInTimeStr,
      record: newRecord,
      message: `Check-in verified for ${reg.studentName}`
    });
  } catch (error) {
    next(error);
  }
};

export const exportAttendanceCSV = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await eventModel.findById(eventId);
    const attendance = await attendanceModel.findByEventId(eventId);

    const headers = ['Student Name', 'Register Number', 'Department', 'Check-in Time', 'Date', 'Status', 'Verified By'];
    const rows = attendance.map(a => [
      `"${a.studentName}"`,
      `"${a.registerNumber}"`,
      `"${a.department || ''}"`,
      `"${a.checkInTime}"`,
      `"${a.date}"`,
      `"${a.status}"`,
      `"${a.verifiedBy || 'Staff'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const filename = `${(event?.title || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}_Attendance_Report.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8;');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAttendance,
  getAttendanceByEvent,
  getEventMetrics,
  recordScan,
  exportAttendanceCSV
};
