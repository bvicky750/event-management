import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/response.js';
import userModel from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Authentication token missing.', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    
    let user = null;
    try {
      user = await userModel.findById(decoded.id);
    } catch (dbErr) {
      // Fallback to decoded token payload if database is unavailable
      user = {
        id: decoded.id,
        name: decoded.name || 'User',
        email: decoded.email,
        role: decoded.role || 'student',
        department: decoded.department,
        register_number: decoded.registerNumber,
        employee_id: decoded.employeeId,
        status: 'active'
      };
    }

    if (user && user.status === 'inactive') {
      return errorResponse(res, 'User session invalid or user inactive.', 401);
    }

    req.user = {
      id: user ? user.id : decoded.id,
      name: user ? user.name : decoded.name,
      email: user ? user.email : decoded.email,
      role: user ? user.role : decoded.role,
      department: user ? user.department : decoded.department,
      registerNumber: user ? (user.register_number || user.registerNumber) : decoded.registerNumber,
      employeeId: user ? (user.employee_id || user.employeeId) : decoded.employeeId
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid authentication token.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
  }
};

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized. Please log in.', 401);
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
      return errorResponse(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, config.jwt.secret);
        let user = null;
        try {
          user = await userModel.findById(decoded.id);
        } catch (dbErr) {
          user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role || 'student',
            department: decoded.department,
            register_number: decoded.registerNumber,
            employee_id: decoded.employeeId
          };
        }

        if (user && user.status !== 'inactive') {
          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            registerNumber: user.register_number || user.registerNumber,
            employeeId: user.employee_id || user.employeeId
          };
        }
      }
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};
