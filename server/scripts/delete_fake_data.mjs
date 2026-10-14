import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('addy_job');

  // Delete fake seed companies (co01 to co06 and hr@brightpath.io)
  const fakeUserIds = ['co01', 'co02', 'co03', 'co04', 'co05', 'co06', 'c1'];
  const delCompanies = await db.collection('users').deleteMany({
    $or: [
      { userId: { $in: fakeUserIds } },
      { email: 'hr@brightpath.io' }
    ]
  });
  console.log('Deleted fake companies:', delCompanies.deletedCount);

  // Delete ALL fake seed jobs (BrightPath Technologies, Skyline Solutions, NovaTech Pvt Ltd, GreenField Innovations)
  const fakeJobCompanies = ['BrightPath Technologies', 'Skyline Solutions', 'NovaTech Pvt Ltd', 'GreenField Innovations'];
  const delJobs = await db.collection('jobs').deleteMany({ company: { $in: fakeJobCompanies } });
  console.log('Deleted fake jobs:', delJobs.deletedCount);

  // Delete ALL fake seed applications (known fake candidate emails)
  const fakeEmails = [
    'rahul.s@example.com',
    'priya.singh@example.com',
    'amit.verma@example.com',
    'sneha.patel@example.com',
    'vikram.m@example.com',
  ];
  const delApps = await db.collection('applications').deleteMany({ candidateEmail: { $in: fakeEmails } });
  console.log('Deleted fake applications:', delApps.deletedCount);

  // Final check
  const remaining = {
    companies: await db.collection('users').countDocuments({ role: 'company' }),
    jobs: await db.collection('jobs').countDocuments(),
    applications: await db.collection('applications').countDocuments(),
  };
  console.log('Remaining real data:', remaining);

  await client.close();
  console.log('Cleanup complete!');
})().catch(console.error);
