import eventModel from '../models/eventModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const {
      search,
      query: searchQuery,
      type,
      category,
      city,
      fee,
      sort,
      includeDrafts
    } = req.query;

    const events = await eventModel.findAll({
      search: search || searchQuery || '',
      type,
      category,
      city,
      fee,
      sort,
      includeDrafts: includeDrafts === 'true'
    });

    return successResponse(res, events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventModel.findById(id);
    if (!event) {
      return errorResponse(res, `Event with ID "${id}" not found.`, 404);
    }
    return successResponse(res, event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;
    if (!eventData.title) {
      return errorResponse(res, 'Event title is required.', 400);
    }

    if (req.user) {
      eventData.createdBy = req.user.id;
    }

    const newEvent = await eventModel.create(eventData);
    return successResponse(res, newEvent, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await eventModel.findById(id);
    if (!existing) {
      return errorResponse(res, `Event with ID "${id}" not found.`, 404);
    }

    const updated = await eventModel.update(id, req.body);
    return successResponse(res, updated, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await eventModel.findById(id);
    if (!existing) {
      return errorResponse(res, `Event with ID "${id}" not found.`, 404);
    }

    await eventModel.delete(id);
    return successResponse(res, { id }, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const trackView = async (req, res, next) => {
  try {
    const { id } = req.params;
    const count = await eventModel.incrementViews(id);
    return successResponse(res, { viewsCount: count });
  } catch (error) {
    next(error);
  }
};

export const trackClick = async (req, res, next) => {
  try {
    const { id } = req.params;
    const count = await eventModel.incrementClicks(id);
    return successResponse(res, { registrationClicks: count });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  trackView,
  trackClick
};
