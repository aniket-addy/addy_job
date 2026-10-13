import fs from 'fs';
import path from 'path';
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
 * Auto-generate next user ID in sequential format: us01, us02, us03...
 */
export const getNextCustomUserId = async (): Promise<string> => {
  ensureDatabaseFolders();

  const numbersFound: number[] = [];

  // 1. Scan MongoDB collections for existing custom IDs
  try {
    const credUsers = await UserCredential.find({}, { userId: 1 }).lean();
    for (const u of credUsers) {
      const match = u.userId?.match(/^us(\d+)$/i);
      if (match) numbersFound.push(parseInt(match[1], 10));
    }

    const profUsers = await UserProfile.find({}, { userId: 1 }).lean();
    for (const u of profUsers) {
      const match = u.userId?.match(/^us(\d+)$/i);
      if (match) numbersFound.push(parseInt(match[1], 10));
    }

    const mainUsers = await User.find(
      { $or: [{ customId: { $exists: true } }, { userId: { $exists: true } }] },
      { customId: 1, userId: 1 }
    ).lean();
    for (const u of mainUsers as any[]) {
      const idVal = u.customId || u.userId;
      const match = idVal?.match(/^us(\d+)$/i);
      if (match) numbersFound.push(parseInt(match[1], 10));
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
        const match = basename.match(/^us(\d+)$/i);
        if (match) numbersFound.push(parseInt(match[1], 10));
      }
    }
  } catch (err) {
    console.warn('Warning reading filesystem database folder:', err);
  }

  const maxNumber = numbersFound.length > 0 ? Math.max(...numbersFound) : 0;
  const nextNumber = maxNumber + 1;

  // Format with leading zero: us01, us02, us03...
  const padded = String(nextNumber).padStart(2, '0');
  return `us${padded}`;
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
