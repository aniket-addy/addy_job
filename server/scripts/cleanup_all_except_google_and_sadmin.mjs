import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const authFolder = path.join(__dirname, '../database/auth');
const profilesFolder = path.join(__dirname, '../database/profiles');

async function runCleanup() {
  console.log('🚀 Starting credentials cleanup...');
  console.log('Preserving:');
  console.log(' - Super Admin: sadmin@gmail.com');
  console.log(' - Google (Company): cp2@gmail.com / C102600001');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('addy_job');

  // 1. Clean users collection
  const usersCollection = db.collection('users');
  const googleUser = await usersCollection.findOne({
    $or: [{ email: 'cp2@gmail.com' }, { companyName: 'Google' }, { userId: 'C102600001' }]
  });
  const googleId = googleUser ? googleUser._id : null;
  const googleUserId = googleUser ? (googleUser.userId || 'C102600001') : 'C102600001';

  console.log('Found Google company user in DB:', googleUser ? { email: googleUser.email, companyName: googleUser.companyName, userId: googleUserId } : 'NOT FOUND');

  const usersDeleteRes = await usersCollection.deleteMany({
    email: { $nin: ['sadmin@gmail.com', 'cp2@gmail.com'] }
  });
  console.log(`✅ Deleted ${usersDeleteRes.deletedCount} non-whitelisted users from 'users' collection.`);

  // 2. Clean user_credentials collection
  const credsCollection = db.collection('user_credentials');
  const credsDeleteRes = await credsCollection.deleteMany({
    $and: [
      { email: { $ne: 'cp2@gmail.com' } },
      { userId: { $ne: googleUserId } }
    ]
  });
  console.log(`✅ Deleted ${credsDeleteRes.deletedCount} credentials from 'user_credentials' collection.`);

  // 3. Clean user_profiles collection
  const profilesCollection = db.collection('user_profiles');
  const profilesDeleteRes = await profilesCollection.deleteMany({
    $and: [
      { email: { $ne: 'cp2@gmail.com' } },
      { userId: { $ne: googleUserId } }
    ]
  });
  console.log(`✅ Deleted ${profilesDeleteRes.deletedCount} profiles from 'user_profiles' collection.`);

  // 4. Clean jobs collection (keep only Google jobs)
  const jobsCollection = db.collection('jobs');
  const jobsDeleteRes = await jobsCollection.deleteMany({
    $and: [
      { company: { $ne: 'Google' } },
      ...(googleId ? [{ companyId: { $ne: googleId } }] : [])
    ]
  });
  console.log(`✅ Deleted ${jobsDeleteRes.deletedCount} jobs not belonging to Google.`);

  // 5. Clean applications collection (keep only applications for Google jobs)
  const appsCollection = db.collection('applications');
  const appsDeleteRes = await appsCollection.deleteMany({
    company: { $ne: 'Google' }
  });
  console.log(`✅ Deleted ${appsDeleteRes.deletedCount} applications from 'applications' collection.`);

  // 6. Clean server/database/auth filesystem
  if (fs.existsSync(authFolder)) {
    const authFiles = fs.readdirSync(authFolder);
    let deletedAuthCount = 0;
    for (const file of authFiles) {
      if (file !== `${googleUserId}.json` && file !== 'C102600001.json') {
        fs.unlinkSync(path.join(authFolder, file));
        deletedAuthCount++;
      }
    }
    console.log(`✅ Deleted ${deletedAuthCount} auth json files from database/auth/ (Kept ${googleUserId}.json)`);
  }

  // 7. Clean server/database/profiles filesystem
  if (fs.existsSync(profilesFolder)) {
    const profileFiles = fs.readdirSync(profilesFolder);
    let deletedProfilesCount = 0;
    for (const file of profileFiles) {
      if (file !== `${googleUserId}.json` && file !== 'C102600001.json') {
        fs.unlinkSync(path.join(profilesFolder, file));
        deletedProfilesCount++;
      }
    }
    console.log(`✅ Deleted ${deletedProfilesCount} profile json files from database/profiles/ (Kept ${googleUserId}.json)`);
  }

  // Verification step
  console.log('\n--- VERIFICATION ---');
  const remainingUsers = await usersCollection.find({}, { projection: { email: 1, role: 1, name: 1, companyName: 1, userId: 1 } }).toArray();
  console.log('Remaining users in MongoDB:', remainingUsers);

  const remainingCreds = await credsCollection.find({}).toArray();
  console.log('Remaining user_credentials in MongoDB:', remainingCreds);

  const remainingProfiles = await profilesCollection.find({}, { projection: { email: 1, companyName: 1, userId: 1 } }).toArray();
  console.log('Remaining user_profiles in MongoDB:', remainingProfiles);

  const remainingJobs = await jobsCollection.find({}, { projection: { title: 1, company: 1 } }).toArray();
  console.log('Remaining jobs in MongoDB:', remainingJobs);

  const remainingApps = await appsCollection.find({}).toArray();
  console.log('Remaining applications in MongoDB count:', remainingApps.length);

  if (fs.existsSync(authFolder)) {
    console.log('Remaining database/auth files:', fs.readdirSync(authFolder));
  }
  if (fs.existsSync(profilesFolder)) {
    console.log('Remaining database/profiles files:', fs.readdirSync(profilesFolder));
  }

  await client.close();
  console.log('\n🎉 Cleanup successfully completed!');
}

runCleanup().catch((err) => {
  console.error('❌ Error during cleanup:', err);
  process.exit(1);
});
