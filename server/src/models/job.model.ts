import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  companyId?: mongoose.Types.ObjectId | string;
  type: string;
  location: string;
  salary: string;
  status: 'Active' | 'Pending' | 'Expired' | 'Closed';
  postedOn: string;
  applicantsCount: number;
  description?: string;
  department?: string;
  workplace?: string;
  experience?: string;
  skills?: string[];
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
    type: {
      type: String,
      default: 'Full-Time',
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
      enum: ['Active', 'Pending', 'Expired', 'Closed'],
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
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);
export default Job;
