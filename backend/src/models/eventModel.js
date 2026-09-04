import { query } from '../config/db.js';

// Helper to format event DB row to frontend camelCase structure
const formatEvent = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    type: row.type,
    category: row.category,
    description: row.description,
    fullDescription: row.full_description,
    poster: row.poster,
    startDate: row.start_date,
    endDate: row.end_date,
    startTime: row.start_time,
    endTime: row.end_time,
    venue: row.venue,
    city: row.city,
    institution: row.institution,
    department: row.department,
    registrationFee: Number(row.registration_fee) || 0,
    registrationDeadline: row.registration_deadline,
    registrationUrl: row.registration_url,
    eligibility: row.eligibility,
    capacity: row.capacity,
    registeredCount: row.registered_count,
    viewsCount: row.views_count,
    registrationClicks: row.registration_clicks,
    status: row.status,
    featured: Boolean(row.featured),
    createdBy: row.created_by,
    coordinator: {
      name: row.coordinator_name || '',
      email: row.coordinator_email || '',
      phone: row.coordinator_phone || ''
    },
    topics: typeof row.topics === 'string' ? JSON.parse(row.topics) : (row.topics || []),
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    activities: typeof row.activities === 'string' ? JSON.parse(row.activities) : (row.activities || []),
    od: typeof row.od_config === 'string' ? JSON.parse(row.od_config) : (row.od_config || {
      available: true,
      requiresApproval: true,
      eligibleYears: ['2nd Year', '3rd Year', 'Final Year'],
      maxDays: 2
    }),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const eventModel = {
  async findAll({ search = '', type = 'all', category = 'all', city = 'all', fee = 'all', sort = 'upcoming', includeDrafts = false } = {}) {
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (!includeDrafts) {
      sql += " AND status != 'draft'";
    }

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (category && category !== 'all') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (city && city !== 'all') {
      sql += ' AND LOWER(city) = LOWER(?)';
      params.push(city);
    }

    if (fee === 'free') {
      sql += ' AND (registration_fee = 0 OR registration_fee IS NULL)';
    } else if (fee === 'paid') {
      sql += ' AND registration_fee > 0';
    }

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      sql += ` AND (
        LOWER(title) LIKE ? OR
        LOWER(subtitle) LIKE ? OR
        LOWER(description) LIKE ? OR
        LOWER(institution) LIKE ? OR
        LOWER(category) LIKE ? OR
        LOWER(venue) LIKE ? OR
        LOWER(city) LIKE ?
      )`;
      params.push(q, q, q, q, q, q, q);
    }

    // Sorting
    if (sort === 'upcoming') {
      sql += ' ORDER BY start_date ASC';
    } else if (sort === 'popular' || sort === 'clicks') {
      sql += ' ORDER BY registration_clicks DESC';
    } else if (sort === 'views') {
      sql += ' ORDER BY views_count DESC';
    } else if (sort === 'recently_added') {
      sql += ' ORDER BY created_at DESC';
    } else {
      sql += ' ORDER BY start_date ASC';
    }

    const rows = await query(sql, params);
    return rows.map(formatEvent);
  },

  async findById(id) {
    const rows = await query('SELECT * FROM events WHERE id = ?', [id]);
    return formatEvent(rows[0]);
  },

  async create(data) {
    const id = data.id || (data.type === 'external_opportunity' ? `ext_evt_${Date.now()}` : `tp_evt_${Date.now()}`);
    const coordinator = data.coordinator || {};

    const coordinatorName = data.coordinatorName || coordinator.name || null;
    const coordinatorEmail = data.coordinatorEmail || coordinator.email || null;
    const coordinatorPhone = data.coordinatorPhone || coordinator.phone || null;

    const topicsJson = JSON.stringify(data.topics || []);
    const tagsJson = JSON.stringify(data.tags || [data.category || 'Career']);
    const activitiesJson = JSON.stringify(data.activities || []);
    const odConfigJson = JSON.stringify(data.od || data.od_config || {
      available: true,
      requiresApproval: true,
      eligibleYears: ['2nd Year', '3rd Year', 'Final Year'],
      maxDays: 2
    });

    await query(
      `INSERT INTO events (
        id, title, subtitle, type, category, description, full_description, poster,
        start_date, end_date, start_time, end_time, venue, city, institution, department,
        registration_fee, registration_deadline, registration_url, eligibility, capacity,
        registered_count, views_count, registration_clicks, status, featured, created_by,
        coordinator_name, coordinator_email, coordinator_phone, topics, tags, activities, od_config
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.subtitle || null,
        data.type || 'club_event',
        data.category || 'Career',
        data.description || null,
        data.fullDescription || data.description || null,
        data.poster || null,
        data.startDate || new Date().toISOString().split('T')[0],
        data.endDate || data.startDate || new Date().toISOString().split('T')[0],
        data.startTime || '09:30 AM',
        data.endTime || '04:30 PM',
        data.venue || 'Main Seminar Hall',
        data.city || 'On-Campus',
        data.institution || 'Training & Placement Club',
        data.department || null,
        Number(data.registrationFee) || 0.00,
        data.registrationDeadline || data.startDate,
        data.registrationUrl || null,
        data.eligibility || 'Open to all engineering students',
        Number(data.capacity) || 150,
        Number(data.registeredCount) || 0,
        Number(data.viewsCount) || 1,
        Number(data.registrationClicks) || 0,
        data.status || 'published',
        data.featured ? 1 : 0,
        data.createdBy || null,
        coordinatorName,
        coordinatorEmail,
        coordinatorPhone,
        topicsJson,
        tagsJson,
        activitiesJson,
        odConfigJson
      ]
    );

    return this.findById(id);
  },

  async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const coordinator = updates.coordinator || {};
    const coordinatorName = updates.coordinatorName !== undefined ? updates.coordinatorName : (coordinator.name || existing.coordinator?.name);
    const coordinatorEmail = updates.coordinatorEmail !== undefined ? updates.coordinatorEmail : (coordinator.email || existing.coordinator?.email);
    const coordinatorPhone = updates.coordinatorPhone !== undefined ? updates.coordinatorPhone : (coordinator.phone || existing.coordinator?.phone);

    const topicsJson = updates.topics ? JSON.stringify(updates.topics) : undefined;
    const tagsJson = updates.tags ? JSON.stringify(updates.tags) : undefined;
    const activitiesJson = updates.activities ? JSON.stringify(updates.activities) : undefined;
    const odConfigJson = (updates.od || updates.od_config) ? JSON.stringify(updates.od || updates.od_config) : undefined;

    const fields = [];
    const values = [];

    const map = {
      title: updates.title,
      subtitle: updates.subtitle,
      type: updates.type,
      category: updates.category,
      description: updates.description,
      full_description: updates.fullDescription,
      poster: updates.poster,
      start_date: updates.startDate,
      end_date: updates.endDate,
      start_time: updates.startTime,
      end_time: updates.endTime,
      venue: updates.venue,
      city: updates.city,
      institution: updates.institution,
      department: updates.department,
      registration_fee: updates.registrationFee !== undefined ? Number(updates.registrationFee) : undefined,
      registration_deadline: updates.registrationDeadline,
      registration_url: updates.registrationUrl,
      eligibility: updates.eligibility,
      capacity: updates.capacity !== undefined ? Number(updates.capacity) : undefined,
      status: updates.status,
      featured: updates.featured !== undefined ? (updates.featured ? 1 : 0) : undefined,
      coordinator_name: coordinatorName,
      coordinator_email: coordinatorEmail,
      coordinator_phone: coordinatorPhone,
      topics: topicsJson,
      tags: tagsJson,
      activities: activitiesJson,
      od_config: odConfigJson
    };

    for (const [col, val] of Object.entries(map)) {
      if (val !== undefined) {
        fields.push(`\`${col}\` = ?`);
        values.push(val);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      await query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return this.findById(id);
  },

  async delete(id) {
    await query('DELETE FROM events WHERE id = ?', [id]);
    return true;
  },

  async incrementViews(id) {
    await query('UPDATE events SET views_count = views_count + 1 WHERE id = ?', [id]);
    const row = await query('SELECT views_count FROM events WHERE id = ?', [id]);
    return row[0]?.views_count || 0;
  },

  async incrementClicks(id) {
    await query('UPDATE events SET registration_clicks = registration_clicks + 1 WHERE id = ?', [id]);
    const row = await query('SELECT registration_clicks FROM events WHERE id = ?', [id]);
    return row[0]?.registration_clicks || 0;
  },

  async incrementRegisteredCount(id, delta = 1) {
    await query('UPDATE events SET registered_count = GREATEST(0, registered_count + ?) WHERE id = ?', [delta, id]);
  }
};

export default eventModel;
