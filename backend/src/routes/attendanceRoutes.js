import { Router } from 'express';
import {
  getAllAttendance,
  getAttendanceByEvent,
  getEventMetrics,
  recordScan,
  exportAttendanceCSV
} from '../controllers/attendanceController.js';
import { optionalAuth, verifyToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, requireRoles('staff', 'admin'), getAllAttendance);
router.get('/event/:eventId', optionalAuth, getAttendanceByEvent);
router.get('/metrics/:eventId', optionalAuth, getEventMetrics);
router.get('/export/:eventId', exportAttendanceCSV);
router.post('/scan', optionalAuth, recordScan);

export default router;
