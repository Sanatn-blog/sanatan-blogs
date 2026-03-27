import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare const global: GlobalWithMongoose;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Check for environment variable at runtime, not at import time
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  const MONGODB_URI: string = process.env.MONGODB_URI;

  // Check if existing connection is still alive
  if (cached.conn) {
    try {
      // Verify connection is still active
      if (mongoose.connection.readyState === 1) {
        return cached.conn;
      }
      // Connection is stale, reset cache
      console.log("Stale connection detected, resetting cache");
      cached.conn = null;
      cached.promise = null;
    } catch (e) {
      console.error("Error checking connection state:", e);
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // Increased for Vercel cold starts
      socketTimeoutMS: 75000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 30000,
    };

    console.log("Creating new MongoDB connection...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("MONGODB_URI exists:", !!MONGODB_URI);

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        console.log("Connection state:", mongoose.connection.readyState);
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        console.error("Connection error details:", {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
        });
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error("Failed to establish database connection:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
