import { Router } from 'express';
import { getStudents, getStaff, updateProfile } from '../controllers/userController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/students', getStudents);
router.get('/staff', getStaff);
router.put('/profile', verifyToken, updateProfile);

export default router;
