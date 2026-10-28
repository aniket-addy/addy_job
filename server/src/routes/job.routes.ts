import { Router } from 'express';
import {
  getJobs,
  getJobById,
  getJobActivity,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getCandidateApplications,
  getCompanyApplications,
  updateJobApplicationStatus,
  markResumeViewed,
} from '../controllers/job.controller.js';
import { updateJobStatus, getJobApplicants, updateApplicationStatus } from '../controllers/admin.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';

const router = Router();

// 🔓 Public routes (no auth needed)
router.get('/', getJobs);
router.get('/:id/activity', getJobActivity);
router.get('/:id', getJobById);

// 🔒 Protected routes (require valid JWT token)
router.get('/applied/candidate', authenticate, getCandidateApplications);
router.get('/applied/company', authenticate, getCompanyApplications);
router.get('/:id/applicants', authenticate, getJobApplicants);
router.patch('/applications/:id/status', authenticate, updateJobApplicationStatus);
router.patch('/applications/:id/view-resume', authenticate, markResumeViewed);
router.post('/', authenticate, createJob);
router.post('/:id/apply', optionalAuthenticate, applyToJob);
router.put('/:id', authenticate, updateJob);
router.patch('/:id/status', authenticate, updateJobStatus);
router.patch('/:id', authenticate, updateJob);
router.delete('/:id', authenticate, deleteJob);

export default router;
