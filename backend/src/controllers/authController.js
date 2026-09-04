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
    registerNumber: rest.register_number,
    year: rest.year,
    semester: rest.semester,
    section: rest.section,
    cgpa: rest.cgpa,
    attendancePercentage: rest.attendance_percentage ? Number(rest.attendance_percentage) : 0,
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
      return errorResponse(res, 'Invalid credentials. No user found with this email.', 401);
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
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      department,
      phone,
      college,
      registerNumber,
      year,
      semester,
      section,
      cgpa,
      employeeId,
      designation,
      cabin
    } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required.', 400);
    }

    const existingUser = await userModel.findByEmail(email.trim().toLowerCase());
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    if (registerNumber) {
      const existingReg = await userModel.findByRegisterNumber(registerNumber.trim());
      if (existingReg) {
        return errorResponse(res, 'A student with this register number already exists.', 409);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const id = role === 'student' ? `stud_${Date.now()}` : `staff_${Date.now()}`;

    const created = await userModel.create({
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      role: ['student', 'staff', 'admin'].includes(role) ? role : 'student',
      department,
      phone,
      college,
      register_number: registerNumber || null,
      year: year || null,
      semester: semester || null,
      section: section || null,
      cgpa: cgpa || null,
      attendance_percentage: 90.0,
      employee_id: employeeId || null,
      designation: designation || null,
      cabin: cabin || null,
      status: 'active'
    });

    const token = generateToken(created);
    const sanitized = sanitizeUser(created);

    return successResponse(
      res,
      {
        user: sanitized,
        token
      },
      'Account created successfully',
      201
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

export const switchDemoRole = async (req, res, next) => {
  try {
    const { role } = req.body; // 'student' or 'staff'
    let user;

    if (role === 'staff') {
      const staffList = await userModel.getAllStaff();
      user = staffList[0] ? await userModel.findById(staffList[0].id) : null;
    } else {
      const studentList = await userModel.getAllStudents();
      user = studentList[0] ? await userModel.findById(studentList[0].id) : null;
    }

    if (!user) {
      return errorResponse(res, `No default ${role} account found in database.`, 404);
    }

    const token = generateToken(user);
    const sanitized = sanitizeUser(user);

    return successResponse(res, {
      user: sanitized,
      token
    }, `Switched to demo ${role} role`);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  register,
  getCurrentUser,
  switchDemoRole
};
