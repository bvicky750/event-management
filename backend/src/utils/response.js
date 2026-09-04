/**
 * Standardized API Response Helpers
 */

export const successResponse = (res, data = null, message = null, statusCode = 200) => {
  const payload = { success: true };
  if (message) payload.message = message;
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};
