import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.isOperational ? err.message : 'Internal Server Error'
  };

  if (config.nodeEnv === 'development' && !err.isOperational) {
    response.error = err.message;
  }

  res.status(statusCode).json(response);
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
