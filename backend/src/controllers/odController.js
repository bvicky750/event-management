import odModel from '../models/odModel.js';
import notificationModel from '../models/notificationModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllODRequests = async (req, res, next) => {
  try {
    const list = await odModel.findAll();
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getMyODRequests = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const list = await odModel.findByStudentId(studentId);
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getODRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reqRecord = await odModel.findById(id);
    if (!reqRecord) {
      return errorResponse(res, `OD Request with ID "${id}" not found.`, 404);
    }
    return successResponse(res, reqRecord);
  } catch (error) {
    next(error);
  }
};

export const getODStatusForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const studentId = req.query.studentId || req.user.id;
    const reqRecord = await odModel.findByStudentAndEvent(studentId, eventId);
    return successResponse(res, {
      status: reqRecord ? reqRecord.status : null,
      request: reqRecord
    });
  } catch (error) {
    next(error);
  }
};

export const submitODRequest = async (req, res, next) => {
  try {
    const formData = req.body;
    const studentId = req.user?.id || formData.studentId;
    const studentName = req.user?.name || formData.studentName;
    const registerNumber = req.user?.registerNumber || formData.registerNumber;

    if (!studentId || !formData.eventId || !formData.reason) {
      return errorResponse(res, 'Student ID, Event ID, and OD reason are required.', 400);
    }

    const newReq = await odModel.create({
      ...formData,
      studentId,
      studentName,
      registerNumber
    });

    // Notify staff
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await notificationModel.create({
      recipientRole: 'staff',
      title: 'New OD Request Submitted',
      message: `${studentName} (${registerNumber}) applied for OD for ${formData.eventTitle}.`,
      type: 'action_required',
      timestamp: formattedDate,
      read: false,
      link: '/staff/od'
    });

    return successResponse(res, newReq, 'OD request submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const approveODRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staffName = req.body.staffName || req.user?.name || 'Dr. K. Ramanathan';
    const staffUserId = req.user?.id || null;

    const existing = await odModel.findById(id);
    if (!existing) {
      return errorResponse(res, 'OD Request not found.', 404);
    }

    const updated = await odModel.updateStatus(id, {
      status: 'APPROVED',
      reviewedBy: staffName,
      reviewedByUserId: staffUserId
    });

    // Notify student
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await notificationModel.create({
      recipientRole: 'student',
      recipientId: existing.studentId,
      title: 'OD Request Approved! 🎉',
      message: `Your On-Duty application for ${existing.eventTitle} was approved by ${staffName}. You can now register for the event.`,
      type: 'success',
      timestamp: formattedDate,
      read: false,
      link: `/events/${existing.eventId}`
    });

    return successResponse(res, updated, `OD Request approved for ${existing.studentName}`);
  } catch (error) {
    next(error);
  }
};

export const rejectODRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, staffName } = req.body;
    const reviewerName = staffName || req.user?.name || 'Dr. K. Ramanathan';
    const staffUserId = req.user?.id || null;

    const existing = await odModel.findById(id);
    if (!existing) {
      return errorResponse(res, 'OD Request not found.', 404);
    }

    const rejectionReason = reason || 'The request did not meet the department criteria or overlaps with internal exams.';

    const updated = await odModel.updateStatus(id, {
      status: 'REJECTED',
      reviewedBy: reviewerName,
      reviewedByUserId: staffUserId,
      rejectionReason
    });

    // Notify student
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    await notificationModel.create({
      recipientRole: 'student',
      recipientId: existing.studentId,
      title: 'OD Request Rejected ⚠️',
      message: `Your OD request for ${existing.eventTitle} was rejected. Reason: ${rejectionReason}`,
      type: 'warning',
      timestamp: formattedDate,
      read: false,
      link: '/student/od'
    });

    return successResponse(res, updated, 'OD Request rejected with feedback sent to student');
  } catch (error) {
    next(error);
  }
};

export default {
  getAllODRequests,
  getMyODRequests,
  getODRequestById,
  getODStatusForEvent,
  submitODRequest,
  approveODRequest,
  rejectODRequest
};
