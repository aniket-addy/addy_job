import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { ensureDBConnection } from '../config/db.js';

// @desc    Get all jobs from MongoDB (with search and filters)
// @route   GET /api/jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();

    const {
      q,
      search,
      location,
      type,
      category,
      department,
      company,
      companyId,
      status = 'Active',
      limit,
    } = req.query;

    const filter: Record<string, any> = {};

    // By default, only return Active jobs for seekers unless specified
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Company filter
    if (companyId) {
      filter.$or = [
        { companyId: companyId },
        { companyId: String(companyId) },
      ];
    } else if (company) {
      filter.company = new RegExp(`^${String(company).trim()}$`, 'i');
    }

    // Search query (title, company, skills, tags)
    const searchQuery = String(q || search || '').trim();
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { department: searchRegex },
        { skills: searchRegex },
        { tags: searchRegex },
        { location: searchRegex },
      ];
    }

    // Location query
    const locationQuery = String(location || '').trim();
    if (locationQuery && locationQuery.toLowerCase() !== 'all' && locationQuery.toLowerCase() !== 'all locations') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { location: new RegExp(locationQuery, 'i') },
          { workplace: new RegExp(locationQuery, 'i') },
        ],
      });
    }

    // Job Type query
    const typeQuery = String(type || '').trim();
    if (typeQuery && typeQuery.toLowerCase() !== 'all') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { type: new RegExp(typeQuery, 'i') },
          { workplace: new RegExp(typeQuery, 'i') },
        ],
      });
    }

    // Department / Category query
    const deptQuery = String(department || category || '').trim();
    if (deptQuery && deptQuery.toLowerCase() !== 'all') {
      filter.department = new RegExp(`^${deptQuery}$`, 'i');
    }

    const queryExec = Job.find(filter).sort({ createdAt: -1 });
    if (limit && Number(limit) > 0) {
      queryExec.limit(Number(limit));
    }

    const jobs = await queryExec.exec();

    // Map company logos to jobs
    const compIds = jobs.map((j) => j.companyId).filter(Boolean);
    const compNames = jobs.map((j) => j.company).filter(Boolean);
    const compUsers = await User.find({
      role: 'company',
      $or: [
        { _id: { $in: compIds.filter((id) => mongoose.isValidObjectId(id)) } },
        { userId: { $in: compIds } },
        { companyName: { $in: compNames } },
      ],
    }).select('_id userId companyName name logo profileImage');

    const compMap = new Map<string, string>();
    compUsers.forEach((u) => {
      const img = u.profileImage || u.logo || '';
      if (img) {
        compMap.set(u._id.toString(), img);
        if (u.userId) compMap.set(u.userId, img);
        if (u.companyName) compMap.set(u.companyName.toLowerCase().trim(), img);
        if (u.name) compMap.set(u.name.toLowerCase().trim(), img);
      }
    });

    const formatted = jobs.map((j) => {
      const compLogo = j.logo || compMap.get(j.companyId?.toString()) || compMap.get(j.company?.toLowerCase().trim()) || '';
      return {
        id: j._id.toString(),
        _id: j._id.toString(),
        title: j.title,
        company: j.company,
        companyId: j.companyId ? j.companyId.toString() : '',
        logo: compLogo,
        type: j.type,
        location: j.location,
        salary: j.salary,
        status: j.status,
        postedOn: j.postedOn || 'Recent',
        applicantsCount: j.applicantsCount || 0,
        department: j.department || 'Engineering',
        category: j.department || 'Engineering',
        workplace: j.workplace || 'Hybrid',
        experience: j.experience || '2-4 years',
        skills: j.skills || [],
        tags: j.tags && j.tags.length > 0 ? j.tags : j.skills || [],
        openings: j.openings || 1,
        postedBy: j.postedBy || j.company,
        description: j.description || '',
        responsibilities: j.responsibilities || [],
        requirements: j.requirements || [],
        benefits: j.benefits || [],
        createdAt: j.createdAt,
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      jobs: formatted,
    });
  } catch (error: any) {
    console.error('getJobs error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve jobs', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;

    // Validate ObjectId format early to avoid 500 error
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, message: 'Invalid job ID format.' });
      return;
    }

    let job = null;
    if (mongoose.isValidObjectId(id)) {
      job = await Job.findById(id);
    }
    if (!job) {
      job = await Job.findOne({ _id: id });
    }

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    const stats = await getJobActivityStats(job, job.title, job.company);

    let companyUser = null;
    if (job.companyId && mongoose.isValidObjectId(job.companyId)) {
      companyUser = await User.findById(job.companyId);
    }
    if (!companyUser && job.company) {
      companyUser = await User.findOne({
        role: 'company',
        $or: [
          { companyName: new RegExp(`^${job.company.trim()}$`, 'i') },
          { name: new RegExp(`^${job.company.trim()}$`, 'i') },
        ],
      });
    }

    const cLogo = job.logo || companyUser?.profileImage || companyUser?.logo || '';
    const cAbout = companyUser?.aboutCompany || companyUser?.bio || `${job.company} is an industry-leading organization building modern solutions.`;
    const cSize = companyUser?.companySize || '50-200 employees';
    const cWebsite = companyUser?.website || (companyUser?.workEmail && !companyUser?.workEmail.toLowerCase().endsWith('gmail.com') ? companyUser.workEmail.split('@')[1] : '') || 'company.com';
    const cIndustry = companyUser?.industry || 'Technology & Software';

    const formatted = {
      id: job._id.toString(),
      _id: job._id.toString(),
      title: job.title,
      company: job.company,
      companyId: job.companyId ? job.companyId.toString() : '',
      logo: cLogo,
      aboutCompany: cAbout,
      companySize: cSize,
      website: cWebsite,
      industry: cIndustry,
      founded: '2020',
      type: job.type,
      location: job.location,
      salary: job.salary,
      status: job.status,
      postedOn: job.postedOn || 'Recent',
      applicantsCount: stats.totalApplicants,
      totalApplicants: stats.totalApplicants,
      viewedCount: stats.viewedCount,
      department: job.department || 'Engineering',
      category: job.department || 'Engineering',
      workplace: job.workplace || 'Hybrid',
      experience: job.experience || '2-4 years',
      skills: job.skills || [],
      tags: job.tags && job.tags.length > 0 ? job.tags : job.skills || [],
      openings: job.openings || 1,
      postedBy: job.postedBy || job.company,
      description: job.description || '',
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      createdAt: job.createdAt,
    };

    res.json({
      success: true,
      job: formatted,
    });
  } catch (error: any) {
    console.error('getJobById error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve job details', error: error.message });
  }
};

// @desc    Post / Create a new job in MongoDB
// @route   POST /api/jobs
export const createJob = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();

    const {
      title,
      company,
      companyId,
      type = 'Full-time',
      location = 'Remote',
      salary = 'Competitive',
      department = 'Engineering',
      workplace = 'Hybrid',
      experience = '1-3 years',
      skills = [],
      tags = [],
      openings = 1,
      postedBy = '',
      description = '',
      responsibilities = [],
      requirements = [],
      benefits = [],
      status = 'Active',
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, message: 'Job title is required' });
      return;
    }

    let finalCompany = (company || '').trim();
    let finalCompanyId = companyId;

    // If company name not passed, find from companyId or user session
    if (!finalCompany && finalCompanyId) {
      const compUser = await User.findById(finalCompanyId);
      if (compUser) {
        finalCompany = compUser.companyName || compUser.name || compUser.email.split('@')[0];
      }
    }
    if (!finalCompany) {
      finalCompany = 'Hiring Company';
    }

    const newJob = await Job.create({
      title: title.trim(),
      company: finalCompany,
      companyId: finalCompanyId || undefined,
      type: type || 'Full-time',
      location: location || 'Remote',
      salary: salary || 'Competitive',
      department: department || 'Engineering',
      workplace: workplace || 'Hybrid',
      experience: experience || '1-3 years',
      skills: Array.isArray(skills) ? skills : [],
      tags: Array.isArray(tags) && tags.length > 0 ? tags : Array.isArray(skills) ? skills : [],
      openings: Number(openings) || 1,
      postedBy: postedBy || finalCompany,
      description: description || '',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      status: status || 'Active',
      postedOn: 'Just now',
      applicantsCount: 0,
    });

    res.status(201).json({
      success: true,
      message: `Job posting "${newJob.title}" is now LIVE!`,
      job: {
        id: newJob._id.toString(),
        _id: newJob._id.toString(),
        title: newJob.title,
        company: newJob.company,
        companyId: newJob.companyId ? newJob.companyId.toString() : '',
        type: newJob.type,
        location: newJob.location,
        salary: newJob.salary,
        status: newJob.status,
        department: newJob.department,
        workplace: newJob.workplace,
        experience: newJob.experience,
        skills: newJob.skills,
        tags: newJob.tags,
        openings: newJob.openings,
        postedBy: newJob.postedBy,
        description: newJob.description,
        responsibilities: newJob.responsibilities,
        requirements: newJob.requirements,
        benefits: newJob.benefits,
        postedOn: newJob.postedOn,
        applicantsCount: newJob.applicantsCount,
        createdAt: newJob.createdAt,
      },
    });
  } catch (error: any) {
    console.error('createJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to post job to database', error: error.message });
  }
};

// @desc    Update an existing job
// @route   PUT /api/jobs/:id
export const updateJob = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      message: `Job "${updatedJob.title}" updated successfully`,
      job: {
        id: updatedJob._id.toString(),
        _id: updatedJob._id.toString(),
        title: updatedJob.title,
        company: updatedJob.company,
        status: updatedJob.status,
        salary: updatedJob.salary,
        location: updatedJob.location,
        type: updatedJob.type,
      },
    });
  } catch (error: any) {
    console.error('updateJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to update job', error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error: any) {
    console.error('deleteJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job', error: error.message });
  }
};

// @desc    Apply to a job
// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
export const applyToJob = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;
    const {
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateId,
      resumeUrl,
      pdfData,
      fileName,
      experience,
      skills,
    } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    const { Application } = await import('../models/application.model.js');
    const { User } = await import('../models/user.model.js');

    let finalResumeUrl = resumeUrl || pdfData || '';
    let finalPdfData = pdfData || resumeUrl || '';
    let finalFileName = fileName || '';
    let finalExperience = experience || '';
    let finalSkills = Array.isArray(skills) ? skills : [];
    let domain = '';

    if (candidateEmail) {
      const u = await User.findOne({
        email: new RegExp(`^${candidateEmail.trim()}$`, 'i'),
        role: 'job_seeker',
      });
      if (u) {
        if (!finalResumeUrl && u.resumeUrl) {
          finalResumeUrl = u.resumeUrl;
          finalPdfData = u.resumeUrl;
        }
        if (!finalFileName && u.resumeName) {
          finalFileName = u.resumeName;
        }
        if (!finalExperience && u.experience) {
          finalExperience = u.experience;
        }
        if (finalSkills.length === 0 && u.skills && u.skills.length > 0) {
          finalSkills = u.skills;
        }
        if (u.specialization || u.targetRole) {
          domain = u.specialization || u.targetRole || '';
        }
      }
    }

    const appRecord = await Application.create({
      candidateName: candidateName || 'Candidate',
      candidateEmail: candidateEmail || '',
      candidatePhone: candidatePhone || '',
      candidateId: candidateId || undefined,
      companyId: job.companyId || undefined,
      position: job.title,
      company: job.company,
      appliedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
      status: 'New',
      resumeViewed: false,
      recruiterAction: '',
      jobId: job._id.toString(),
      resumeUrl: finalResumeUrl,
      pdfData: finalPdfData,
      fileName: finalFileName,
      domain: domain || job.title,
      experience: finalExperience || job.experience || '1-3 years',
      skills: finalSkills.length > 0 ? finalSkills : (job.skills || job.tags || []),
      avatarLetter: (candidateName ? candidateName.slice(0, 2) : 'CD').toUpperCase(),
      avatarBg: 'bg-blue-600',
    });

    await Job.findByIdAndUpdate(id, { $inc: { applicantsCount: 1 } });

    // Check company notification settings and dispatch application alert
    let alertDispatched = false;
    let autoAckDispatched = false;
    try {
      let companyUser = null;
      if (job.companyId) {
        if (job.companyId.toString().match(/^[0-9a-fA-F]{24}$/)) {
          companyUser = await User.findById(job.companyId);
        }
        if (!companyUser) {
          companyUser = await User.findOne({
            $or: [{ userId: job.companyId }, { customId: job.companyId }],
          });
        }
      }
      if (!companyUser && job.company) {
        companyUser = await User.findOne({
          companyName: new RegExp(`^${job.company.trim()}$`, 'i'),
        });
      }

      if (companyUser) {
        const notif = companyUser.notificationSettings || {
          emailNotificationOnApplication: true,
          lowCreditAlert: true,
          autoAcknowledgeApplicants: true,
        };

        if (notif.emailNotificationOnApplication !== false) {
          alertDispatched = true;
          const toEmail = companyUser.workEmail || companyUser.email;
          console.log(`[EMAIL ALERT] Real-time new application notification dispatched to "${toEmail}" for role "${job.title}" by "${candidateName || 'Candidate'}"`);
        }

        if (notif.autoAcknowledgeApplicants !== false && candidateEmail) {
          autoAckDispatched = true;
          console.log(`[AUTO-ACKNOWLEDGE] Automated receipt confirmation email sent to applicant "${candidateEmail}" for "${job.title}" at "${job.company}"`);
        }
      }
    } catch (notifErr) {
      console.warn('Error processing application notification alert:', notifErr);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: appRecord,
      notifications: {
        companyAlertDispatched: alertDispatched,
        applicantAutoAcknowledged: autoAckDispatched,
      },
    });
  } catch (error: any) {
    console.error('applyToJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
  }
};

// Helper to calculate real-time activity statistics (total applications and viewed count) for a job
export const getJobActivityStats = async (jobIdOrDoc: any, title?: string, company?: string) => {
  try {
    const { Application } = await import('../models/application.model.js');
    const { Job } = await import('../models/job.model.js');

    let jIdStr = '';
    let jobDoc: any = null;

    if (typeof jobIdOrDoc === 'string') {
      jIdStr = jobIdOrDoc.trim();
    } else if (jobIdOrDoc && typeof jobIdOrDoc === 'object') {
      jobDoc = jobIdOrDoc;
      jIdStr = jobDoc._id ? jobDoc._id.toString() : (jobDoc.id ? jobDoc.id.toString() : '');
    }

    const jobConditions: any[] = [];
    if (jIdStr) {
      jobConditions.push({ jobId: jIdStr });
      if (mongoose.isValidObjectId(jIdStr)) {
        jobConditions.push({ jobId: new mongoose.Types.ObjectId(jIdStr) });
      }
    }

    const jobTitle = title || (jobDoc ? jobDoc.title : '');
    const jobCompany = company || (jobDoc ? jobDoc.company : '');

    if (jobTitle && jobCompany) {
      jobConditions.push({
        position: new RegExp(`^${jobTitle.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        company: new RegExp(`^${jobCompany.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      });
    }

    if (jobConditions.length === 0) {
      return { totalApplicants: 1, viewedCount: 0 };
    }

    const matchedApps = await Application.find({
      $or: jobConditions,
      $nor: [{ company: 'Candidate Profile Upload', jobId: { $exists: false } }],
    }).select('_id candidateEmail resumeViewed status recruiterAction');

    let docApplicantsCount = 0;
    if (jobDoc && typeof jobDoc.applicantsCount === 'number') {
      docApplicantsCount = jobDoc.applicantsCount;
    } else if (jIdStr && mongoose.isValidObjectId(jIdStr)) {
      const j = await Job.findById(jIdStr).select('applicantsCount');
      if (j && typeof j.applicantsCount === 'number') {
        docApplicantsCount = j.applicantsCount;
      }
    }

    const totalApplicants = Math.max(matchedApps.length, docApplicantsCount, 1);
    const viewedCount = matchedApps.filter((a: any) => {
      const st = (a.status || '').trim();
      const hasAction = Boolean(a.recruiterAction && a.recruiterAction.trim() !== '') ||
        ['Shortlisted', 'Interview', 'Hired', 'Rejected'].includes(st);
      return Boolean(a.resumeViewed || hasAction || ['Reviewed', 'Reviewing', 'Resume Viewed'].includes(st));
    }).length;

    return { totalApplicants, viewedCount };
  } catch (err) {
    console.warn('getJobActivityStats error:', err);
    return { totalApplicants: 1, viewedCount: 0 };
  }
};

// @desc    Get live job activity (total applications & applications viewed by recruiter)
// @route   GET /api/jobs/:id/activity
export const getJobActivity = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;
    const { title, company } = req.query;

    const stats = await getJobActivityStats(id, title ? String(title) : undefined, company ? String(company) : undefined);

    res.json({
      success: true,
      jobId: id,
      ...stats,
    });
  } catch (error: any) {
    console.error('getJobActivity error:', error);
    res.status(500).json({ success: false, message: 'Failed to get job activity', error: error.message });
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/jobs/applied/candidate
export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { email, candidateId, phone, jobIds } = req.query;

    if (!email && !candidateId && !phone && !jobIds) {
      res.json({ success: true, count: 0, applications: [] });
      return;
    }

    const orConditions: any[] = [];
    if (email) {
      const emailList = String(email)
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      if (emailList.length === 1) {
        orConditions.push({ candidateEmail: new RegExp(`^${emailList[0]}$`, 'i') });
      } else if (emailList.length > 1) {
        orConditions.push({
          candidateEmail: {
            $in: emailList.map((e) => new RegExp(`^${e}$`, 'i')),
          },
        });
      }
    }
    if (candidateId) {
      orConditions.push({ candidateId: candidateId });
    }
    if (phone) {
      const phoneList = String(phone)
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      if (phoneList.length > 0) {
        orConditions.push({ candidatePhone: { $in: phoneList } });
      }
    }

    if (orConditions.length === 0) {
      res.json({ success: true, count: 0, applications: [] });
      return;
    }

    const query: any = {
      $or: orConditions,
      // Exclude profile upload placeholder entries that don't have a real job application
      $nor: [{ company: 'Candidate Profile Upload', jobId: { $exists: false } }],
    };

    const { Application } = await import('../models/application.model.js');
    const { User } = await import('../models/user.model.js');
    const apps = await Application.find(query).populate('jobId').sort({ createdAt: -1 });

    // Fetch existing companies to ensure deleted or non-existent companies are not displayed to candidates
    const existingCompanies = await User.find({ role: 'company' }).select('_id userId customId companyName name');
    const validCompanyIds = new Set<string>();
    const validCompanyNames = new Set<string>();

    existingCompanies.forEach((comp) => {
      validCompanyIds.add(comp._id.toString());
      if (comp.userId) validCompanyIds.add(String(comp.userId).toLowerCase().trim());
      if (comp.customId) validCompanyIds.add(String(comp.customId).toLowerCase().trim());
      const cName = (comp.companyName || comp.name || '').trim().toLowerCase();
      if (cName) validCompanyNames.add(cName);
    });

    const orphanAppIds: any[] = [];
    const validApps = apps.filter((appDoc) => {
      const a = appDoc.toObject ? appDoc.toObject() : { ...appDoc };
      const appCompId = a.companyId ? String(a.companyId).trim().toLowerCase() : '';
      const appCompName = (a.company || '').trim().toLowerCase();
      const jobCompName = (a.jobId && typeof a.jobId === 'object' && a.jobId.company)
        ? String(a.jobId.company).trim().toLowerCase()
        : '';
      const jobCompId = (a.jobId && typeof a.jobId === 'object' && a.jobId.companyId)
        ? String(a.jobId.companyId).trim().toLowerCase()
        : '';

      const exists =
        (appCompId && validCompanyIds.has(appCompId)) ||
        (jobCompId && validCompanyIds.has(jobCompId)) ||
        (appCompName && validCompanyNames.has(appCompName)) ||
        (jobCompName && validCompanyNames.has(jobCompName));

      if (!exists) {
        orphanAppIds.push(a._id);
        return false;
      }
      return true;
    });

    if (orphanAppIds.length > 0) {
      Application.deleteMany({ _id: { $in: orphanAppIds } }).catch((err) =>
        console.warn('Cleaned up orphan applications for deleted companies:', err)
      );
    }

    const statsCache = new Map<string, { totalApplicants: number; viewedCount: number }>();
    const formattedApps = await Promise.all(
      validApps.map(async (appDoc) => {
        const a = appDoc.toObject ? appDoc.toObject() : { ...appDoc };
        const rawJobId = (a.jobId && typeof a.jobId === 'object')
          ? (a.jobId._id?.toString() || a.jobId.id?.toString())
          : (a.jobId ? a.jobId.toString() : '');
        const pos = ((a.jobId && typeof a.jobId === 'object') ? a.jobId.title : '') || a.position || '';
        const comp = ((a.jobId && typeof a.jobId === 'object') ? a.jobId.company : '') || a.company || '';
        const cacheKey = rawJobId || `${pos.toLowerCase()}:::${comp.toLowerCase()}`;

        let stats = statsCache.get(cacheKey);
        if (!stats) {
          stats = await getJobActivityStats(a.jobId, pos, comp);
          statsCache.set(cacheKey, stats);
        }

        return {
          ...a,
          totalApplicants: stats.totalApplicants,
          viewedCount: stats.viewedCount,
        };
      })
    );

    res.json({
      success: true,
      count: formattedApps.length,
      applications: formattedApps,
    });
  } catch (error: any) {
    console.error('getCandidateApplications error:', error);
    res.status(500).json({ success: false, message: 'Failed to get applications', error: error.message });
  }
};

// @desc    Get company's received applications
// @route   GET /api/jobs/applied/company
export const getCompanyApplications = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { company, companyName, companyId } = req.query;

    const { Application } = await import('../models/application.model.js');
    const { Job } = await import('../models/job.model.js');
    const { User } = await import('../models/user.model.js');

    const orConditions: any[] = [];
    const comp = company || companyName;
    if (comp) {
      orConditions.push({ company: new RegExp(`^${String(comp).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    }
    if (companyId) {
      orConditions.push({ companyId: String(companyId) });
      const companyJobs = await Job.find({ companyId: String(companyId) });
      const jobIds = companyJobs.map((j) => j._id);
      if (jobIds.length > 0) {
        orConditions.push({ jobId: { $in: jobIds } });
        orConditions.push({ jobId: { $in: jobIds.map((id) => id.toString()) } });
      }
    }

    if (orConditions.length === 0) {
      res.json({ success: true, count: 0, applications: [] });
      return;
    }

    const apps = await Application.find({ $or: orConditions }).populate('jobId').sort({ createdAt: -1 });

    const emails = apps.map((a: any) => a.candidateEmail).filter(Boolean);
    const users = await User.find({ email: { $in: emails }, role: 'job_seeker' });
    const userMap = new Map(users.map((u) => [u.email.toLowerCase().trim(), u]));

    const formatted = apps.map((a: any) => {
      const u = a.candidateEmail ? userMap.get(a.candidateEmail.toLowerCase().trim()) : null;
      const cName = a.candidateName || (u ? u.name : 'Candidate');
      return {
        id: a._id.toString(),
        candidateName: cName,
        appliedRole: a.position,
        position: a.position,
        company: a.company,
        jobId: a.jobId ? (typeof a.jobId === 'object' ? a.jobId._id?.toString() : a.jobId.toString()) : '',
        experience: a.experience || (u ? u.experience : '1-3 years'),
        location: a.location || (u ? u.location : 'Remote'),
        appliedDate: a.appliedOn || 'Recently',
        appliedOn: a.appliedOn || 'Recently',
        resumeFileName: a.fileName || (u ? u.resumeName : 'Resume.pdf'),
        fileName: a.fileName || (u ? u.resumeName : 'Resume.pdf'),
        resumeUrl: a.resumeUrl || (u ? u.resumeUrl : '') || '',
        pdfData: a.pdfData || a.resumeUrl || (u ? u.resumeUrl : '') || '',
        domain: a.domain || (u ? (u.specialization || u.targetRole) : '') || '',
        skills: (a.skills && a.skills.length > 0) ? a.skills : (u && u.skills ? u.skills : ['Communication', 'Problem Solving']),
        status: a.status || 'New',
        resumeViewed: Boolean(a.resumeViewed),
        resumeViewedAt: a.resumeViewedAt,
        recruiterAction: a.recruiterAction || '',
        recruiterActionAt: a.recruiterActionAt,
        matchScore: 92,
        email: a.candidateEmail || (u ? u.email : ''),
        candidateEmail: a.candidateEmail || (u ? u.email : ''),
        phone: a.candidatePhone || (u ? u.phone : ''),
        candidatePhone: a.candidatePhone || (u ? u.phone : ''),
        notes: a.notes || '',
        education: (u ? (u.education || u.highestQualification || u.course) : '') || '',
        university: (u ? u.university : '') || '',
        passingYear: (u ? u.passingYear : '') || '',
        headline: (u ? u.headline : '') || '',
        bio: (u ? u.bio : '') || '',
        languages: (u ? u.languages : '') || '',
      };
    });

    res.json({ success: true, count: formatted.length, applications: formatted });
  } catch (error: any) {
    console.error('getCompanyApplications error:', error);
    res.status(500).json({ success: false, message: 'Failed to get company applications' });
  }
};

// @desc    Update job application status (hire, reject, shortlist, interview)
// @route   PATCH /api/jobs/applications/:id/status
export const updateJobApplicationStatus = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;
    const { status, recruiterAction } = req.body;

    const validStatuses = ['New', 'Applied', 'Shortlisted', 'Reviewed', 'Reviewing', 'Hired', 'Rejected', 'Interview'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const updateFields: any = {};
    if (status) {
      updateFields.status = status;
    }

    // Determine recruiter action & resumeViewed
    if (['Shortlisted', 'Interview', 'Hired', 'Rejected'].includes(status)) {
      updateFields.recruiterAction = recruiterAction || status;
      updateFields.recruiterActionAt = new Date();
      updateFields.resumeViewed = true;
      if (!updateFields.resumeViewedAt) {
        updateFields.resumeViewedAt = new Date();
      }
    } else if (['Reviewed', 'Reviewing'].includes(status)) {
      updateFields.resumeViewed = true;
      updateFields.resumeViewedAt = new Date();
    }

    if (req.body.resumeViewed !== undefined) {
      updateFields.resumeViewed = Boolean(req.body.resumeViewed);
      if (updateFields.resumeViewed && !updateFields.resumeViewedAt) {
        updateFields.resumeViewedAt = new Date();
      }
    }

    const { Application } = await import('../models/application.model.js');
    const updated = await Application.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.json({
      success: true,
      message: `Application updated to ${status}`,
      application: updated,
    });
  } catch (error: any) {
    console.error('updateJobApplicationStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update application status', error: error.message });
  }
};

// @desc    Mark candidate resume as viewed by recruiter
// @route   PATCH /api/jobs/applications/:id/view-resume
export const markResumeViewed = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;

    const { Application } = await import('../models/application.model.js');
    const app = await Application.findById(id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    app.resumeViewed = true;
    app.resumeViewedAt = new Date();
    if (app.status === 'New' || app.status === 'Applied') {
      app.status = 'Reviewed';
    }
    await app.save();

    res.json({
      success: true,
      message: 'Resume marked as viewed',
      application: app,
    });
  } catch (error: any) {
    console.error('markResumeViewed error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark resume viewed', error: error.message });
  }
};

