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
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type?: string;
    read: boolean;
    createdAt: Date;
  }>;
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
      default: 'Information Technology',
    },
    companySize: {
      type: String,
      trim: true,
      default: '11-50 employees',
    },
    location: {
      type: String,
      trim: true,
      default: 'Bengaluru, India',
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
      default: 'Pending',
    },
    notifications: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          message: { type: String, required: true },
          type: { type: String, default: 'info' },
          read: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
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
