import mongoose, { Document, Schema } from 'mongoose';

export interface IUserCredential extends Document {
  userId: string; // e.g. "us01", "us02"
  email: string;
  password: string; // hashed password
  role: 'job_seeker' | 'company' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userCredentialSchema = new Schema<IUserCredential>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['job_seeker', 'company', 'admin'],
      default: 'job_seeker',
    },
  },
  {
    timestamps: true,
    collection: 'user_credentials',
  }
);

export const UserCredential = mongoose.model<IUserCredential>(
  'UserCredential',
  userCredentialSchema
);
