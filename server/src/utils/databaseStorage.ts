import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { UserCredential } from '../models/credential.model.js';
import { UserProfile } from '../models/profile.model.js';
import { User } from '../models/user.model.js';

// Resolve database folder relative to working directory / server directory
const SERVER_ROOT = process.cwd();
const DB_FOLDER = path.join(SERVER_ROOT, 'database');
const AUTH_FOLDER = path.join(DB_FOLDER, 'auth');
const PROFILES_FOLDER = path.join(DB_FOLDER, 'profiles');

/**
 * Ensure storage folders exist
 */
export const ensureDatabaseFolders = () => {
  if (!fs.existsSync(DB_FOLDER)) {
    fs.mkdirSync(DB_FOLDER, { recursive: true });
  }
  if (!fs.existsSync(AUTH_FOLDER)) {
    fs.mkdirSync(AUTH_FOLDER, { recursive: true });
  }
  if (!fs.existsSync(PROFILES_FOLDER)) {
    fs.mkdirSync(PROFILES_FOLDER, { recursive: true });
  }
};

/**
 * Auto-generate next user ID in sequential format:
 * - Job Seeker: JS<MM><YY><00001> (e.g. JS102600001, JS082600001)
 * - Company:    C<MM><YY><00001>  (e.g. C102600001, C082600001)
 * Where MM is 2-digit month, YY is last 2 digits of year, and sequence is 5-digit padded.
 */
export const getNextCustomUserId = async (
  role: 'job_seeker' | 'company' | string = 'job_seeker'
): Promise<string> => {
  ensureDatabaseFolders();

  const isCompany = role === 'company';
  const prefix = isCompany ? 'C' : 'JS';

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const period = `${month}${year}`; // e.g. "1026"
  const fullPrefix = `${prefix}${period}`; // e.g. "JS1026" or "C1026"

  const numbersFound: number[] = [];
  const regex = new RegExp(`^${prefix}${period}(\\d+)$`, 'i');

  // 1. Scan MongoDB collections for existing custom IDs (if connected)
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const credUsers = await UserCredential.find({}, { userId: 1 }).lean();
      for (const u of credUsers) {
        const match = u.userId?.match(regex);
        if (match) numbersFound.push(parseInt(match[1], 10));
      }

      const profUsers = await UserProfile.find({}, { userId: 1 }).lean();
      for (const u of profUsers) {
        const match = u.userId?.match(regex);
        if (match) numbersFound.push(parseInt(match[1], 10));
      }

      const mainUsers = await User.find(
        { $or: [{ customId: { $exists: true } }, { userId: { $exists: true } }] },
        { customId: 1, userId: 1 }
      ).lean();
      for (const u of mainUsers as any[]) {
        const idVal = u.customId || u.userId;
        const match = idVal?.match(regex);
        if (match) numbersFound.push(parseInt(match[1], 10));
      }
    }
  } catch (err) {
    console.warn('Warning querying MongoDB for next custom userId:', err);
  }

  // 2. Scan file system database/auth folder
  try {
    if (fs.existsSync(AUTH_FOLDER)) {
      const files = fs.readdirSync(AUTH_FOLDER);
      for (const file of files) {
        const basename = path.basename(file, path.extname(file));
        const match = basename.match(regex);
        if (match) numbersFound.push(parseInt(match[1], 10));
      }
    }
  } catch (err) {
    console.warn('Warning reading filesystem database folder:', err);
  }

  const maxNumber = numbersFound.length > 0 ? Math.max(...numbersFound) : 0;
  const nextNumber = maxNumber + 1;

  // Format with 5-digit leading zeros: JS102600001, C102600001
  const padded = String(nextNumber).padStart(5, '0');
  return `${fullPrefix}${padded}`;
};

/**
 * Save auth data into server/database/auth/[userId].json
 */
export const saveAuthToFile = (userId: string, data: Record<string, any>) => {
  try {
    ensureDatabaseFolders();
    const filePath = path.join(AUTH_FOLDER, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 Saved Credentials to database/auth/${userId}.json`);
  } catch (err: any) {
    console.error(`Failed to save auth file for ${userId}:`, err.message);
  }
};

/**
 * Save profile data into server/database/profiles/[userId].json
 */
export const saveProfileToFile = (userId: string, data: Record<string, any>) => {
  try {
    ensureDatabaseFolders();
    const filePath = path.join(PROFILES_FOLDER, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 Saved Profile to database/profiles/${userId}.json`);
  } catch (err: any) {
    console.error(`Failed to save profile file for ${userId}:`, err.message);
  }
};
