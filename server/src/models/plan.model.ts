import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: string;
  yearlyPrice?: string;
  billingCycle: string;
  features: string[];
  credits: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    yearlyPrice: {
      type: String,
      trim: true,
      default: '',
    },
    billingCycle: {
      type: String,
      default: 'monthly',
    },
    features: {
      type: [String],
      default: [],
    },
    credits: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.models.Plan || mongoose.model<IPlan>('Plan', planSchema);
export default Plan;
