import { Router } from 'express';
import { getHealth, getWelcome } from '../controllers/api.controller.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import jobRoutes from './job.routes.js';
import companyRoutes from './company.routes.js';

const router = Router();

router.get('/health', getHealth);
router.get('/welcome', getWelcome);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/jobs', jobRoutes);
router.use('/companies', companyRoutes);

export default router;
