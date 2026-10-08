import { Router } from 'express';
import { getHealth, getWelcome } from '../controllers/api.controller.js';

const router = Router();

router.get('/health', getHealth);
router.get('/welcome', getWelcome);

export default router;
