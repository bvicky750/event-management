/**
 * Utility functions for consistent date and timezone handling.
 * College is in India (IST, Asia/Kolkata, UTC+5:30).
 */

export const getTodayDateString = () => {
  try {
    // en-CA produces YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

export const isDeadlinePassed = (deadlineStr, todayStr = null) => {
  if (!deadlineStr) return false;
  const today = todayStr || getTodayDateString();
  const cleanDeadline = String(deadlineStr).slice(0, 10);
  return cleanDeadline < today;
};

export default {
  getTodayDateString,
  isDeadlinePassed
};
