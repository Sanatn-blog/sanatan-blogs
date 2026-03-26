import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env.local") });
dotenv.config({ path: join(__dirname, "..", ".env") });

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  status: String,
  role: String,
  createdAt: Date,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function approveUser(identifier) {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find user by email, username, or ID
    const query = identifier.includes("@")
      ? { email: identifier }
      : mongoose.Types.ObjectId.isValid(identifier)
        ? { _id: identifier }
        : { username: identifier };

    const user = await User.findOne(query);

    if (!user) {
      console.error(`User not found: ${identifier}`);
      process.exit(1);
    }

    console.log("\nUser found:");
    console.log(`  ID: ${user._id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Current Status: ${user.status}`);
    console.log(`  Role: ${user.role}`);

    if (user.status === "approved") {
      console.log("\n✓ User is already approved!");
      process.exit(0);
    }

    // Update user status to approved
    user.status = "approved";
    await user.save();

    console.log("\n✓ User approved successfully!");
    console.log(`  New Status: ${user.status}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

async function listPendingUsers() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    // Find all pending users
    const pendingUsers = await User.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    if (pendingUsers.length === 0) {
      console.log("No pending users found.");
      process.exit(0);
    }

    console.log(`Found ${pendingUsers.length} pending user(s):\n`);
    pendingUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (@${user.username})`);
      console.log(`   Email: ${user.email || "N/A"}`);
      console.log(`   ID: ${user._id}`);
      console.log(
        `   Created: ${user.createdAt?.toLocaleDateString() || "N/A"}`,
      );
      console.log("");
    });

    console.log("To approve a user, run:");
    console.log("  node scripts/approve-user.js <email|username|id>");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--list" || args[0] === "-l") {
  listPendingUsers();
} else {
  approveUser(args[0]);
}
