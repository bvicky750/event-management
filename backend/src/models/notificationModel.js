import { query } from '../config/db.js';

const formatNotification = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    recipientRole: row.recipient_role,
    recipientId: row.recipient_id,
    title: row.title,
    message: row.message,
    type: row.type,
    timestamp: row.timestamp,
    read: Boolean(row.is_read),
    link: row.link,
    createdAt: row.created_at
  };
};

export const notificationModel = {
  async findByRoleOrUser(role, userId) {
    const rows = await query(
      `SELECT * FROM notifications 
       WHERE recipient_role = 'all' 
          OR recipient_role = ? 
          OR recipient_id = ?
       ORDER BY created_at DESC`,
      [role, userId]
    );
    return rows.map(formatNotification);
  },

  async create(data) {
    const id = data.id || `notif_${Date.now()}`;
    const now = new Date();
    const formattedDate = data.timestamp || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await query(
      `INSERT INTO notifications (
        id, recipient_role, recipient_id, title, message, type, timestamp, is_read, link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.recipientRole || 'student',
        data.recipientId || null,
        data.title,
        data.message,
        data.type || 'info',
        formattedDate,
        data.read ? 1 : 0,
        data.link || null
      ]
    );

    const rows = await query('SELECT * FROM notifications WHERE id = ?', [id]);
    return formatNotification(rows[0]);
  },

  async markAsRead(id) {
    await query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    const rows = await query('SELECT * FROM notifications WHERE id = ?', [id]);
    return formatNotification(rows[0]);
  },

  async markAllAsRead(role, userId) {
    await query(
      `UPDATE notifications SET is_read = 1 
       WHERE recipient_role = 'all' 
          OR recipient_role = ? 
          OR recipient_id = ?`,
      [role, userId]
    );
    return true;
  }
};

export default notificationModel;
