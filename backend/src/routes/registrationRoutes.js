import { Router } from 'express';
import {
  getAllRegistrations,
  getRegistrationsByEvent,
  getRegistrationById,
  registerForEvent,
  cancelRegistration
} from '../controllers/registrationController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = Router();

// Public: Student registers for event without logging in
router.post('/', registerForEvent);
router.get('/:id', getRegistrationById);

// Staff/Admin protected: Review and manage registrations
router.get('/', verifyToken, requireRoles('staff', 'admin'), getAllRegistrations);
router.get('/event/:eventId', verifyToken, requireRoles('staff', 'admin'), getRegistrationsByEvent);
router.post('/:id/cancel', verifyToken, requireRoles('staff', 'admin'), cancelRegistration);

export default router;
