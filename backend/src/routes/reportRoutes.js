import { Router } from 'express';
import { getReports } from '../controllers/reportController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/analytics', optionalAuth, getReports);

export default router;
