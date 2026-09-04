import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { optionalAuth, verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getNotifications);
router.put('/read-all', optionalAuth, markAllAsRead);
router.put('/:id/read', optionalAuth, markAsRead);

export default router;
