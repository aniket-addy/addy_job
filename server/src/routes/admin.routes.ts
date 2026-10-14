import { Router } from 'express';
import {
  getAdminOverview,
  getAdminCompanies,
  updateCompanyStatus,
  deleteCompany,
  updateCompanyPermissions,
  getAdminPermissionsSettings,
  updateAdminPermissionsSettings,
  getAdminJobs,
  updateJobStatus,
  deleteJob,
  getAdminApplications,
  createAdminApplication,
  updateApplicationStatus,
  sendBulkResumesToCompany,
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
router.patch('/companies/:id/permissions', updateCompanyPermissions);
router.delete('/companies/:id', deleteCompany);
router.post('/companies/:id/send-resumes', sendBulkResumesToCompany);

// Permissions & Auto-approval Settings
router.get('/permissions-settings', getAdminPermissionsSettings);
router.put('/permissions-settings', updateAdminPermissionsSettings);

// Jobs moderation
router.get('/jobs', getAdminJobs);
router.patch('/jobs/:id/status', updateJobStatus);
router.delete('/jobs/:id', deleteJob);

// Applications & Resumes management
router.get('/applications', getAdminApplications);
router.post('/applications', createAdminApplication);
router.patch('/applications/:id/status', updateApplicationStatus);
router.post('/resumes/bulk-send', sendBulkResumesToCompany);

// Plans & Pricing
router.get('/plans', getAdminPlans);
router.post('/plans', createAdminPlan);
router.put('/plans/:id', updateAdminPlan);
router.patch('/plans/:id', updateAdminPlan);
router.delete('/plans/:id', deleteAdminPlan);

export default router;
