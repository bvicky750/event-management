import { query } from '../config/db.js';

const formatAttendance = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    eventId: row.event_id,
    registrationId: row.registration_id,
    studentId: row.student_id,
    studentName: row.student_name,
    registerNumber: row.register_number,
    department: row.department,
    checkInTime: row.check_in_time,
    date: row.date,
    status: row.status,
    verifiedBy: row.verified_by,
    verifiedByUserId: row.verified_by_user_id,
    createdAt: row.created_at
  };
};

export const attendanceModel = {
  async findAll() {
    const rows = await query('SELECT * FROM attendance ORDER BY created_at DESC');
    return rows.map(formatAttendance);
  },

  async findByEventId(eventId) {
    const rows = await query('SELECT * FROM attendance WHERE event_id = ? ORDER BY created_at DESC', [eventId]);
    return rows.map(formatAttendance);
  },

  async findByEventAndStudent(eventId, studentId) {
    const rows = await query(
      'SELECT * FROM attendance WHERE event_id = ? AND student_id = ?',
      [eventId, studentId]
    );
    return formatAttendance(rows[0]);
  },

  async create(data) {
    const id = data.id || `att_${Date.now()}`;
    const dateStr = data.date || new Date().toISOString().split('T')[0];

    await query(
      `INSERT INTO attendance (
        id, event_id, registration_id, student_id, student_name, register_number,
        department, check_in_time, date, status, verified_by, verified_by_user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.eventId,
        data.registrationId || null,
        data.studentId,
        data.studentName,
        data.registerNumber,
        data.department || null,
        data.checkInTime,
        dateStr,
        data.status || 'PRESENT',
        data.verifiedBy || 'Staff',
        data.verifiedByUserId || null
      ]
    );

    const rows = await query('SELECT * FROM attendance WHERE id = ?', [id]);
    return formatAttendance(rows[0]);
  },

  async getMetrics(eventId) {
    const rows = await query(
      `SELECT 
        (SELECT COUNT(*) FROM registrations WHERE event_id = ? AND status != 'CANCELLED') AS registeredCount,
        (SELECT COUNT(*) FROM attendance WHERE event_id = ?) AS presentCount,
        (SELECT capacity FROM events WHERE id = ?) AS capacity`,
      [eventId, eventId, eventId]
    );

    const registeredCount = Number(rows[0]?.registeredCount) || 0;
    const presentCount = Number(rows[0]?.presentCount) || 0;
    const capacity = Number(rows[0]?.capacity) || 150;
    const absentCount = Math.max(0, registeredCount - presentCount);
    const attendanceRate = registeredCount > 0 ? ((presentCount / registeredCount) * 100).toFixed(1) : '0.0';

    return {
      registeredCount,
      presentCount,
      absentCount,
      attendanceRate,
      capacity
    };
  }
};

export default attendanceModel;
