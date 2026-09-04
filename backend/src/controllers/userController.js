import userModel from '../models/userModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getStudents = async (req, res, next) => {
  try {
    const students = await userModel.getAllStudents();
    return successResponse(res, students);
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (req, res, next) => {
  try {
    const staff = await userModel.getAllStaff();
    return successResponse(res, staff);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updated = await userModel.update(userId, req.body);
    if (!updated) {
      return errorResponse(res, 'User not found.', 404);
    }
    const { password_hash, ...sanitized } = updated;
    return successResponse(res, sanitized, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getStudents,
  getStaff,
  updateProfile
};
