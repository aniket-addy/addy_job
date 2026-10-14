import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
} from '../controllers/company.controller.js';

const router = Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

export default router;
