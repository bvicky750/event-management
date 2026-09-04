import notificationModel from '../models/notificationModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getNotifications = async (req, res, next) => {
  try {
    const role = req.user?.role || 'student';
    const userId = req.user?.id || null;
    const notifications = await notificationModel.findByRoleOrUser(role, userId);
    return successResponse(res, notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await notificationModel.markAsRead(id);
    return successResponse(res, notif, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const role = req.user?.role || 'student';
    const userId = req.user?.id || null;
    await notificationModel.markAllAsRead(role, userId);
    return successResponse(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead
};
