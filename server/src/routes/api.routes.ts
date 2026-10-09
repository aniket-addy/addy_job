import { Router } from 'express';
import { getHealth, getWelcome } from '../controllers/api.controller.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.get('/health', getHealth);
router.get('/welcome', getWelcome);
router.use('/auth', authRoutes);

export default router;
