import { Router } from 'express';
import {
  getAllRegistrations,
  getMyRegistrations,
  getRegistrationsByEvent,
  getRegistrationById,
  registerForEvent,
  cancelRegistration,
  getPastParticipation
} from '../controllers/registrationController.js';
import { optionalAuth, verifyToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, requireRoles('staff', 'admin'), getAllRegistrations);
router.get('/my', verifyToken, getMyRegistrations);
router.get('/event/:eventId', verifyToken, requireRoles('staff', 'admin'), getRegistrationsByEvent);
router.get('/past/:studentId?', optionalAuth, getPastParticipation);
router.get('/:id', optionalAuth, getRegistrationById);
router.post('/', optionalAuth, registerForEvent);
router.post('/:id/cancel', verifyToken, cancelRegistration);

export default router;
