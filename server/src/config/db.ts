import mongoose from 'mongoose';
import dns from 'node:dns';
import { User } from '../models/user.model.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unsupported in environment
}

let isConnecting = false;
let listenersBound = false;

const bindConnectionListeners = () => {
  if (listenersBound) return;
  listenersBound = true;

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error event:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected! Attempting auto-reconnection in 3s...');
    setTimeout(() => {
      if (mongoose.connection.readyState === 0) {
        connectDB();
      }
    }, 3000);
  });
};

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
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (isConnecting) {
    return;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    return;
  }

  bindConnectionListeners();
  isConnecting = true;

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'addy_job',
      serverSelectionTimeoutMS: 8000,
      family: 4, // Force IPv4 to prevent Windows DNS IPv6 resolution timeouts on Atlas
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    await seedSuperAdmin();
  } catch (error: any) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
  } finally {
    isConnecting = false;
  }
};

const isConnected = () => (mongoose.connection.readyState as number) === 1;

/**
 * Ensures MongoDB is connected before running queries, re-connecting if dropped
 */
export const ensureDBConnection = async (): Promise<boolean> => {
  if (isConnected()) {
    return true;
  }

  if ((mongoose.connection.readyState as number) === 2 || isConnecting) {
    // Wait up to 5 seconds for in-flight connection
    for (let i = 0; i < 25; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (isConnected()) return true;
    }
    return false;
  }

  // Attempt fresh connection
  await connectDB();
  return isConnected();
};
