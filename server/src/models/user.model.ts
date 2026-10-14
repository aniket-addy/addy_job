import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  userId?: string; // e.g. "us01", "us02"
  customId?: string; // e.g. "us01", "us02"
  email: string;
  password?: string;
  role: 'job_seeker' | 'company' | 'admin';
  name?: string;
  headline?: string;
  bio?: string;
  targetRole?: string;
  experience?: string;
  highestQualification?: string;
  course?: string;
  courseType?: string;
  specialization?: string;
  university?: string;
  startingYear?: string;
  passingYear?: string;
  gradingSystem?: string;
  gradeScore?: string;
  skills?: string[];
  languages?: string;
  workStatus?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  resumeName?: string;
  resumeDate?: string;
  resumeUrl?: string;
  appliedJobsCount?: number;
  savedJobsCount?: number;
  interviewsCount?: number;
  profileViewsCount?: number;
  companyName?: string;
  workEmail?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  gstNumber?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  plan?: string;
  permissions?: {
    dashboard?: boolean;
    jobs?: boolean;
    applicants?: boolean;
    resumes?: boolean;
    settings?: boolean;
    autoApproveFromSubscription?: boolean;
  };
  purchasedResumes?: Array<{
    id: string;
    candidateName: string;
    title: string;
    experience: string;
    location: string;
    purchasedDate: string;
    fileSize: string;
    downloadUrl: string;
    email: string;
    phone: string;
    pdfData?: string;
    domain?: string;
    skills?: string[];
    isUnlocked?: boolean;
    unlockedAt?: string;
  }>;
  resumeCredits?: number;
  resumesUsed?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      trim: true,
      index: true,
    },
    customId: {
      type: String,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['job_seeker', 'company', 'admin'],
      default: 'job_seeker',
      required: true,
    },
    // Candidate fields
    name: {
      type: String,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    targetRole: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    highestQualification: {
      type: String,
      trim: true,
      default: '',
    },
    course: {
      type: String,
      trim: true,
      default: '',
    },
    courseType: {
      type: String,
      trim: true,
      default: '',
    },
    specialization: {
      type: String,
      trim: true,
      default: '',
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    startingYear: {
      type: String,
      trim: true,
      default: '',
    },
    passingYear: {
      type: String,
      trim: true,
      default: '',
    },
    gradingSystem: {
      type: String,
      trim: true,
      default: '',
    },
    gradeScore: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    languages: {
      type: String,
      trim: true,
      default: '',
    },
    workStatus: {
      type: String,
      trim: true,
      default: '',
    },
    preferredLocation: {
      type: String,
      trim: true,
      default: '',
    },
    expectedSalary: {
      type: String,
      trim: true,
      default: '',
    },
    resumeName: {
      type: String,
      trim: true,
      default: '',
    },
    resumeDate: {
      type: String,
      trim: true,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    appliedJobsCount: {
      type: Number,
      default: 0,
    },
    savedJobsCount: {
      type: Number,
      default: 0,
    },
    interviewsCount: {
      type: Number,
      default: 0,
    },
    profileViewsCount: {
      type: Number,
      default: 0,
    },
    // Company fields
    companyName: {
      type: String,
      trim: true,
    },
    workEmail: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      default: '',
    },
    companySize: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved',
    },
    plan: {
      type: String,
      trim: true,
      default: '',
    },
    permissions: {
      dashboard: { type: Boolean, default: false },
      jobs: { type: Boolean, default: false },
      applicants: { type: Boolean, default: false },
      resumes: { type: Boolean, default: false },
      settings: { type: Boolean, default: false },
      autoApproveFromSubscription: { type: Boolean, default: true },
    },
    purchasedResumes: [
      {
        id: { type: String },
        candidateName: { type: String, default: '' },
        title: { type: String, default: '' },
        experience: { type: String, default: '' },
        location: { type: String, default: '' },
        purchasedDate: { type: String, default: '' },
        fileSize: { type: String, default: '250 KB' },
        downloadUrl: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        pdfData: { type: String, default: '' },
        domain: { type: String, default: '' },
        skills: { type: [String], default: [] },
        isUnlocked: { type: Boolean, default: false },
        unlockedAt: { type: String, default: '' },
      },
    ],
    resumeCredits: {
      type: Number,
      default: 0,
    },
    resumesUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
