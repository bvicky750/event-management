import { Router } from 'express';
import {
  getAllODRequests,
  getMyODRequests,
  getODRequestById,
  getODStatusForEvent,
  submitODRequest,
  approveODRequest,
  rejectODRequest
} from '../controllers/odController.js';
import { optionalAuth, verifyToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getAllODRequests);
router.get('/my', verifyToken, getMyODRequests);
router.get('/event/:eventId/status', optionalAuth, getODStatusForEvent);
router.get('/:id', optionalAuth, getODRequestById);
router.post('/', optionalAuth, submitODRequest);
router.put('/:id/approve', optionalAuth, approveODRequest);
router.put('/:id/reject', optionalAuth, rejectODRequest);

export default router;
