import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  avatarLetter: string;
  avatarBg: string;
  position: string;
  company: string;
  appliedOn: string;
  status: 'New' | 'Shortlisted' | 'Reviewed' | 'Hired' | 'Rejected';
  domain?: string;
  experience?: string;
  skills?: string[];
  pdfData?: string;
  fileName?: string;
  resumeUrl?: string;
  jobId?: mongoose.Types.ObjectId | string;
  candidateId?: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    candidateEmail: {
      type: String,
      trim: true,
      default: '',
    },
    candidatePhone: {
      type: String,
      trim: true,
      default: '',
    },
    avatarLetter: {
      type: String,
      default: 'CD',
    },
    avatarBg: {
      type: String,
      default: 'bg-blue-600',
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    appliedOn: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    status: {
      type: String,
      enum: ['New', 'Shortlisted', 'Reviewed', 'Hired', 'Rejected'],
      default: 'New',
    },
    domain: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    pdfData: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    jobId: {
      type: Schema.Types.Mixed,
      ref: 'Job',
    },
    candidateId: {
      type: Schema.Types.Mixed,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>('Application', applicationSchema);
export default Application;
