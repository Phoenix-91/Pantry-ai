import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[Database] Attempting connection to configured MongoDB URI...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[Database] Successfully connected to MongoDB: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] Warning: Could not connect to configured MongoDB URI (${err.message}). Falling back to Embedded MongoDB...`);
    }
  }

  try {
    console.log('[Database] Starting Embedded MongoDB Server (Zero-setup instant mode)...');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to Embedded MongoDB Server at: ${memoryUri}`);
  } catch (error) {
    console.error('[Database] Critical error starting MongoDB connection:', error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('[Database] Error closing DB:', err);
  }
};
