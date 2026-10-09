import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'job_seeker' | 'company' | 'admin';
  name?: string;
  targetRole?: string;
  experience?: string;
  companyName?: string;
  workEmail?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  gstNumber?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
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
    targetRole: {
      type: String,
      trim: true,
      default: 'Frontend Developer',
    },
    experience: {
      type: String,
      trim: true,
      default: '1-3 Years',
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
      default: 'Approved',
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
