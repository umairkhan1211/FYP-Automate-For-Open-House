import mongoose from 'mongoose';

export const connect = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is missing from environment variables.');
      return;
    }

    if (mongoose.connection.readyState >= 1) {
      console.log('Already connected to MongoDB.');
      return;
    }

    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Increased timeout
    });

    console.log('✅ MongoDB connected successfully.');

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('🚨 MongoDB connection failed:', error);
  }
};

export const disconnect = async () => {
  try {
    if (mongoose.connection.readyState > 0) {
      await mongoose.disconnect();
      console.log('⚠️ MongoDB disconnected');
    }
  } catch (error) {
    console.error('❌ Error during MongoDB disconnection:', error);
  }
};
