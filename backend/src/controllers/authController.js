import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import userModel from '../models/userModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return {
    id: rest.id,
    name: rest.name,
    email: rest.email,
    role: rest.role,
    department: rest.department,
    phone: rest.phone,
    college: rest.college,
    avatar: rest.avatar,
    employeeId: rest.employee_id,
    designation: rest.designation,
    cabin: rest.cabin,
    status: rest.status,
    createdAt: rest.created_at,
    updatedAt: rest.updated_at
  };
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both email and password.', 400);
    }

    const user = await userModel.findByEmail(email.trim().toLowerCase());
    if (!user) {
      return errorResponse(res, 'Invalid credentials. No account found with this email.', 401);
    }

    // Only staff and admin can log in
    if (!['staff', 'admin'].includes(user.role)) {
      return errorResponse(res, 'Access denied. Only authorized staff may log in.', 403);
    }

    if (user.status === 'inactive') {
      return errorResponse(res, 'Account is disabled. Please contact administrator.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user);
    const sanitized = sanitizeUser(user);

    return successResponse(
      res,
      {
        user: sanitized,
        token
      },
      'Staff login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }
    return successResponse(res, sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  getCurrentUser
};
