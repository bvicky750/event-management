import registrationModel from '../models/registrationModel.js';
import eventModel from '../models/eventModel.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { getTodayDateString } from '../utils/dateUtils.js';

export const getAllRegistrations = async (req, res, next) => {
  try {
    const list = await registrationModel.findAll();
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
      return errorResponse(res, `Registration "${id}" not found.`, 404);
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
      studentName,
      registerNumber,
      department,
      year,
      college,
      email,
      phone
    } = req.body;

    // 1. Validate required fields
    if (!eventId) {
      return errorResponse(res, 'Event ID is required.', 400);
    }

    if (!studentName || !studentName.trim()) {
      return errorResponse(res, 'Student Name is required.', 400);
    }

    if (!registerNumber || !registerNumber.trim()) {
      return errorResponse(res, 'Register Number is required.', 400);
    }

    if (!email || !email.trim()) {
      return errorResponse(res, 'Email address is required.', 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRegNo = registerNumber.trim().toUpperCase();
    const cleanName = studentName.trim();

    // 2. Verify Event exists
    const event = await eventModel.findById(eventId);
    if (!event) {
      return errorResponse(res, `Opportunity with ID "${eventId}" does not exist.`, 404);
    }

    // 3. Verify Event is published
    if (event.status !== 'published') {
      return errorResponse(res, `Registration is not available for this event (Status: ${event.status}).`, 400);
    }

    // 4. Verify Registration Deadline
    const deadlineStr = event.registrationDeadline || event.startDate;
    if (deadlineStr) {
      const today = getTodayDateString();
      if (String(deadlineStr).slice(0, 10) < today) {
        return errorResponse(res, 'Registration for this opportunity has closed.', 400);
      }
    }

    // 5. Verify Event Capacity
    if (event.capacity && (event.registeredCount || 0) >= event.capacity) {
      return errorResponse(res, `Event is full (Capacity of ${event.capacity} reached). Registration is closed.`, 400);
    }

    // 6. Check Duplicate Registration
    const existing = await registrationModel.findExisting(eventId, cleanRegNo, cleanEmail);
    if (existing) {
      return errorResponse(
        res,
        `Student with Register Number "${cleanRegNo}" (or email "${cleanEmail}") has already registered for "${event.title}". Registration ID: ${existing.registrationNumber}`,
        409,
        { existingRegistration: existing }
      );
    }

    // 7. Generate Registration Number
    const totalCount = await registrationModel.count();
    const regNumber = `REG-2026-${String(totalCount + 1).padStart(4, '0')}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const eventDatesStr = `${event.startDate}${event.endDate && event.endDate !== event.startDate ? ` - ${event.endDate}` : ''}`;

    // 8. Create Registration in MySQL
    const newReg = await registrationModel.create({
      registrationNumber: regNumber,
      eventId,
      studentName: cleanName,
      registerNumber: cleanRegNo,
      department: department?.trim() || null,
      year: year?.trim() || null,
      college: college?.trim() || event.institution || 'Paavai Engineering College',
      email: cleanEmail,
      phone: phone?.trim() || null,
      eventTitle: event.title,
      venue: `${event.venue}, ${event.city}`,
      eventDates: eventDatesStr,
      amountPaid: Number(event.registrationFee) || 0.00,
      paymentStatus: Number(event.registrationFee) > 0 ? 'PAID' : 'FREE',
      registrationDate: formattedDate,
      status: 'CONFIRMED'
    });

    // 9. Increment registered_count on the event
    await eventModel.incrementRegisteredCount(eventId, 1);

    return successResponse(
      res,
      newReg,
      `Registration confirmed successfully for ${event.title}! Your Registration ID is ${regNumber}.`,
      201
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'A registration with this Register Number or Email already exists for this event.', 409);
    }
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

    const cancelled = await registrationModel.cancel(id);
    await eventModel.incrementRegisteredCount(reg.eventId, -1);

    return successResponse(res, cancelled, 'Registration cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRegistrations,
  getRegistrationsByEvent,
  getRegistrationById,
  registerForEvent,
  cancelRegistration
};
