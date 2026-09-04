import { query } from '../config/db.js';

const formatRegistration = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    registrationNumber: row.registration_number,
    studentId: row.student_id,
    studentName: row.student_name,
    registerNumber: row.register_number,
    department: row.department,
    email: row.email,
    phone: row.phone,
    eventId: row.event_id,
    eventTitle: row.event_title,
    college: row.college,
    venue: row.venue,
    eventDates: row.event_dates,
    activities: typeof row.activities === 'string' ? JSON.parse(row.activities) : (row.activities || []),
    amountPaid: Number(row.amount_paid) || 0,
    paymentStatus: row.payment_status,
    registrationDate: row.registration_date,
    qrCodeToken: row.qr_code_token,
    status: row.status,
    attendanceStatus: row.attendance_status,
    checkInTime: row.check_in_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const registrationModel = {
  async findAll() {
    const rows = await query('SELECT * FROM registrations ORDER BY created_at DESC');
    return rows.map(formatRegistration);
  },

  async findById(id) {
    const rows = await query(
      'SELECT * FROM registrations WHERE id = ? OR registration_number = ? OR qr_code_token = ?',
      [id, id, id]
    );
    return formatRegistration(rows[0]);
  },

  async findByStudentId(studentId) {
    const rows = await query(
      'SELECT * FROM registrations WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );
    return rows.map(formatRegistration);
  },

  async findByEventId(eventId) {
    const rows = await query(
      'SELECT * FROM registrations WHERE event_id = ? ORDER BY created_at DESC',
      [eventId]
    );
    return rows.map(formatRegistration);
  },

  async findActiveByStudentAndEvent(studentId, eventId) {
    const rows = await query(
      "SELECT * FROM registrations WHERE student_id = ? AND event_id = ? AND status != 'CANCELLED'",
      [studentId, eventId]
    );
    return formatRegistration(rows[0]);
  },

  async count() {
    const rows = await query('SELECT COUNT(*) AS count FROM registrations');
    return rows[0]?.count || 0;
  },

  async create(data) {
    const id = data.id || `reg_${Date.now()}`;
    const activitiesJson = JSON.stringify(data.activities || []);

    await query(
      `INSERT INTO registrations (
        id, registration_number, student_id, event_id, student_name, register_number,
        department, email, phone, event_title, college, venue, event_dates, activities,
        amount_paid, payment_status, registration_date, qr_code_token, status,
        attendance_status, check_in_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.registrationNumber,
        data.studentId,
        data.eventId,
        data.studentName,
        data.registerNumber,
        data.department || null,
        data.email || null,
        data.phone || null,
        data.eventTitle,
        data.college || null,
        data.venue || null,
        data.eventDates || null,
        activitiesJson,
        Number(data.amountPaid) || 0.00,
        data.paymentStatus || 'PAID',
        data.registrationDate,
        data.qrCodeToken || data.registrationNumber,
        data.status || 'CONFIRMED',
        data.attendanceStatus || 'NOT_CHECKED_IN',
        data.checkInTime || null
      ]
    );

    return this.findById(id);
  },

  async updateAttendance(id, attendanceStatus, checkInTime) {
    await query(
      'UPDATE registrations SET attendance_status = ?, check_in_time = ? WHERE id = ? OR registration_number = ?',
      [attendanceStatus, checkInTime, id, id]
    );
    return this.findById(id);
  },

  async cancel(id) {
    await query("UPDATE registrations SET status = 'CANCELLED' WHERE id = ?", [id]);
    return this.findById(id);
  }
};

export default registrationModel;
