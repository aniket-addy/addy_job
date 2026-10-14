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
  
  // Check all users
  const allUsers = await db.collection('users').find({}).toArray();
  console.log('Total users:', allUsers.length);
  allUsers.forEach(u => console.log(' -', u.email, '| role:', u.role, '| userId:', u.userId, '| name:', u.name || u.companyName));
  
  // Check all jobs
  const allJobs = await db.collection('jobs').find({}).toArray();
  console.log('Total jobs:', allJobs.length);
  allJobs.forEach(j => console.log(' -', j.title, '|', j.company));
  
  // Check all applications
  const allApps = await db.collection('applications').find({}).toArray();
  console.log('Total applications:', allApps.length);
  allApps.forEach(a => console.log(' -', a.candidateName, '|', a.position));

  // Check plans
  const allPlans = await db.collection('plans').find({}).toArray();
  console.log('Total plans in DB:', allPlans.length);
  allPlans.forEach(p => console.log(' -', p.name, '|', p.price, '| credits:', p.credits));
  
  await client.close();
  console.log('DONE');
})().catch(console.error);
