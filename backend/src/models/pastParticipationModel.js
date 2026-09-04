import { query } from '../config/db.js';

const formatPast = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    studentId: row.student_id,
    eventTitle: row.event_title,
    organizerCollege: row.organizer_college,
    date: row.date,
    category: row.category,
    odStatus: row.od_status,
    registrationStatus: row.registration_status,
    attendanceStatus: row.attendance_status,
    certificateUrl: row.certificate_url,
    achievement: row.achievement,
    createdAt: row.created_at
  };
};

export const pastParticipationModel = {
  async findByStudentId(studentId) {
    const rows = await query(
      'SELECT * FROM past_participation WHERE student_id = ? ORDER BY created_at DESC',
      [studentId]
    );
    return rows.map(formatPast);
  },

  async create(data) {
    const id = data.id || `part_${Date.now()}`;
    await query(
      `INSERT INTO past_participation (
        id, student_id, event_title, organizer_college, date, category,
        od_status, registration_status, attendance_status, certificate_url, achievement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.studentId,
        data.eventTitle,
        data.organizerCollege || null,
        data.date || null,
        data.category || null,
        data.odStatus || 'Approved',
        data.registrationStatus || 'Registered',
        data.attendanceStatus || 'Attended',
        data.certificateUrl || '#',
        data.achievement || 'Participant'
      ]
    );

    const rows = await query('SELECT * FROM past_participation WHERE id = ?', [id]);
    return formatPast(rows[0]);
  }
};

export default pastParticipationModel;
