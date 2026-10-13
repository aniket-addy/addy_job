import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model.js';
import { UserCredential } from '../models/credential.model.js';
import { UserProfile } from '../models/profile.model.js';
import { ensureDBConnection } from '../config/db.js';
import {
  getNextCustomUserId,
  saveAuthToFile,
  saveProfileToFile,
} from '../utils/databaseStorage.js';

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

// Format user object to return without password
const formatUser = (user: IUser) => {
  return {
    id: user._id,
    userId: user.userId || user.customId || 'us01',
    customId: user.customId || user.userId || 'us01',
    email: user.email,
    role: user.role,
    name: user.name || (user.role === 'company' ? user.companyName : user.userId || 'Candidate'),
    headline: user.headline || user.targetRole || '',
    bio: user.bio || '',
    languages: user.languages || '',
    targetRole: user.targetRole || '',
    experience: user.experience || '',
    highestQualification: user.highestQualification || '',
    course: user.course || '',
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
    status: user.status || 'Pending',
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

    // Generate sequential user ID in format: us01, us02, us03...
    const customUserId = await getNextCustomUserId();

    // Create user object based on role
    const candidateName = fullName || name || (role === 'job_seeker' ? 'Candidate User' : '');
    const finalCompanyName = companyName || (role === 'company' ? 'Company Partner' : '');

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

    // Find user in database by email OR customId / userId (e.g. us01)
    const user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { userId: normalizedEmail.toLowerCase() },
        { customId: normalizedEmail.toLowerCase() },
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
    } = req.body;

    if (name !== undefined) user.name = name;
    if (fullName !== undefined) user.name = fullName;
    if (headline !== undefined) user.headline = headline;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (experience !== undefined) user.experience = experience;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (mobile !== undefined) user.phone = mobile;
    if (bio !== undefined) user.bio = bio;
    if (highestQualification !== undefined) user.highestQualification = highestQualification;
    if (course !== undefined) user.course = course;
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

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }

    await user.save();

    // Sync to UserProfile collection & disk backup
    const customId = user.userId || user.customId || 'us01';
    try {
      await UserProfile.findOneAndUpdate(
        { userId: customId },
        {
          fullName: user.name,
          mobile: user.phone,
          location: user.location,
          targetRole: user.targetRole || user.headline,
          headline: user.headline,
          bio: user.bio,
          languages: user.languages,
          resumeName: user.resumeName,
          resumeDate: user.resumeDate,
          experience: user.experience,
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

