import { Router } from 'express';
import eventsRouter from './events.js';

const router = Router();

router.use('/events', eventsRouter);

export default router;
