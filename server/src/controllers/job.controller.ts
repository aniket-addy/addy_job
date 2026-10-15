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

    const formatted = jobs.map((j) => ({
      id: j._id.toString(),
      _id: j._id.toString(),
      title: j.title,
      company: j.company,
      companyId: j.companyId ? j.companyId.toString() : '',
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
    }));

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

    const formatted = {
      id: job._id.toString(),
      _id: job._id.toString(),
      title: job.title,
      company: job.company,
      companyId: job.companyId ? job.companyId.toString() : '',
      type: job.type,
      location: job.location,
      salary: job.salary,
      status: job.status,
      postedOn: job.postedOn || 'Recent',
      applicantsCount: job.applicantsCount || 0,
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
// @route   POST /api/jobs/:id/apply
export const applyToJob = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { id } = req.params;
    const {
      candidateName,
      candidateEmail,
      candidatePhone,
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
      position: job.title,
      company: job.company,
      appliedOn: 'Today',
      status: 'New',
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

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: appRecord,
    });
  } catch (error: any) {
    console.error('applyToJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/jobs/applied/candidate
export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const { email, candidateId } = req.query;

    if (!email && !candidateId) {
      res.json({ success: true, count: 0, applications: [] });
      return;
    }

    const query: any = {};
    if (email) {
      query.candidateEmail = new RegExp(`^${String(email).trim()}$`, 'i');
    } else if (candidateId) {
      query.candidateId = candidateId;
    }

    const { Application } = await import('../models/application.model.js');
    const apps = await Application.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: apps.length,
      applications: apps,
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
    const { company, companyId } = req.query;

    const { Application } = await import('../models/application.model.js');
    const { Job } = await import('../models/job.model.js');
    const { User } = await import('../models/user.model.js');

    const orConditions: any[] = [];
    if (company) {
      orConditions.push({ company: new RegExp(`^${String(company).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    }
    if (companyId) {
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

    const apps = await Application.find({ $or: orConditions }).sort({ createdAt: -1 });

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
        jobId: a.jobId ? a.jobId.toString() : '',
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
        status: a.status || 'Applied',
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

