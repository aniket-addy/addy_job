import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import { Plan } from '../models/plan.model.js';
import { Settings } from '../models/settings.model.js';
import { ensureDBConnection } from '../config/db.js';

// Helper to generate initials & color
const getInitials = (name: string): string => {
  if (!name) return 'CO';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const bgColors = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-amber-500',
  'bg-rose-600',
  'bg-teal-600',
  'bg-purple-600',
];

const getColorForName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index];
};

// No-op: seed function removed. Super Admin shows only real DB data.
export const seedInitialAdminData = async () => {
  // Nothing to seed — all data is real from database.
  return;
};



// @desc    Get dashboard overview metrics & statistics
// @route   GET /api/admin/overview
export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    await seedInitialAdminData();

    const [
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      rejectedCompanies,
      totalJobs,
      activeJobs,
      expiredJobs,
      totalApplications,
      totalCandidates,
      plans,
    ] = await Promise.all([
      User.countDocuments({ role: 'company' }),
      User.countDocuments({ role: 'company', status: 'Pending' }),
      User.countDocuments({ role: 'company', status: 'Approved' }),
      User.countDocuments({ role: 'company', status: 'Rejected' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'Active' }),
      Job.countDocuments({ status: 'Expired' }),
      Application.countDocuments(),
      User.countDocuments({ role: 'job_seeker' }),
      Plan.find({ status: 'Active' }),
    ]);

    // Real Platform Revenue (₹ 0 until payment integration is configured)
    const revenueEst = 0;

    res.json({
      success: true,
      data: {
        totalCompanies,
        pendingCompanies,
        approvedCompanies,
        rejectedCompanies,
        totalJobs,
        activeJobs,
        expiredJobs,
        totalApplications,
        totalCandidates,
        plansCount: plans.length,
        totalRevenue: `₹ ${revenueEst.toLocaleString('en-IN')}`,
      },
    });
  } catch (error: any) {
    console.error('getAdminOverview error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve overview statistics' });
  }
};

// @desc    Get all companies list with live database details
// @route   GET /api/admin/companies
export const getAdminCompanies = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    await seedInitialAdminData();

    const users = await User.find({ role: 'company' }).sort({ createdAt: -1 });

    // Count jobs per company
    const jobs = await Job.find({});
    const jobsCountMap: Record<string, number> = {};
    jobs.forEach((j) => {
      const cName = j.company?.toLowerCase().trim();
      if (cName) {
        jobsCountMap[cName] = (jobsCountMap[cName] || 0) + 1;
      }
    });

    const companies = users.map((u) => {
      const name = u.companyName || u.name || 'Unnamed Company';
      const cKey = name.toLowerCase().trim();
      const activeJobs = jobsCountMap[cKey] || 0;

      return {
        id: u._id.toString(),
        userId: u.userId || u.customId,
        name,
        email: u.workEmail || u.email,
        location: u.location || 'India',
        activeJobs,
        plan: activeJobs > 15 ? 'Enterprise' : activeJobs > 5 ? 'Pro Plan' : 'Basic Plan',
        status: (u.status || 'Pending') as 'Approved' | 'Pending' | 'Rejected',
        submittedOn: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          : 'Recent',
        logoBg: getColorForName(name),
        logoLetter: getInitials(name),
        phone: u.phone || '',
        gstNumber: u.gstNumber || '',
        industry: u.industry || '',
        companySize: u.companySize || '',
        website: (u as any).website || '',
        permissions: u.permissions || {
          dashboard: false,
          jobs: false,
          applicants: false,
          resumes: false,
          settings: false,
          autoApproveFromSubscription: true,
        },
      };
    });

    res.json({ success: true, companies });
  } catch (error: any) {
    console.error('getAdminCompanies error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve companies' });
  }
};

// @desc    Approve or reject company registration status
// @route   PATCH /api/admin/companies/:id/status
export const updateCompanyStatus = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const id = String(req.params.id);
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value' });
      return;
    }

    let company = null;
    if (mongoose.isValidObjectId(id)) {
      company = await User.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const mappedCoId = id.replace(/^c(\d+)$/i, 'co0$1');
      company = await User.findOneAndUpdate(
        { $or: [{ userId: id }, { customId: id }, { userId: mappedCoId }, { customId: mappedCoId }] },
        { status },
        { new: true }
      );
    }

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    res.json({
      success: true,
      message: `Company status updated to ${status}`,
      company: {
        id: company._id.toString(),
        name: company.companyName || company.name,
        status: company.status,
      },
    });
  } catch (error: any) {
    console.error('updateCompanyStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update company status' });
  }
};

// @desc    Delete company
// @route   DELETE /api/admin/companies/:id
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const id = String(req.params.id);

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await User.findByIdAndDelete(id);
    } else {
      deleted = await User.findOneAndDelete({
        $or: [{ userId: id }, { customId: id }],
      });
    }

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    // Also remove company's jobs
    const companyName = deleted.companyName || deleted.name;
    if (companyName) {
      await Job.deleteMany({ company: companyName });
    }

    res.json({ success: true, message: 'Company and associated records deleted' });
  } catch (error: any) {
    console.error('deleteCompany error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete company' });
  }
};

// @desc    Get all jobs from database
// @route   GET /api/admin/jobs
export const getAdminJobs = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    await seedInitialAdminData();

    const jobs = await Job.find({}).sort({ createdAt: -1 });

    const formatted = jobs.map((j) => ({
      id: j._id.toString(),
      title: j.title,
      company: j.company,
      type: j.type,
      location: j.location,
      salary: j.salary,
      status: j.status,
      postedOn: j.postedOn || 'Recent',
      applicantsCount: j.applicantsCount || 0,
      department: j.department || 'Engineering',
      description: j.description || '',
    }));

    res.json({ success: true, jobs: formatted });
  } catch (error: any) {
    console.error('getAdminJobs error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve jobs' });
  }
};

// @desc    Update job status (Active, Pending, Expired, Closed)
// @route   PATCH /api/admin/jobs/:id/status
export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Pending', 'Expired', 'Closed'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid job status' });
      return;
    }

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      message: `Job status changed to ${status}`,
      job: {
        id: job._id.toString(),
        title: job.title,
        status: job.status,
      },
    });
  } catch (error: any) {
    console.error('updateJobStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update job status' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/admin/jobs/:id
export const deleteJob = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({ success: true, message: 'Job posting deleted successfully' });
  } catch (error: any) {
    console.error('deleteJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
export const getAdminApplications = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    await seedInitialAdminData();

    const apps = await Application.find({}).sort({ createdAt: -1 });

    const formatted = apps.map((a: any) => ({
      id: a._id.toString(),
      candidateName: a.candidateName,
      candidateEmail: a.candidateEmail || '',
      candidatePhone: a.candidatePhone || '',
      avatarLetter: a.avatarLetter || getInitials(a.candidateName),
      avatarBg: a.avatarBg || getColorForName(a.candidateName),
      position: a.position,
      company: a.company,
      appliedOn: a.appliedOn || 'Recent',
      status: a.status,
      resumeUrl: a.resumeUrl || '',
      domain: a.domain || '',
      experience: a.experience || '',
      skills: a.skills || [],
      pdfData: a.pdfData || '',
      fileName: a.fileName || '',
    }));

    res.json({ success: true, applications: formatted });
  } catch (error: any) {
    console.error('getAdminApplications error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve applications' });
  }
};

// @desc    Upload / Create candidate application or resume
// @route   POST /api/admin/applications
export const createAdminApplication = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const {
      candidateName,
      candidateEmail,
      candidatePhone,
      position,
      company,
      domain,
      experience,
      skills,
      pdfData,
      fileName,
      status,
      resumeUrl,
    } = req.body;

    if (!candidateName || !domain || !experience) {
      res.status(400).json({
        success: false,
        message: 'Candidate name, domain, and experience are required.',
      });
      return;
    }

    const newApp = new Application({
      candidateName: candidateName.trim(),
      candidateEmail: (candidateEmail || '').trim(),
      candidatePhone: (candidatePhone || '').trim(),
      position: (position || domain || 'Candidate').trim(),
      company: (company || 'General Pool / Open').trim(),
      domain: domain.trim(),
      experience: experience.trim(),
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? String(skills)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      pdfData: pdfData || '',
      fileName: fileName || '',
      resumeUrl: resumeUrl || '',
      status: status || 'New',
      avatarLetter: getInitials(candidateName),
      avatarBg: getColorForName(candidateName),
    });

    await newApp.save();

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      application: {
        id: newApp._id.toString(),
        candidateName: newApp.candidateName,
        candidateEmail: newApp.candidateEmail,
        candidatePhone: newApp.candidatePhone,
        avatarLetter: newApp.avatarLetter,
        avatarBg: newApp.avatarBg,
        position: newApp.position,
        company: newApp.company,
        appliedOn: newApp.appliedOn,
        status: newApp.status,
        domain: newApp.domain,
        experience: newApp.experience,
        skills: newApp.skills,
        pdfData: newApp.pdfData,
        fileName: newApp.fileName,
        resumeUrl: newApp.resumeUrl,
      },
    });
  } catch (error: any) {
    console.error('createAdminApplication error:', error);
    res.status(500).json({ success: false, message: 'Failed to create resume/application' });
  }
};

// @desc    Send bulk resumes to a specific company
// @route   POST /api/admin/resumes/bulk-send
export const sendBulkResumesToCompany = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { companyId, resumes, resumeIds } = req.body;
    const targetCompanyId = req.params.id || companyId;

    if (!targetCompanyId) {
      res.status(400).json({ success: false, message: 'Company ID is required' });
      return;
    }

    // Find company by _id, userId, customId, or email
    let company: any = null;
    if (mongoose.Types.ObjectId.isValid(targetCompanyId)) {
      company = await User.findById(targetCompanyId);
    }
    if (!company) {
      company = await User.findOne({
        $or: [
          { userId: targetCompanyId },
          { customId: targetCompanyId },
          { email: String(targetCompanyId).toLowerCase().trim() },
          { companyName: String(targetCompanyId).trim() },
        ],
        role: 'company',
      });
    }

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found with specified ID or email' });
      return;
    }

    // Determine resumes to transfer
    let resumesToAdd: any[] = [];
    if (Array.isArray(resumes) && resumes.length > 0) {
      resumesToAdd = resumes.map((r: any, idx: number) => ({
        id: r.id || `purchased-${Date.now()}-${idx}`,
        candidateName: r.candidateName || r.name || 'Candidate',
        title: r.position || r.title || r.domain || 'Candidate Profile',
        experience: r.experience || '1-2 Years',
        location: r.location || 'India',
        purchasedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        fileSize: r.fileSize || '250 KB',
        downloadUrl: r.downloadUrl || r.resumeUrl || '',
        email:
          r.candidateEmail ||
          r.email ||
          `${String(r.candidateName || 'candidate').toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: r.candidatePhone || r.phone || '+91 98765 43210',
        pdfData: r.pdfData || '',
        domain: r.domain || '',
        skills: r.skills || [],
      }));
    } else if (Array.isArray(resumeIds) && resumeIds.length > 0) {
      const dbApps = await Application.find({ _id: { $in: resumeIds } });
      resumesToAdd = dbApps.map((a: any) => ({
        id: a._id.toString(),
        candidateName: a.candidateName,
        title: a.position || a.domain || 'Candidate Profile',
        experience: a.experience || '1-2 Years',
        location: 'India',
        purchasedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        fileSize: '280 KB',
        downloadUrl: a.resumeUrl || '',
        email: a.candidateEmail || `${a.candidateName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: a.candidatePhone || '+91 98765 43210',
        pdfData: a.pdfData || '',
        domain: a.domain || '',
        skills: a.skills || [],
      }));
    }

    if (resumesToAdd.length === 0) {
      res.status(400).json({ success: false, message: 'No resumes provided to send.' });
      return;
    }

    // Initialize purchasedResumes if undefined
    if (!company.purchasedResumes) {
      company.purchasedResumes = [];
    }

    // Avoid duplicate additions by ID
    const existingIds = new Set(company.purchasedResumes.map((r: any) => r.id));
    const newItems = resumesToAdd.filter((r) => !existingIds.has(r.id));
    company.purchasedResumes = [...newItems, ...company.purchasedResumes];

    // Ensure company has resumes tab unlocked in permissions
    if (!company.permissions) {
      company.permissions = {
        dashboard: false,
        jobs: false,
        applicants: false,
        resumes: true,
        settings: false,
        autoApproveFromSubscription: true,
      };
    } else {
      company.permissions.resumes = true;
    }

    await company.save();

    res.json({
      success: true,
      message: `Successfully sent ${newItems.length} candidate resumes to ${company.companyName || company.name || company.email}.`,
      company: {
        id: company._id.toString(),
        userId: company.userId || company.customId,
        companyName: company.companyName || company.name,
        email: company.email,
        phone: company.phone,
        industry: company.industry,
        location: company.location,
        plan: company.plan,
        purchasedResumesCount: company.purchasedResumes.length,
      },
      sentResumesCount: newItems.length,
      purchasedResumes: company.purchasedResumes,
    });
  } catch (error: any) {
    console.error('sendBulkResumesToCompany error:', error);
    res.status(500).json({ success: false, message: 'Failed to send bulk resumes to company' });
  }
};

// @desc    Update application status
// @route   PATCH /api/admin/applications/:id/status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Shortlisted', 'Reviewed', 'Hired', 'Rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid application status' });
      return;
    }

    const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application: {
        id: app._id.toString(),
        candidateName: app.candidateName,
        status: app.status,
      },
    });
  } catch (error: any) {
    console.error('updateApplicationStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update application status' });
  }
};

// @desc    Get subscription plans
// @route   GET /api/admin/plans
export const getAdminPlans = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    await seedInitialAdminData();

    const plans = await Plan.find({}).sort({ createdAt: 1 });
    res.json({ success: true, plans });
  } catch (error: any) {
    console.error('getAdminPlans error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve plans' });
  }
};

// @desc    Create a new subscription plan
// @route   POST /api/admin/plans
export const createAdminPlan = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const {
      name,
      price,
      yearlyPrice = '',
      billingCycle = 'monthly',
      features = [],
      credits = 50,
      status = 'Active',
    } = req.body;

    if (!name || !price) {
      res.status(400).json({ success: false, message: 'Name and price are required' });
      return;
    }

    const newPlan = await Plan.create({
      name,
      price,
      yearlyPrice,
      billingCycle,
      features,
      credits,
      status,
    });

    res.status(201).json({
      success: true,
      message: `Plan "${name}" created successfully`,
      plan: newPlan,
    });
  } catch (error: any) {
    console.error('createAdminPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to create plan' });
  }
};

// @desc    Update an existing plan
// @route   PUT /api/admin/plans/:id
export const updateAdminPlan = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const id = String(req.params.id);
    const { name, price, yearlyPrice, billingCycle, features, credits, status } = req.body;

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (yearlyPrice !== undefined) updateData.yearlyPrice = yearlyPrice;
    if (billingCycle !== undefined) updateData.billingCycle = billingCycle;
    if (features !== undefined) updateData.features = features;
    if (credits !== undefined) updateData.credits = credits;
    if (status !== undefined) updateData.status = status;

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPlan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.json({
      success: true,
      message: `Plan "${updatedPlan.name}" updated successfully`,
      plan: updatedPlan,
    });
  } catch (error: any) {
    console.error('updateAdminPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to update plan' });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/admin/plans/:id
export const deleteAdminPlan = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const id = String(req.params.id);

    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletedPlan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }

    res.json({
      success: true,
      message: `Plan "${deletedPlan.name}" deleted successfully`,
    });
  } catch (error: any) {
    console.error('deleteAdminPlan error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete plan' });
  }
};

// Global permissions settings store
let globalPermissionsSettings = {
  defaultPermissions: {
    profile: true,
    subscription: true,
    dashboard: false,
    jobs: false,
    applicants: false,
    resumes: false,
    settings: false,
  },
  autoApprovalEnabled: true,
  planRules: {
    'Basic Plan': {
      dashboard: false,
      jobs: true,
      applicants: true,
      resumes: false,
      settings: false,
    },
    'Pro Plan': {
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: true,
      settings: false,
    },
    'Enterprise': {
      dashboard: true,
      jobs: true,
      applicants: true,
      resumes: true,
      settings: true,
    },
  },
};

// Helper to find matching plan rule for a plan string
export const findMatchingPlanRule = (planName?: string, planRules: Record<string, any> = globalPermissionsSettings.planRules) => {
  if (!planName) return null;
  const p = planName.trim().toLowerCase();
  for (const [key, rule] of Object.entries(planRules)) {
    const k = key.trim().toLowerCase();
    if (p === k || p.includes(k) || k.includes(p)) {
      return rule;
    }
  }
  if (p.includes('starter') || p.includes('basic')) return planRules['Basic Plan'] || null;
  if (p.includes('growth') || p.includes('pro')) return planRules['Pro Plan'] || null;
  if (p.includes('enterprise')) return planRules['Enterprise'] || null;
  return null;
};

// @desc    Update company permissions manually (works with or without active subscription)
// @route   PATCH /api/admin/companies/:id/permissions
export const updateCompanyPermissions = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    await seedInitialAdminData();
    const id = String(req.params.id);
    const { permissions, email, name, companyName, plan } = req.body;

    let company = null;
    if (mongoose.isValidObjectId(id)) {
      company = await User.findById(id);
    }

    if (!company) {
      // Find by userId or customId (including c1 -> co01 mapping)
      const mappedCoId = id.replace(/^c(\d+)$/i, 'co0$1');
      company = await User.findOne({
        $or: [
          { userId: id },
          { customId: id },
          { userId: mappedCoId },
          { customId: mappedCoId },
        ],
      });
    }

    // Try finding by email
    if (!company && (email || req.query.email)) {
      const searchEmail = String(email || req.query.email).trim().toLowerCase();
      company = await User.findOne({
        $or: [
          { email: searchEmail },
          { workEmail: searchEmail },
        ],
      });
    }

    // Try finding by company name
    if (!company && (name || companyName || req.query.name)) {
      const searchName = String(name || companyName || req.query.name).trim();
      company = await User.findOne({
        $or: [
          { companyName: new RegExp(`^${searchName}$`, 'i') },
          { name: new RegExp(`^${searchName}$`, 'i') },
        ],
      });
    }

    // If company not in database yet (e.g. demo mock), upsert it directly
    if (!company) {
      const compName = name || companyName || `Company ${id}`;
      const compEmail = (email || `${id.toLowerCase()}@example.com`).toLowerCase();
      company = await User.create({
        userId: id,
        customId: id,
        email: compEmail,
        workEmail: compEmail,
        password: 'Password@123',
        role: 'company',
        companyName: compName,
        name: compName,
        location: 'India',
        status: 'Approved',
        plan: plan || '',
        permissions: {
          dashboard: false,
          jobs: false,
          applicants: false,
          resumes: false,
          settings: false,
          autoApproveFromSubscription: true,
          ...permissions,
        },
      });
    } else {
      if (plan && typeof plan === 'string') {
        company.plan = plan;
      }
      company.permissions = {
        dashboard: false,
        jobs: false,
        applicants: false,
        resumes: false,
        settings: false,
        autoApproveFromSubscription: true,
        ...(company.permissions || {}),
        ...permissions,
      };
      await company.save();
    }

    res.json({
      success: true,
      message: `Permissions updated successfully for ${company.companyName || company.name}`,
      permissions: company.permissions,
      plan: company.plan,
      company: {
        id: company._id.toString(),
        userId: company.userId || company.customId,
        name: company.companyName || company.name,
        plan: company.plan,
      },
    });
  } catch (error: any) {
    console.error('updateCompanyPermissions error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update company permissions' });
  }
};

// @desc    Get admin permissions settings & plan auto-approval rules
// @route   GET /api/admin/permissions-settings
export const getAdminPermissionsSettings = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const doc = await Settings.findOne({ key: 'global_permissions' });
    if (doc && doc.value) {
      globalPermissionsSettings = {
        ...globalPermissionsSettings,
        ...doc.value,
      };
    }
    res.json({ success: true, settings: globalPermissionsSettings });
  } catch (error: any) {
    console.error('getAdminPermissionsSettings error:', error);
    res.json({ success: true, settings: globalPermissionsSettings });
  }
};

// @desc    Update admin permissions settings & plan auto-approval rules
// @route   PUT /api/admin/permissions-settings
export const updateAdminPermissionsSettings = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { settings } = req.body;
    let updatedCompaniesCount = 0;

    if (settings) {
      globalPermissionsSettings = {
        ...globalPermissionsSettings,
        ...settings,
      };

      // Persist to MongoDB
      await Settings.findOneAndUpdate(
        { key: 'global_permissions' },
        { key: 'global_permissions', value: globalPermissionsSettings },
        { upsert: true, new: true }
      );

      // PROPAGATE: Update all company accounts whose subscriptions match the modified plan rules
      const planRules = globalPermissionsSettings.planRules || {};
      const companies = await User.find({ role: 'company' });

      for (const comp of companies) {
        // Skip if company manually opted out of subscription auto-approval
        if (comp.permissions?.autoApproveFromSubscription === false) {
          continue;
        }

        const compPlan = comp.plan || '';
        const matchedRule = findMatchingPlanRule(compPlan, planRules);

        if (matchedRule) {
          comp.permissions = {
            dashboard: false,
            jobs: false,
            applicants: false,
            resumes: false,
            settings: false,
            ...(comp.permissions || {}),
            ...matchedRule,
            autoApproveFromSubscription: true,
          };
          await comp.save();
          updatedCompaniesCount++;
        }
      }
    }

    res.json({
      success: true,
      message: `Global permissions updated and applied to ${updatedCompaniesCount} company subscriptions`,
      settings: globalPermissionsSettings,
      updatedCompaniesCount,
    });
  } catch (error: any) {
    console.error('updateAdminPermissionsSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update permissions settings' });
  }
};

