import mongoose from 'mongoose';
import { User } from '../models/user.model.js';

const seedSuperAdmin = async () => {
  try {
    const adminEmail = 'sadmin@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        email: adminEmail,
        password: 'Sadmin123',
        name: 'Super Admin',
        role: 'admin',
        status: 'Approved',
      });
      await admin.save();
      console.log('👑 Super Admin account initialized in database: sadmin@gmail.com');
    } else {
      admin.role = 'admin';
      admin.name = 'Super Admin';
      admin.password = 'Sadmin123';
      await admin.save();
      console.log('👑 Super Admin credentials synchronized in database: sadmin@gmail.com');
    }
  } catch (err: any) {
    console.error('Error seeding super admin:', err.message);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'addy_job',
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    await seedSuperAdmin();
  } catch (error: any) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Don't crash process, allows server to respond with appropriate DB error message
  }
};
