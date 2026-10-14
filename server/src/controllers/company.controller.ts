import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { ensureDBConnection } from '../config/db.js';

const iconNames = ['Layers', 'Sparkles', 'Sprout', 'Globe', 'Boxes', 'Triangle'] as const;
const iconColors = [
  { iconBg: 'bg-blue-50 border-blue-100', color: 'text-blue-600', banner: 'from-slate-900 via-blue-950 to-indigo-900', accent: 'from-blue-600 to-indigo-700' },
  { iconBg: 'bg-rose-50 border-rose-100', color: 'text-rose-600', banner: 'from-slate-900 via-rose-950 to-pink-900', accent: 'from-rose-600 to-pink-700' },
  { iconBg: 'bg-emerald-50 border-emerald-100', color: 'text-emerald-600', banner: 'from-slate-900 via-emerald-950 to-teal-900', accent: 'from-emerald-600 to-teal-700' },
  { iconBg: 'bg-indigo-50 border-indigo-100', color: 'text-indigo-600', banner: 'from-slate-900 via-indigo-950 to-blue-900', accent: 'from-indigo-600 to-blue-700' },
  { iconBg: 'bg-purple-50 border-purple-100', color: 'text-purple-600', banner: 'from-slate-900 via-purple-950 to-indigo-900', accent: 'from-purple-600 to-indigo-700' },
  { iconBg: 'bg-cyan-50 border-cyan-100', color: 'text-cyan-600', banner: 'from-slate-900 via-cyan-950 to-sky-900', accent: 'from-cyan-600 to-sky-700' },
];

const getInitials = (n: string): string => {
  if (!n) return 'CO';
  const clean = n.trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

const getThemeForCompany = (name: string, id: string) => {
  let hash = 0;
  const str = (name || '') + (id || '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % iconColors.length;
  const iconIndex = Math.abs(hash) % iconNames.length;
  return {
    iconName: iconNames[iconIndex],
    ...iconColors[index],
  };
};

// @desc    Get all registered companies from MongoDB with their real active job counts
// @route   GET /api/companies
export const getCompanies = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();

    const { search, location, industry } = req.query;

    const query: Record<string, any> = {
      role: 'company',
    };

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { name: searchRegex },
        { industry: searchRegex },
        { location: searchRegex },
      ];
    }

    if (location && String(location).toLowerCase() !== 'all locations' && String(location).toLowerCase() !== 'all') {
      query.location = new RegExp(String(location).trim(), 'i');
    }

    if (industry && String(industry).toLowerCase() !== 'all industries' && String(industry).toLowerCase() !== 'all') {
      query.industry = new RegExp(String(industry).trim(), 'i');
    }

    const companyUsers = await User.find(query).sort({ createdAt: -1 });

    // Fetch all active jobs to aggregate count per company
    const activeJobs = await Job.find({ status: 'Active' });

    const formatted = companyUsers.map((u) => {
      const cName = u.companyName || u.name || 'Company';
      const cKey = cName.toLowerCase().trim();
      const idStr = u._id.toString();
      const customId = u.userId || u.customId || '';

      // Count all active jobs belonging to this company by ID or Name
      const matchingJobs = activeJobs.filter((j) => {
        if (j.companyId && (j.companyId.toString() === idStr || (customId && j.companyId.toString() === customId))) {
          return true;
        }
        if (j.company && j.company.toLowerCase().trim() === cKey) {
          return true;
        }
        return false;
      });

      const openRoles = matchingJobs.length;
      const theme = getThemeForCompany(cName, idStr);

      return {
        id: idStr,
        _id: idStr,
        customId: u.userId || u.customId || idStr,
        name: cName,
        tagline: u.industry || u.headline || 'Enterprise Software & Solutions',
        industry: u.industry || 'Technology & Software',
        location: u.location || 'Bengaluru, India',
        size: u.companySize || '50-200 employees',
        rating: 4.8,
        reviewsCount: '250',
        recommendRate: '95%',
        ceoApproval: '96%',
        followers: '12.5k',
        companyType: 'Private Enterprise',
        openRoles,
        about:
          u.bio ||
          `${cName} is an industry-leading organization building modern solutions, delivering high-impact services, and driving innovation.`,
        founded: '2020',
        website: u.workEmail ? u.workEmail.split('@')[1] || 'company.com' : 'company.com',
        gstNumber: u.gstNumber || '',
        phone: u.phone || '',
        email: u.workEmail || u.email || '',
        status: u.status || 'Approved',
        iconName: theme.iconName,
        iconBg: theme.iconBg,
        color: theme.color,
        accentColor: theme.accent,
        bannerGradient: theme.banner,
        initials: getInitials(cName),
        culture: [
          'Innovation-driven & collaborative environment',
          'Flexible & hybrid workplace culture',
          'Comprehensive health and learning benefits',
        ],
        perks: [
          'Health Insurance & Wellness programs',
          'Flexible working hours & remote options',
          'Annual performance bonuses & learning stipends',
        ],
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      companies: formatted,
    });
  } catch (error: any) {
    console.error('getCompanies error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve companies', error: error.message });
  }
};

// @desc    Get single company profile and ALL its real jobs from MongoDB
// @route   GET /api/companies/:id
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const id = String(req.params.id);

    let companyUser = null;

    if (mongoose.isValidObjectId(id)) {
      companyUser = await User.findById(id);
    }

    if (!companyUser) {
      // Find by customId / userId
      companyUser = await User.findOne({
        role: 'company',
        $or: [{ userId: id }, { customId: id }],
      });
    }

    if (!companyUser) {
      // Find by slug / company name
      const cleanName = id.replace(/-/g, ' ');
      companyUser = await User.findOne({
        role: 'company',
        $or: [
          { companyName: new RegExp(`^${cleanName}$`, 'i') },
          { name: new RegExp(`^${cleanName}$`, 'i') },
        ],
      });
    }

    if (!companyUser) {
      res.status(404).json({ success: false, message: 'Company not found' });
      return;
    }

    const cName = companyUser.companyName || companyUser.name || 'Company';
    const idStr = companyUser._id.toString();
    const theme = getThemeForCompany(cName, idStr);

    // Fetch all jobs posted by this company from MongoDB
    const jobs = await Job.find({
      $or: [
        { companyId: idStr },
        { companyId: companyUser.userId || companyUser.customId },
        { company: new RegExp(`^${cName}$`, 'i') },
      ],
      status: { $ne: 'Closed' },
    }).sort({ createdAt: -1 });

    const formattedJobs = jobs.map((j) => ({
      id: j._id.toString(),
      _id: j._id.toString(),
      title: j.title,
      company: j.company,
      companyId: idStr,
      type: j.type,
      location: j.location,
      salary: j.salary,
      status: j.status,
      postedOn: j.postedOn || 'Recent',
      applicantsCount: j.applicantsCount || 0,
      department: j.department || 'Engineering',
      category: j.department || 'Engineering',
      workplace: j.workplace || 'Hybrid',
      experience: j.experience || '1-3 years',
      skills: j.skills || [],
      tags: j.tags && j.tags.length > 0 ? j.tags : j.skills || [],
      openings: j.openings || 1,
      postedBy: j.postedBy || cName,
      description: j.description || '',
      responsibilities: j.responsibilities || [],
      requirements: j.requirements || [],
      benefits: j.benefits || [],
      createdAt: j.createdAt,
    }));

    const formattedCompany = {
      id: idStr,
      _id: idStr,
      customId: companyUser.userId || companyUser.customId || idStr,
      name: cName,
      tagline: companyUser.industry || companyUser.headline || 'Enterprise Software & Solutions',
      industry: companyUser.industry || 'Technology & Software',
      location: companyUser.location || 'India',
      size: companyUser.companySize || '50-200 employees',
      rating: 4.8,
      reviewsCount: '250',
      recommendRate: '95%',
      ceoApproval: '96%',
      followers: '12.5k',
      companyType: 'Private Enterprise',
      openRoles: formattedJobs.filter((j) => j.status === 'Active').length,
      about:
        companyUser.bio ||
        `${cName} is an industry-leading organization building modern solutions, delivering high-impact services, and driving innovation.`,
      founded: '2020',
      website: companyUser.workEmail ? companyUser.workEmail.split('@')[1] || 'company.com' : 'company.com',
      gstNumber: companyUser.gstNumber || '',
      phone: companyUser.phone || '',
      email: companyUser.workEmail || companyUser.email || '',
      status: companyUser.status || 'Approved',
      iconName: theme.iconName,
      iconBg: theme.iconBg,
      color: theme.color,
      accentColor: theme.accent,
      bannerGradient: theme.banner,
      initials: getInitials(cName),
      culture: [
        'Innovation-driven & collaborative environment',
        'Flexible & hybrid workplace culture',
        'Comprehensive health and learning benefits',
      ],
      perks: [
        'Health Insurance & Wellness programs',
        'Flexible working hours & remote options',
        'Annual performance bonuses & learning stipends',
      ],
    };

    res.json({
      success: true,
      company: formattedCompany,
      jobs: formattedJobs,
    });
  } catch (error: any) {
    console.error('getCompanyById error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve company details', error: error.message });
  }
};
