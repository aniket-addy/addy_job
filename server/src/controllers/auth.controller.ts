import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model.js';
import { UserCredential } from '../models/credential.model.js';
import { UserProfile } from '../models/profile.model.js';
import { Application } from '../models/application.model.js';
import { ensureDBConnection } from '../config/db.js';
import {
  getNextCustomUserId,
  saveAuthToFile,
  saveProfileToFile,
} from '../utils/databaseStorage.js';
import { findMatchingPlanRule } from './admin.controller.js';

const JWT_SECRET = process.env.JWT_SECRET || 'addy_job_jwt_secret_super_secure_key_2025';

// Helper to generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId || user.customId,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const getInitials = (name: string): string => {
  if (!name) return 'CD';
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

// Format user object to return without password
const formatUser = (user: IUser) => {
  return {
    id: user._id,
    userId: user.userId || user.customId || (user.role === 'company' ? 'C102600001' : 'JS102600001'),
    customId: user.customId || user.userId || (user.role === 'company' ? 'C102600001' : 'JS102600001'),
    email: user.email,
    role: user.role,
    name: user.name || (user.role === 'company' ? user.companyName : user.userId || 'Candidate'),
    headline: user.headline || user.targetRole || '',
    bio: user.bio || '',
    languages: user.languages || '',
    targetRole: user.targetRole || '',
    experience: user.experience || '',
    education: user.education || user.course || '',
    highestQualification: user.highestQualification || '',
    course: user.course || user.education || '',
    courseType: user.courseType || '',
    specialization: user.specialization || '',
    university: user.university || '',
    startingYear: user.startingYear || '',
    passingYear: user.passingYear || '',
    gradingSystem: user.gradingSystem || '',
    gradeScore: user.gradeScore || '',
    skills: user.skills || [],
    workStatus: user.workStatus || '',
    preferredLocation: user.preferredLocation || '',
    expectedSalary: user.expectedSalary || '',
    resumeName: user.resumeName || '',
    resumeDate: user.resumeDate || '',
    resumeUrl: user.resumeUrl || '',
    appliedJobsCount: user.appliedJobsCount ?? 0,
    savedJobsCount: user.savedJobsCount ?? 0,
    interviewsCount: user.interviewsCount ?? 0,
    profileViewsCount: user.profileViewsCount ?? 0,
    companyName: user.companyName || '',
    workEmail: user.workEmail || '',
    industry: user.industry || '',
    companySize: user.companySize || '',
    location: user.location || '',
    phone: user.phone || '',
    gstNumber: user.gstNumber || '',
    tagline: user.tagline || '',
    website: user.website || '',
    aboutCompany: user.aboutCompany || '',
    logo: user.logo || user.profileImage || '',
    profileImage: user.profileImage || user.logo || '',
    bannerImage: user.bannerImage || '',
    culture: user.culture || [],
    perks: user.perks || [],
    status: user.status || 'Pending',
    plan: user.plan || '',
    permissions: user.permissions || {
      dashboard: false,
      jobs: false,
      applicants: false,
      resumes: false,
      settings: false,
      autoApproveFromSubscription: true,
    },
    purchasedResumes: user.purchasedResumes || [],
    resumeCredits: user.resumeCredits ?? 0,
    resumesUsed: user.resumesUsed ?? 0,
    createdAt: user.createdAt,
  };
};

// @desc    Register a new user (Candidate or Company)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      role = 'job_seeker',
      // Candidate fields
      fullName,
      name,
      targetRole,
      experience,
      highestQualification,
      course,
      courseType,
      specialization,
      university,
      startingYear,
      passingYear,
      gradingSystem,
      gradeScore,
      skills,
      workStatus,
      preferredLocation,
      expectedSalary,
      // Company fields
      companyName,
      workEmail,
      industry,
      companySize,
      location,
      phone,
      gstNumber,
    } = req.body;

    const normalizedEmail = (email || workEmail || '').trim().toLowerCase();

    if (!normalizedEmail) {
      res.status(400).json({ success: false, message: 'Email address is required' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
      return;
    }

    // Ensure database connection is active and healthy
    const isDbReady = await ensureDBConnection();
    if (!isDbReady) {
      res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Reconnecting, please try again in a moment.',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      });
      return;
    }

    // Generate sequential user ID in format: JS102600001 (Job Seeker) or C102600001 (Company)
    const customUserId = await getNextCustomUserId(role);

    // Create user object based on role (clean data only, no default placeholder strings)
    const candidateName = fullName || name || '';
    const finalCompanyName = companyName || '';

    const newUser = new User({
      userId: customUserId,
      customId: customUserId,
      email: normalizedEmail,
      password,
      role: role === 'company' ? 'company' : 'job_seeker',
      name: candidateName,
      headline: targetRole || '',
      targetRole: targetRole || '',
      experience: experience || '',
      highestQualification: highestQualification || '',
      course: course || '',
      courseType: courseType || '',
      specialization: specialization || '',
      university: university || '',
      startingYear: startingYear || '',
      passingYear: passingYear || '',
      gradingSystem: gradingSystem || '',
      gradeScore: gradeScore || '',
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' && skills.length > 0 ? skills.split(',').map((s: string) => s.trim()) : [],
      workStatus: workStatus || '',
      preferredLocation: preferredLocation || '',
      expectedSalary: expectedSalary || '',
      companyName: finalCompanyName,
      workEmail: workEmail || normalizedEmail,
      industry: industry || '',
      companySize: companySize || '',
      location: location || '',
      phone: phone ? String(phone).trim() : '',
      gstNumber: gstNumber ? String(gstNumber).trim().toUpperCase() : '',
      status: role === 'company' ? 'Pending' : 'Approved',
    });

    await newUser.save();

    // 1. Save Credentials in separate collection (user_credentials)
    try {
      const newCredential = new UserCredential({
        userId: customUserId,
        email: normalizedEmail,
        password: newUser.password, // hashed password
        role: role === 'company' ? 'company' : 'job_seeker',
      });
      await newCredential.save();
    } catch (credErr: any) {
      console.warn('Warning saving to user_credentials collection:', credErr.message);
    }

    // 2. Save Profile in separate collection (user_profiles)
    try {
      const newProfile = new UserProfile({
        userId: customUserId,
        fullName: candidateName,
        email: normalizedEmail,
        mobile: phone,
        workStatus,
        highestQualification,
        course,
        courseType,
        specialization,
        university,
        startingYear,
        passingYear,
        gradingSystem,
        gradeScore,
        skills: Array.isArray(skills) ? skills : typeof skills === 'string' && skills.length > 0 ? skills.split(',').map((s: string) => s.trim()) : [],
        targetRole: targetRole || '',
        preferredLocation,
        expectedSalary,
        companyName: finalCompanyName,
        workEmail: workEmail || normalizedEmail,
        industry,
        companySize,
        location,
        phone,
        gstNumber,
      });
      await newProfile.save();
    } catch (profErr: any) {
      console.warn('Warning saving to user_profiles collection:', profErr.message);
    }

    // 3. Save to physical database/auth folder (server/database/auth/us01.json)
    saveAuthToFile(customUserId, {
      userId: customUserId,
      email: normalizedEmail,
      passwordHash: newUser.password,
      role: role === 'company' ? 'company' : 'job_seeker',
      createdAt: new Date().toISOString(),
    });

    // 4. Save to physical database/profiles folder (server/database/profiles/us01.json)
    saveProfileToFile(customUserId, {
      userId: customUserId,
      fullName: candidateName,
      email: normalizedEmail,
      mobile: phone,
      workStatus,
      highestQualification,
      course,
      courseType,
      specialization,
      university,
      startingYear,
      passingYear,
      gradingSystem,
      gradeScore,
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' && skills.length > 0 ? skills.split(',').map((s: string) => s.trim()) : [],
      targetRole: targetRole || 'Frontend Developer',
      preferredLocation,
      expectedSalary,
      companyName: finalCompanyName,
      workEmail: workEmail || normalizedEmail,
      industry,
      companySize,
      location,
      phone,
      gstNumber,
      createdAt: new Date().toISOString(),
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: `${role === 'company' ? 'Company' : 'Job seeker'} account created successfully!`,
      token,
      user: formatUser(newUser),
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration. Please try again.',
    });
  }
};

// @desc    Login user (Candidate, Company, or Super Admin)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email address and password',
      });
      return;
    }

    // Ensure database connection is active and healthy
    const isDbReady = await ensureDBConnection();
    if (!isDbReady) {
      res.status(503).json({
        success: false,
        message: 'Database service is temporarily unavailable. Reconnecting, please try again in a moment.',
      });
      return;
    }

    // Dedicated Super Admin check for sadmin@gmail.com
    if (normalizedEmail === 'sadmin@gmail.com' || (role === 'admin' && normalizedEmail === 'admin@careerconnect.com')) {
      if (password !== 'Sadmin123') {
        res.status(401).json({
          success: false,
          message: 'Invalid password for Super Admin. Please check credentials.',
        });
        return;
      }

      let admin = await User.findOne({ email: 'sadmin@gmail.com' });
      if (!admin) {
        admin = new User({
          email: 'sadmin@gmail.com',
          password: 'Sadmin123',
          name: 'Super Admin',
          role: 'admin',
          status: 'Approved',
        });
        await admin.save();
      }

      const adminToken = generateToken(admin);

      res.status(200).json({
        success: true,
        message: 'Super Admin authenticated successfully!',
        token: adminToken,
        user: formatUser(admin),
      });
      return;
    }

    // Find user in database by email OR customId / userId (e.g. JS102600001, C102600001, us01)
    const user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { userId: normalizedEmail },
        { customId: normalizedEmail },
        { userId: normalizedEmail.toLowerCase() },
        { customId: normalizedEmail.toLowerCase() },
        { userId: normalizedEmail.toUpperCase() },
        { customId: normalizedEmail.toUpperCase() },
      ],
    });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
      return;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid password. Please check and try again.',
      });
      return;
    }

    // If role was selected in frontend tabs, check for match
    if (role && user.role !== role && user.role !== 'admin') {
      const roleDisplay = user.role === 'company' ? 'Company' : 'Job Seeker';
      res.status(400).json({
        success: false,
        message: `This account is registered as a ${roleDisplay}. Please switch to the ${roleDisplay} tab.`,
      });
      return;
    }

    // If company user, auto-sync permissions from subscription plan if auto-approval enabled
    if (user.role === 'company' && user.permissions?.autoApproveFromSubscription !== false && user.plan) {
      const matchedRule = findMatchingPlanRule(user.plan);
      if (matchedRule) {
        user.permissions = {
          dashboard: false,
          jobs: false,
          applicants: false,
          resumes: false,
          settings: false,
          ...(user.permissions || {}),
          ...matchedRule,
          autoApproveFromSubscription: true,
        };
        await user.save();
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: formatUser(user),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login. Please try again.',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Not authorized, token missing' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'admin') {
      let admin = await User.findById(decoded.id).select('-password');
      if (!admin) {
        admin = await User.findOne({ email: 'sadmin@gmail.com' }).select('-password');
      }
      if (admin) {
        res.status(200).json({
          success: true,
          user: formatUser(admin),
        });
        return;
      }
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Not authorized, token missing' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const isDbReady = await ensureDBConnection();
    if (!isDbReady) {
      res.status(503).json({ success: false, message: 'Database service is temporarily unavailable.' });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const oldCompanyName = user.companyName || user.name || '';

    const {
      name,
      fullName,
      headline,
      targetRole,
      experience,
      location,
      phone,
      mobile,
      bio,
      education,
      highestQualification,
      course,
      courseType,
      specialization,
      university,
      startingYear,
      passingYear,
      gradingSystem,
      gradeScore,
      languages,
      skills,
      preferredLocation,
      expectedSalary,
      workStatus,
      resumeName,
      resumeDate,
      resumeUrl,
      // Company profile fields
      companyName,
      workEmail,
      industry,
      companySize,
      gstNumber,
      tagline,
      website,
      aboutCompany,
      logo,
      profileImage,
      bannerImage,
      culture,
      perks,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (fullName !== undefined) user.name = fullName;
    if (companyName !== undefined) user.companyName = companyName;
    if (workEmail !== undefined) user.workEmail = workEmail;
    if (industry !== undefined) user.industry = industry;
    if (companySize !== undefined) user.companySize = companySize;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;
    if (tagline !== undefined) user.tagline = tagline;
    if (website !== undefined) user.website = website;
    if (aboutCompany !== undefined) user.aboutCompany = aboutCompany;
    if (logo !== undefined) user.logo = logo;
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
      if (!user.logo) user.logo = profileImage;
    }
    if (bannerImage !== undefined) user.bannerImage = bannerImage;
    if (culture !== undefined) {
      user.culture = Array.isArray(culture)
        ? culture
        : typeof culture === 'string'
        ? culture.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (perks !== undefined) {
      user.perks = Array.isArray(perks)
        ? perks
        : typeof perks === 'string'
        ? perks.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (headline !== undefined) user.headline = headline;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (experience !== undefined) user.experience = experience;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (mobile !== undefined) user.phone = mobile;
    if (bio !== undefined) user.bio = bio;
    if (education !== undefined) {
      user.education = education;
      user.course = education;
      user.highestQualification = '';
      user.specialization = '';
    }
    if (highestQualification !== undefined && education === undefined) user.highestQualification = highestQualification;
    if (course !== undefined && education === undefined) user.course = course;
    if (courseType !== undefined) user.courseType = courseType;
    if (specialization !== undefined) user.specialization = specialization;
    if (university !== undefined) user.university = university;
    if (startingYear !== undefined) user.startingYear = startingYear;
    if (passingYear !== undefined) user.passingYear = passingYear;
    if (gradingSystem !== undefined) user.gradingSystem = gradingSystem;
    if (gradeScore !== undefined) user.gradeScore = gradeScore;
    if (languages !== undefined) user.languages = languages;
    if (preferredLocation !== undefined) user.preferredLocation = preferredLocation;
    if (expectedSalary !== undefined) user.expectedSalary = expectedSalary;
    if (workStatus !== undefined) user.workStatus = workStatus;
    if (resumeName !== undefined) user.resumeName = resumeName;
    if (resumeDate !== undefined) user.resumeDate = resumeDate;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }

    if (req.body.purchasedResumes !== undefined) user.purchasedResumes = req.body.purchasedResumes;
    if (req.body.resumeCredits !== undefined) user.resumeCredits = req.body.resumeCredits;
    if (req.body.resumesUsed !== undefined) user.resumesUsed = req.body.resumesUsed;

    await user.save();

    // If company updated profile, synchronize company's jobs and applications
    if (user.role === 'company') {
      try {
        const { Job } = await import('../models/job.model.js');
        const { Application } = await import('../models/application.model.js');

        const newCompName = user.companyName || user.name || '';
        const jobUpdate: any = {};
        if (newCompName) {
          jobUpdate.company = newCompName;
          jobUpdate.postedBy = newCompName;
        }
        if (user.logo || user.profileImage) {
          jobUpdate.logo = user.logo || user.profileImage;
        }

        const compConditions: any[] = [
          { companyId: user._id.toString() },
          { companyId: user._id },
        ];
        if (user.userId) compConditions.push({ companyId: user.userId });
        if (user.customId) compConditions.push({ companyId: user.customId });
        if (oldCompanyName) compConditions.push({ company: oldCompanyName });

        if (Object.keys(jobUpdate).length > 0) {
          await Job.updateMany(
            { $or: compConditions },
            { $set: jobUpdate }
          );

          if (newCompName && oldCompanyName && newCompName !== oldCompanyName) {
            await Application.updateMany(
              { company: oldCompanyName },
              { $set: { company: newCompName } }
            );
          }
        }
      } catch (compSyncErr) {
        console.warn('Warning syncing company jobs/applications:', compSyncErr);
      }
    }

    // If job seeker has a resume uploaded, sync to Application so admin immediately sees it
    if (user.role === 'job_seeker' && (resumeName || user.resumeName)) {
      const activeResumeName = resumeName || user.resumeName || '';
      const activeResumeUrl = resumeUrl !== undefined ? resumeUrl : user.resumeUrl || '';
      try {
        await Application.findOneAndUpdate(
          {
            company: 'Candidate Profile Upload',
            $or: [
              { candidateId: user._id },
              { candidateEmail: user.email },
            ],
          },
          {
            candidateName: user.name || 'Candidate',
            candidateEmail: user.email,
            candidatePhone: user.phone || '',
            avatarLetter: getInitials(user.name || 'Candidate'),
            avatarBg: getColorForName(user.name || 'Candidate'),
            position: user.headline || user.targetRole || 'Job Seeker',
            company: 'Candidate Profile Upload',
            domain: user.specialization || user.targetRole || 'General Pool',
            experience: user.experience || 'Fresher',
            skills: user.skills || [],
            fileName: activeResumeName,
            resumeUrl: activeResumeUrl,
            pdfData: activeResumeUrl,
            appliedOn: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            status: 'New',
            candidateId: user._id,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (appErr: any) {
        console.warn('Warning syncing Application on resume upload:', appErr.message);
      }
    }

    // Sync to UserProfile collection & disk backup
    const customId = user.userId || user.customId || user._id.toString();
    try {
      const profileConditions: any[] = [{ userId: customId }, { userId: user._id.toString() }];
      if (user.email) profileConditions.push({ email: user.email });

      await UserProfile.findOneAndUpdate(
        { $or: profileConditions },
        {
          userId: customId,
          email: user.email,
          fullName: user.name,
          mobile: user.phone,
          location: user.location,
          targetRole: user.targetRole || user.headline,
          headline: user.headline,
          bio: user.bio,
          languages: user.languages,
          resumeName: user.resumeName,
          resumeDate: user.resumeDate,
          resumeUrl: user.resumeUrl,
          experience: user.experience,
          education: user.education || user.course,
          skills: user.skills,
          highestQualification: user.highestQualification,
          course: user.course,
          courseType: user.courseType,
          specialization: user.specialization,
          university: user.university,
          startingYear: user.startingYear,
          passingYear: user.passingYear,
          gradingSystem: user.gradingSystem,
          gradeScore: user.gradeScore,
          preferredLocation: user.preferredLocation,
          expectedSalary: user.expectedSalary,
          workStatus: user.workStatus,
          aboutCompany: user.aboutCompany,
          tagline: user.tagline,
          companyName: user.companyName,
          companySize: user.companySize,
          industry: user.industry,
          website: user.website,
          gstNumber: user.gstNumber,
          logo: user.logo,
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
          culture: user.culture,
          perks: user.perks,
        },
        { upsert: true, new: true }
      );

      saveProfileToFile(customId, {
        userId: customId,
        fullName: user.name,
        email: user.email,
        mobile: user.phone,
        location: user.location,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education || user.course,
        course: user.course,
        university: user.university,
        languages: user.languages,
        resumeName: user.resumeName,
        updatedAt: new Date().toISOString(),
      });
    } catch (syncErr: any) {
      console.warn('Warning syncing UserProfile:', syncErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: formatUser(user),
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile.',
    });
  }
};

