import mongoose from "mongoose";

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.error(
        "[ERROR] MONGODB_URI is not defined in environment variables",
      );
      process.exit(1);
    }

    console.log("[SUCCESS] MONGODB_URI found");
    console.log(
      "Connecting to:",
      MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"),
    );

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("[SUCCESS] Successfully connected to MongoDB");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.db?.databaseName);

    // Test a simple query
    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    console.log(
      "[SUCCESS] Available collections:",
      collections?.map((c) => c.name).join(", "),
    );

    await mongoose.disconnect();
    console.log("[SUCCESS] Disconnected successfully");

    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Connection test failed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
}

testConnection();
