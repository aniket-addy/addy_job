import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  updateCompanyById,
  testCompanyNotification,
} from '../controllers/company.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', authenticate, updateCompanyById);
router.post('/:id/test-notification', authenticate, testCompanyNotification);

export default router;

