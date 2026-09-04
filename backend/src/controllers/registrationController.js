import registrationModel from '../models/registrationModel.js';
import eventModel from '../models/eventModel.js';
import notificationModel from '../models/notificationModel.js';
import pastParticipationModel from '../models/pastParticipationModel.js';
import { generateRegistrationNumber, generateQRToken } from '../utils/qrToken.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllRegistrations = async (req, res, next) => {
  try {
    const list = await registrationModel.findAll();
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const list = await registrationModel.findByStudentId(studentId);
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getRegistrationsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const list = await registrationModel.findByEventId(eventId);
    return successResponse(res, list);
  } catch (error) {
    next(error);
  }
};

export const getRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reg = await registrationModel.findById(id);
    if (!reg) {
      return errorResponse(res, `Registration pass "${id}" not found.`, 404);
    }
    return successResponse(res, reg);
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const {
      eventId,
      studentId: providedStudentId,
      studentName: providedStudentName,
      registerNumber: providedRegNumber,
      department: providedDept,
      email: providedEmail,
      phone: providedPhone,
      activities = [],
      amountPaid = 0,
      paymentStatus = 'PAID'
    } = req.body;

    const studentId = req.user?.id || providedStudentId;
    const studentName = req.user?.name || providedStudentName;
    const registerNumber = req.user?.registerNumber || providedRegNumber;
    const department = req.user?.department || providedDept;
    const email = req.user?.email || providedEmail;
    const phone = providedPhone;

    if (!eventId) {
      return errorResponse(res, 'Event ID is required.', 400);
    }

    if (!studentId || !studentName || !registerNumber) {
      return errorResponse(res, 'Student profile details (ID, name, register number) are required.', 400);
    }

    // 1. Verify Event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return errorResponse(res, `Event with ID "${eventId}" does not exist.`, 404);
    }

    // 2. Check for duplicate registration
    const existing = await registrationModel.findActiveByStudentAndEvent(studentId, eventId);
    if (existing) {
      return errorResponse(
        res,
        `Student is already registered for "${event.title}". Pass ID: ${existing.registrationNumber}`,
        409,
        { existingRegistration: existing }
      );
    }

    // 3. Check Event Capacity
    if (event.capacity && (event.registeredCount || 0) >= event.capacity) {
      return errorResponse(res, `Event is fully booked (Capacity: ${event.capacity}). Registration is closed.`, 400);
    }

    // 4. Generate Registration Number & QR Token
    const totalCount = await registrationModel.count();
    const regNumber = generateRegistrationNumber(totalCount + 1);
    const qrToken = generateQRToken(regNumber);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const eventDatesStr = `${event.startDate}${event.endDate && event.endDate !== event.startDate ? ` - ${event.endDate}` : ''}`;

    const newReg = await registrationModel.create({
      registrationNumber: regNumber,
      studentId,
      eventId,
      studentName,
      registerNumber,
      department,
      email,
      phone,
      eventTitle: event.title,
      college: event.institution || 'Paavai Engineering College',
      venue: `${event.venue}, ${event.city}`,
      eventDates: eventDatesStr,
      activities,
      amountPaid: Number(amountPaid) || 0,
      paymentStatus: Number(amountPaid) > 0 ? (paymentStatus || 'PAID') : 'FREE',
      registrationDate: formattedDate,
      qrCodeToken: qrToken,
      status: 'CONFIRMED',
      attendanceStatus: 'NOT_CHECKED_IN',
      checkInTime: null
    });

    // 5. Increment event count
    await eventModel.incrementRegisteredCount(eventId, 1);

    // 6. Create Student Notification
    await notificationModel.create({
      recipientRole: 'student',
      recipientId: studentId,
      title: 'Registration Confirmed! 🎟️',
      message: `You have successfully registered for ${event.title}. Your Pass ID is ${regNumber}.`,
      type: 'success',
      timestamp: formattedDate,
      read: false,
      link: `/student/registrations/${newReg.id}`
    });

    return successResponse(res, newReg, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reg = await registrationModel.findById(id);
    if (!reg) {
      return errorResponse(res, 'Registration not found.', 404);
    }

    if (req.user.role === 'student' && reg.studentId !== req.user.id) {
      return errorResponse(res, 'You do not have permission to cancel this registration.', 403);
    }

    const cancelled = await registrationModel.cancel(id);
    await eventModel.incrementRegisteredCount(reg.eventId, -1);

    return successResponse(res, cancelled, 'Registration cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const getPastParticipation = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const past = await pastParticipationModel.findByStudentId(studentId);
    return successResponse(res, past);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRegistrations,
  getMyRegistrations,
  getRegistrationsByEvent,
  getRegistrationById,
  registerForEvent,
  cancelRegistration,
  getPastParticipation
};
