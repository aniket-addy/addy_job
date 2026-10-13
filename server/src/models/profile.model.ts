import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string; // e.g. "us01", "us02" - connected to UserCredential
  fullName?: string;
  email: string;
  mobile?: string;
  workStatus?: string;
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
  targetRole?: string;
  headline?: string;
  bio?: string;
  languages?: string;
  resumeName?: string;
  resumeDate?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  // Company fields if role is company
  companyName?: string;
  workEmail?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  phone?: string;
  gstNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    workStatus: {
      type: String,
      trim: true,
    },
    highestQualification: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    courseType: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    startingYear: {
      type: String,
      trim: true,
    },
    passingYear: {
      type: String,
      trim: true,
    },
    gradingSystem: {
      type: String,
      trim: true,
    },
    gradeScore: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    targetRole: {
      type: String,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    languages: {
      type: String,
      trim: true,
    },
    resumeName: {
      type: String,
      trim: true,
    },
    resumeDate: {
      type: String,
      trim: true,
    },
    preferredLocation: {
      type: String,
      trim: true,
    },
    expectedSalary: {
      type: String,
      trim: true,
    },
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
    },
    companySize: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'user_profiles',
  }
);

export const UserProfile = mongoose.model<IUserProfile>(
  'UserProfile',
  userProfileSchema
);
