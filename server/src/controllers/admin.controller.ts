import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import { Plan } from '../models/plan.model.js';
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

// Seed initial dataset if database collections are empty
export const seedInitialAdminData = async () => {
  try {
    await ensureDBConnection();

    // 1. Check & seed companies
    const companiesCount = await User.countDocuments({ role: 'company' });
    if (companiesCount === 0) {
      const demoCompanies = [
        {
          userId: 'co01',
          customId: 'co01',
          email: 'hr@brightpath.io',
          password: 'Password@123',
          role: 'company' as const,
          companyName: 'BrightPath Technologies',
          name: 'BrightPath Technologies',
          workEmail: 'hr@brightpath.io',
          location: 'Bengaluru, India',
          industry: 'Software & Technology',
          status: 'Pending' as const,
          phone: '+91 98765 43210',
          gstNumber: '29ABCDE1234F1Z5',
        },
        {
          userId: 'co02',
          customId: 'co02',
          email: 'contact@skyline.co',
          password: 'Password@123',
          role: 'company' as const,
          companyName: 'Skyline Solutions',
          name: 'Skyline Solutions',
          workEmail: 'contact@skyline.co',
          location: 'Hyderabad, India',
          industry: 'Cloud Infrastructure',
          status: 'Pending' as const,
          phone: '+91 98765 43211',
          gstNumber: '36ABCDE1234F1Z6',
        },
        {
          userId: 'co03',
          customId: 'co03',
          email: 'careers@greenfield.in',
          password: 'Password@123',
          role: 'company' as const,
          companyName: 'GreenField Innovations',
          name: 'GreenField Innovations',
          workEmail: 'careers@greenfield.in',
          location: 'Pune, India',
          industry: 'Fintech & AI',
          status: 'Pending' as const,
          phone: '+91 98765 43212',
          gstNumber: '27ABCDE1234F1Z7',
        },
        {
          userId: 'co04',
          customId: 'co04',
          email: 'jobs@novatech.com',
          password: 'Password@123',
          role: 'company' as const,
          companyName: 'NovaTech Pvt Ltd',
          name: 'NovaTech Pvt Ltd',
          workEmail: 'jobs@novatech.com',
          location: 'Noida, India',
          industry: 'E-Commerce',
          status: 'Pending' as const,
          phone: '+91 98765 43213',
          gstNumber: '09ABCDE1234F1Z8',
        },
        {
          userId: 'co05',
          customId: 'co05',
          email: 'recruitment@google.com',
          password: 'Password@123',
          role: 'company' as const,
          companyName: 'Google Inc.',
          name: 'Google Inc.',
          workEmail: 'recruitment@google.com',
          location: 'Mountain View, USA & Remote',
          industry: 'Internet & Tech',
          status: 'Approved' as const,
          phone: '+1 650 253 0000',
        },
        {
          userId: 'co06',
          customId: 'co06',
          email: 'talent@microsoft.com',
          password: 'Password@123',
          role: 'company' as const,
          companyName: 'Microsoft',
          name: 'Microsoft',
          workEmail: 'talent@microsoft.com',
          location: 'Redmond, USA & India',
          industry: 'Cloud & Enterprise',
          status: 'Approved' as const,
          phone: '+1 425 882 8080',
        },
      ];

      for (const comp of demoCompanies) {
        await User.create(comp);
      }
    }

    // 2. Check & seed jobs
    const jobsCount = await Job.countDocuments();
    if (jobsCount === 0) {
      const demoJobs = [
        {
          title: 'Senior Full Stack Engineer',
          company: 'BrightPath Technologies',
          type: 'Full-Time • Remote',
          location: 'Bengaluru, KA',
          salary: '₹ 18 - 25 LPA',
          status: 'Active' as const,
          postedOn: 'Apr 24, 2025',
          applicantsCount: 64,
          department: 'Engineering',
        },
        {
          title: 'Lead UI/UX Designer',
          company: 'Skyline Solutions',
          type: 'Full-Time',
          location: 'Hyderabad, TS',
          salary: '₹ 14 - 20 LPA',
          status: 'Active' as const,
          postedOn: 'Apr 23, 2025',
          applicantsCount: 42,
          department: 'Design',
        },
        {
          title: 'Backend Go / Node Developer',
          company: 'NovaTech Pvt Ltd',
          type: 'Full-Time',
          location: 'Noida, UP',
          salary: '₹ 15 - 22 LPA',
          status: 'Pending' as const,
          postedOn: 'Apr 23, 2025',
          applicantsCount: 19,
          department: 'Engineering',
        },
        {
          title: 'Product Marketing Manager',
          company: 'GreenField Innovations',
          type: 'Contract',
          location: 'Pune, MH',
          salary: '₹ 10 - 15 LPA',
          status: 'Active' as const,
          postedOn: 'Apr 20, 2025',
          applicantsCount: 31,
          department: 'Marketing',
        },
        {
          title: 'Junior React Native Developer',
          company: 'BrightPath Technologies',
          type: 'Internship',
          location: 'Bengaluru, KA',
          salary: '₹ 35,000 / mo',
          status: 'Expired' as const,
          postedOn: 'Mar 10, 2025',
          applicantsCount: 118,
          department: 'Engineering',
        },
      ];
      await Job.insertMany(demoJobs);
    }

    // 3. Check & seed applications
    const appsCount = await Application.countDocuments();
    if (appsCount === 0) {
      const demoApplications = [
        {
          candidateName: 'Rahul Sharma',
          candidateEmail: 'rahul.s@example.com',
          avatarLetter: 'RS',
          avatarBg: 'bg-blue-600',
          position: 'Frontend Developer',
          company: 'NovaTech Pvt Ltd',
          appliedOn: 'Apr 24, 2025',
          status: 'New' as const,
        },
        {
          candidateName: 'Priya Singh',
          candidateEmail: 'priya.singh@example.com',
          avatarLetter: 'PS',
          avatarBg: 'bg-pink-600',
          position: 'UI/UX Designer',
          company: 'BrightPath Technologies',
          appliedOn: 'Apr 24, 2025',
          status: 'Shortlisted' as const,
        },
        {
          candidateName: 'Amit Verma',
          candidateEmail: 'amit.verma@example.com',
          avatarLetter: 'AV',
          avatarBg: 'bg-amber-600',
          position: 'Backend Developer',
          company: 'GreenField Innovations',
          appliedOn: 'Apr 23, 2025',
          status: 'Reviewed' as const,
        },
        {
          candidateName: 'Sneha Patel',
          candidateEmail: 'sneha.patel@example.com',
          avatarLetter: 'SP',
          avatarBg: 'bg-teal-600',
          position: 'Full Stack Developer',
          company: 'Skyline Solutions',
          appliedOn: 'Apr 23, 2025',
          status: 'New' as const,
        },
        {
          candidateName: 'Vikram Malhotra',
          candidateEmail: 'vikram.m@example.com',
          avatarLetter: 'VM',
          avatarBg: 'bg-indigo-600',
          position: 'DevOps Engineer',
          company: 'BrightPath Technologies',
          appliedOn: 'Apr 22, 2025',
          status: 'Hired' as const,
        },
      ];
      await Application.insertMany(demoApplications);
    }

    // 4. Check & seed subscription plans
    const plansCount = await Plan.countDocuments();
    if (plansCount === 0) {
      const demoPlans = [
        {
          name: 'Basic Plan',
          price: '₹ 4,999 / mo',
          billingCycle: 'monthly',
          features: ['5 Job Postings', 'Standard Listing', 'Basic Candidate Search'],
          credits: 20,
          status: 'Active' as const,
        },
        {
          name: 'Pro Plan',
          price: '₹ 12,999 / mo',
          billingCycle: 'monthly',
          features: ['25 Job Postings', 'Featured Badge', 'Advanced Filtering', '250 Resume Views'],
          credits: 250,
          status: 'Active' as const,
        },
        {
          name: 'Enterprise Plan',
          price: '₹ 34,999 / mo',
          billingCycle: 'monthly',
          features: ['Unlimited Jobs', 'Dedicated Account Manager', 'API Access', 'Custom Branding'],
          credits: 1000,
          status: 'Active' as const,
        },
      ];
      await Plan.insertMany(demoPlans);
    }
  } catch (err) {
    console.warn('Super Admin seed note:', err);
  }
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

    // Estimated Platform Revenue
    const revenueEst = approvedCompanies * 12999 + 45230;

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
      company = await User.findById(id);
    } else {
      company = await User.findOne({ $or: [{ userId: id }, { customId: id }, { _id: id }] });
    }

    if (!company) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    company.status = status;

    // Create notification for company admin upon status change
    if (status === 'Approved') {
      const approvalNotification = {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Company Verification Approved! 🎉',
        message: `Congratulations! Your company "${company.companyName || company.name}" has been approved by Super Admin. You can now purchase subscription plans and post jobs.`,
        type: 'approval',
        read: false,
        createdAt: new Date(),
      };
      if (!company.notifications) company.notifications = [];
      company.notifications.unshift(approvalNotification);
    } else if (status === 'Rejected') {
      const rejectNotification = {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Company Verification Rejected',
        message: `Your company verification request for "${company.companyName || company.name}" was rejected by Super Admin. Please review your company profile or contact support.`,
        type: 'rejection',
        read: false,
        createdAt: new Date(),
      };
      if (!company.notifications) company.notifications = [];
      company.notifications.unshift(rejectNotification);
    }

    await company.save();

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

    const formatted = apps.map((a) => ({
      id: a._id.toString(),
      candidateName: a.candidateName,
      candidateEmail: a.candidateEmail || '',
      avatarLetter: a.avatarLetter || getInitials(a.candidateName),
      avatarBg: a.avatarBg || getColorForName(a.candidateName),
      position: a.position,
      company: a.company,
      appliedOn: a.appliedOn || 'Recent',
      status: a.status,
      resumeUrl: a.resumeUrl || '',
    }));

    res.json({ success: true, applications: formatted });
  } catch (error: any) {
    console.error('getAdminApplications error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve applications' });
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

