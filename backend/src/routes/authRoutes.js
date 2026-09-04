import { Router } from 'express';
import { login, register, getCurrentUser, switchDemoRole } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getCurrentUser);
router.post('/switch-demo', switchDemoRole);

export default router;
