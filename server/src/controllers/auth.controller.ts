import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'addy_job_jwt_secret_super_secure_key_2025';

// Helper to generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
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
    email: user.email,
    role: user.role,
    name: user.name || (user.role === 'company' ? user.companyName : 'User'),
    targetRole: user.targetRole,
    experience: user.experience,
    companyName: user.companyName,
    workEmail: user.workEmail,
    industry: user.industry,
    companySize: user.companySize,
    location: user.location,
    status: user.status,
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
      // Company fields
      companyName,
      workEmail,
      industry,
      companySize,
      location,
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      });
      return;
    }

    // Create user object based on role
    const candidateName = fullName || name || (role === 'job_seeker' ? 'Candidate User' : '');
    const finalCompanyName = companyName || (role === 'company' ? 'Company Partner' : '');

    const newUser = new User({
      email: normalizedEmail,
      password,
      role: role === 'company' ? 'company' : 'job_seeker',
      name: candidateName,
      targetRole: targetRole || 'Frontend Developer',
      experience: experience || '1-3 Years',
      companyName: finalCompanyName,
      workEmail: workEmail || normalizedEmail,
      industry: industry || 'Information Technology',
      companySize: companySize || '11-50 employees',
      location: location || 'Bengaluru, India',
      status: role === 'company' ? 'Pending' : 'Approved',
    });

    await newUser.save();

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

    // Find user in database
    const user = await User.findOne({ email: normalizedEmail });
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
