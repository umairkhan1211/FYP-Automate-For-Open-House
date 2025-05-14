import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('❌ DATABASE_URL is not defined in environment variables');
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully.');

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    global.mongoose = cached;
    return cached.conn;
  } catch (error) {
    console.error('🚨 MongoDB connection failed:', error);
    throw error;
  }
}
