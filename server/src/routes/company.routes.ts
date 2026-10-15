import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  updateCompanyById,
} from '../controllers/company.controller.js';

const router = Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompanyById);

export default router;
