import { Router } from 'express';
import {
  getAdminJobs,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
} from '../controllers/admin.controller.js';

const router = Router();

// Public / Company Jobs Endpoints
router.get('/', getAdminJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.patch('/:id/status', updateJobStatus);
router.delete('/:id', deleteJob);

export default router;
