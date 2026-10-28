import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  companyId?: mongoose.Types.ObjectId | string;
  type: string;
  location: string;
  salary: string;
  status: 'Active' | 'Pending' | 'Expired' | 'Closed' | 'Paused';
  postedOn: string;
  applicantsCount: number;
  description?: string;
  department?: string;
  workplace?: string;
  experience?: string;
  skills?: string[];
  tags?: string[];
  openings?: number;
  postedBy?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: Schema.Types.Mixed,
      ref: 'User',
    },
    logo: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'Full-time',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    salary: {
      type: String,
      default: 'Competitive',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Expired', 'Closed', 'Paused'],
      default: 'Active',
    },
    postedOn: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'Engineering',
    },
    workplace: {
      type: String,
      default: 'Hybrid',
    },
    experience: {
      type: String,
      default: '2-4 years',
    },
    skills: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    openings: {
      type: Number,
      default: 1,
    },
    postedBy: {
      type: String,
      default: '',
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes for fast filtering & sorting
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ department: 1, location: 1 });

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);
export default Job;
