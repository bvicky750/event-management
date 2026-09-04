import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  trackView,
  trackClick
} from '../controllers/eventController.js';
import { optionalAuth, verifyToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getAllEvents);
router.get('/:id', optionalAuth, getEventById);
router.post('/', verifyToken, requireRoles('staff', 'admin'), createEvent);
router.put('/:id', verifyToken, requireRoles('staff', 'admin'), updateEvent);
router.delete('/:id', verifyToken, requireRoles('staff', 'admin'), deleteEvent);
router.post('/:id/track-view', trackView);
router.post('/:id/track-click', trackClick);

export default router;
