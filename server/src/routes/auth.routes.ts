import { Router } from 'express';
import { register, login, getMe, updateProfile, markNotificationsRead } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.patch('/notifications/read', markNotificationsRead);

export default router;
