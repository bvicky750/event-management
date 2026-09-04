import { query } from '../config/db.js';

export const userModel = {
  async findById(id) {
    const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByRegisterNumber(regNo) {
    const rows = await query('SELECT * FROM users WHERE register_number = ?', [regNo]);
    return rows[0] || null;
  },

  async getAllStudents() {
    const rows = await query(
      'SELECT id, name, register_number AS registerNumber, department, year, semester, section, email, phone, college, avatar, cgpa, attendance_percentage AS attendancePercentage FROM users WHERE role = ? ORDER BY name ASC',
      ['student']
    );
    return rows;
  },

  async getAllStaff() {
    const rows = await query(
      `SELECT u.id, u.name, u.employee_id AS employeeId, u.email, u.department, u.designation, u.phone, u.college, u.avatar, u.cabin,
       (SELECT COUNT(*) FROM events e WHERE e.created_by = u.id AND e.status = 'published') AS activeEventsCount
       FROM users u WHERE u.role IN ('staff', 'admin') ORDER BY u.name ASC`
    );
    return rows;
  },

  async create(user) {
    const {
      id,
      name,
      email,
      password_hash,
      role = 'student',
      department,
      phone,
      college = 'Paavai Engineering College',
      avatar,
      register_number,
      year,
      semester,
      section,
      cgpa,
      attendance_percentage = 0,
      employee_id,
      designation,
      cabin,
      status = 'active'
    } = user;

    await query(
      `INSERT INTO users (id, name, email, password_hash, role, department, phone, college, avatar, register_number, year, semester, section, cgpa, attendance_percentage, employee_id, designation, cabin, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        email,
        password_hash,
        role,
        department || null,
        phone || null,
        college,
        avatar || null,
        register_number || null,
        year || null,
        semester || null,
        section || null,
        cgpa || null,
        attendance_percentage,
        employee_id || null,
        designation || null,
        cabin || null,
        status
      ]
    );

    return this.findById(id);
  },

  async update(id, updates) {
    const allowedFields = [
      'name', 'phone', 'department', 'college', 'avatar',
      'year', 'semester', 'section', 'cgpa', 'attendance_percentage',
      'designation', 'cabin', 'status'
    ];

    const fieldsToSet = [];
    const values = [];

    for (const [key, val] of Object.entries(updates)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(snakeKey)) {
        fieldsToSet.push(`\`${snakeKey}\` = ?`);
        values.push(val);
      }
    }

    if (fieldsToSet.length === 0) return this.findById(id);

    values.push(id);
    await query(`UPDATE users SET ${fieldsToSet.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }
};

export default userModel;
