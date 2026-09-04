import crypto from 'crypto';

/**
 * Generate a unique registration number (e.g. REG-2026-001)
 */
export const generateRegistrationNumber = (count = 1) => {
  const padded = String(count).padStart(3, '0');
  const year = new Date().getFullYear();
  return `REG-DEMO-${year}-${padded}`;
};

/**
 * Generate a cryptographically secure QR token
 */
export const generateQRToken = (regNumber) => {
  // We can use the registration number or an HMAC / unique token
  return regNumber || `QR-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};
