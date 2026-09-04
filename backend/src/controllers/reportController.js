import { query } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export const getReports = async (req, res, next) => {
  try {
    const [eventsStats] = await query(`
      SELECT 
        COUNT(*) AS totalEvents,
        SUM(views_count) AS totalViews,
        SUM(registration_clicks) AS totalClicks,
        SUM(registered_count) AS totalRegistrations
      FROM events
    `);

    const [odStats] = await query(`
      SELECT
        COUNT(*) AS totalOD,
        SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS approvedOD,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pendingOD,
        SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejectedOD
      FROM od_requests
    `);

    const [attendanceStats] = await query(`
      SELECT COUNT(*) AS totalCheckIns FROM attendance
    `);

    const topEvents = await query(`
      SELECT id, title, category, type, views_count AS viewsCount, registration_clicks AS registrationClicks, registered_count AS registeredCount
      FROM events
      ORDER BY registration_clicks DESC, views_count DESC
      LIMIT 10
    `);

    const categoryBreakdown = await query(`
      SELECT category, COUNT(*) AS count, SUM(registered_count) AS totalRegistrations
      FROM events
      GROUP BY category
      ORDER BY count DESC
    `);

    return successResponse(res, {
      totals: {
        totalEvents: Number(eventsStats?.totalEvents) || 0,
        totalViews: Number(eventsStats?.totalViews) || 0,
        totalClicks: Number(eventsStats?.totalClicks) || 0,
        totalRegistrations: Number(eventsStats?.totalRegistrations) || 0,
        totalCheckIns: Number(attendanceStats?.totalCheckIns) || 0,
        od: {
          total: Number(odStats?.totalOD) || 0,
          approved: Number(odStats?.approvedOD) || 0,
          pending: Number(odStats?.pendingOD) || 0,
          rejected: Number(odStats?.rejectedOD) || 0
        }
      },
      topEvents,
      categoryBreakdown
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getReports
};
