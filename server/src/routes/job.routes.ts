import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getCandidateApplications,
  getCompanyApplications,
} from '../controllers/job.controller.js';
import { updateJobStatus, getJobApplicants, updateApplicationStatus } from '../controllers/admin.controller.js';

const router = Router();

router.get('/', getJobs);
router.get('/applied/candidate', getCandidateApplications);
router.get('/applied/company', getCompanyApplications);
router.get('/:id/applicants', getJobApplicants);
router.patch('/applications/:id/status', updateApplicationStatus);
router.get('/:id', getJobById);
router.post('/', createJob);
router.post('/:id/apply', applyToJob);
router.put('/:id', updateJob);
router.patch('/:id/status', updateJobStatus);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
