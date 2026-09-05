import { query } from '../config/db.js';

const formatRegistration = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    registrationNumber: row.registration_number,
    eventId: row.event_id,
    studentName: row.student_name,
    registerNumber: row.register_number,
    department: row.department,
    year: row.year,
    college: row.college,
    email: row.email,
    phone: row.phone,
    eventTitle: row.event_title,
    venue: row.venue,
    eventDates: row.event_dates,
    amountPaid: Number(row.amount_paid) || 0,
    paymentStatus: row.payment_status,
    registrationDate: row.registration_date,
    status: row.status,
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
      'SELECT * FROM registrations WHERE id = ? OR registration_number = ?',
      [id, id]
    );
    return formatRegistration(rows[0]);
  },

  async findByEventId(eventId) {
    const rows = await query(
      'SELECT * FROM registrations WHERE event_id = ? ORDER BY created_at DESC',
      [eventId]
    );
    return rows.map(formatRegistration);
  },

  async findExisting(eventId, registerNumber, email) {
    const rows = await query(
      `SELECT * FROM registrations 
       WHERE event_id = ? 
         AND (register_number = ? OR email = ?) 
         AND status != 'CANCELLED' 
       LIMIT 1`,
      [eventId, registerNumber, email]
    );
    return formatRegistration(rows[0]);
  },

  async count() {
    const rows = await query('SELECT COUNT(*) AS count FROM registrations');
    return rows[0]?.count || 0;
  },

  async create(data) {
    const id = data.id || `reg_${Date.now()}`;

    await query(
      `INSERT INTO registrations (
        id, registration_number, event_id, student_name, register_number,
        department, year, college, email, phone, event_title, venue,
        event_dates, amount_paid, payment_status, registration_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.registrationNumber,
        data.eventId,
        data.studentName,
        data.registerNumber,
        data.department || null,
        data.year || null,
        data.college || 'Paavai Engineering College',
        data.email,
        data.phone || null,
        data.eventTitle,
        data.venue || null,
        data.eventDates || null,
        Number(data.amountPaid) || 0.00,
        data.paymentStatus || 'FREE',
        data.registrationDate,
        data.status || 'CONFIRMED'
      ]
    );

    return this.findById(id);
  },

  async cancel(id) {
    await query("UPDATE registrations SET status = 'CANCELLED' WHERE id = ?", [id]);
    return this.findById(id);
  }
};

export default registrationModel;
