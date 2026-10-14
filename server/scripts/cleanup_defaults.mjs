import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: 'addy_job' });
  console.log('Connected to MongoDB');

  const usersCollection = mongoose.connection.collection('users');
  const allUsers = await usersCollection.find({}).toArray();

  console.log(`Found ${allUsers.length} users in DB`);
  for (const u of allUsers) {
    console.log(`- User: ${u.email} (${u.role}), companyName: "${u.companyName || ''}", industry: "${u.industry || ''}", location: "${u.location || ''}", size: "${u.companySize || ''}", plan: "${u.plan || ''}", status: "${u.status || ''}"`);

    // If company registered with default "Information Technology", "11-50 employees", "Bengaluru, India"
    // and was NOT manually specified by user, clean them so they are empty.
    const updates = {};
    if (u.industry === 'Information Technology') {
      updates.industry = '';
    }
    if (u.companySize === '11-50 employees') {
      updates.companySize = '';
    }
    if (u.location === 'Bengaluru, India') {
      updates.location = '';
    }
    if (u.targetRole === 'Frontend Developer' && u.role === 'company') {
      updates.targetRole = '';
    }

    if (Object.keys(updates).length > 0) {
      await usersCollection.updateOne({ _id: u._id }, { $set: updates });
      console.log(`  -> Cleaned defaults for ${u.email}:`, updates);
    }
  }

  // Also check user_profiles collection
  const profilesCollection = mongoose.connection.collection('user_profiles');
  const allProfiles = await profilesCollection.find({}).toArray();
  for (const p of allProfiles) {
    const pUpdates = {};
    if (p.industry === 'Information Technology') pUpdates.industry = '';
    if (p.companySize === '11-50 employees') pUpdates.companySize = '';
    if (p.location === 'Bengaluru, India') pUpdates.location = '';
    if (Object.keys(pUpdates).length > 0) {
      await profilesCollection.updateOne({ _id: p._id }, { $set: pUpdates });
      console.log(`  -> Cleaned profile defaults for ${p.email || p.userId}:`, pUpdates);
    }
  }

  console.log('Done cleaning up default data from database.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
