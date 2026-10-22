import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  updateCompanyById,
  testCompanyNotification,
} from '../controllers/company.controller.js';

const router = Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompanyById);
router.post('/:id/test-notification', testCompanyNotification);

export default router;
