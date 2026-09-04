import { query } from '../config/db.js';

const formatODRequest = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    registerNumber: row.register_number,
    department: row.department,
    year: row.year,
    email: row.email,
    phone: row.phone,
    eventId: row.event_id,
    eventTitle: row.event_title,
    college: row.college,
    eventDates: row.event_dates,
    startDate: row.start_date,
    endDate: row.end_date,
    odDuration: row.od_duration,
    selectedActivities: typeof row.selected_activities === 'string' ? JSON.parse(row.selected_activities) : (row.selected_activities || []),
    reason: row.reason,
    status: row.status,
    appliedAt: row.applied_at,
    reviewedAt: row.reviewed_at,
    reviewedBy: row.reviewed_by,
    reviewedByUserId: row.reviewed_by_user_id,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const odModel = {
  async findAll() {
    const rows = await query('SELECT * FROM od_requests ORDER BY created_at DESC');
    return rows.map(formatODRequest);
  },

  async findById(id) {
    const rows = await query('SELECT * FROM od_requests WHERE id = ?', [id]);
    return formatODRequest(rows[0]);
  },

  async findByStudentId(studentId) {
    const rows = await query(
      'SELECT * FROM od_requests WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );
    return rows.map(formatODRequest);
  },

  async findByEventId(eventId) {
    const rows = await query(
      'SELECT * FROM od_requests WHERE event_id = ? ORDER BY created_at DESC',
      [eventId]
    );
    return rows.map(formatODRequest);
  },

  async findByStudentAndEvent(studentId, eventId) {
    const rows = await query(
      'SELECT * FROM od_requests WHERE student_id = ? AND event_id = ? ORDER BY created_at DESC LIMIT 1',
      [studentId, eventId]
    );
    return formatODRequest(rows[0]);
  },

  async create(data) {
    const id = data.id || `od_req_${Date.now()}`;
    const activitiesJson = JSON.stringify(data.selectedActivities || []);
    const now = new Date();
    const formattedDate = data.appliedAt || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await query(
      `INSERT INTO od_requests (
        id, student_id, student_name, register_number, department, year, email, phone,
        event_id, event_title, college, event_dates, start_date, end_date, od_duration,
        selected_activities, reason, status, applied_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.studentId,
        data.studentName,
        data.registerNumber,
        data.department || null,
        data.year || null,
        data.email || null,
        data.phone || null,
        data.eventId,
        data.eventTitle,
        data.college || null,
        data.eventDates || null,
        data.startDate || null,
        data.endDate || null,
        data.odDuration || '1 Day (Full Day)',
        activitiesJson,
        data.reason,
        data.status || 'PENDING',
        formattedDate
      ]
    );

    return this.findById(id);
  },

  async updateStatus(id, { status, reviewedBy, reviewedByUserId, rejectionReason = null }) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await query(
      `UPDATE od_requests SET
        status = ?,
        reviewed_at = ?,
        reviewed_by = ?,
        reviewed_by_user_id = ?,
        rejection_reason = ?
      WHERE id = ?`,
      [status, formattedDate, reviewedBy, reviewedByUserId || null, rejectionReason, id]
    );

    return this.findById(id);
  }
};

export default odModel;
