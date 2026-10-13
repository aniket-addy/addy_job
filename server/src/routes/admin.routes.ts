import { Router } from 'express';
import {
  getAdminOverview,
  getAdminCompanies,
  updateCompanyStatus,
  deleteCompany,
  getAdminJobs,
  updateJobStatus,
  deleteJob,
  getAdminApplications,
  updateApplicationStatus,
  getAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
} from '../controllers/admin.controller.js';

const router = Router();

// Overview stats
router.get('/overview', getAdminOverview);

// Companies management
router.get('/companies', getAdminCompanies);
router.patch('/companies/:id/status', updateCompanyStatus);
router.delete('/companies/:id', deleteCompany);

// Jobs moderation
router.get('/jobs', getAdminJobs);
router.patch('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

// Applications management
router.get('/applications', getAdminApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

// Plans & Pricing
router.get('/plans', getAdminPlans);
router.post('/plans', createAdminPlan);
router.put('/plans/:id', updateAdminPlan);
router.patch('/plans/:id', updateAdminPlan);
router.delete('/plans/:id', deleteAdminPlan);

export default router;
