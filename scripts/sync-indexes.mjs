/**
 * Build the indexes declared on the Mongoose schemas against the connected
 * database, and report what each collection ended up with.
 *
 * Mongoose only creates indexes automatically when `autoIndex` is on, and an
 * index added to a schema after a collection already exists is never built
 * retroactively. Run this once after changing an index declaration:
 *
 *   node scripts/sync-indexes.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set - check .env / .env.local");
  process.exit(1);
}

const indexSpecs = [
  ["blogs", { status: 1, isPublished: 1, publishedAt: -1, createdAt: -1 }],
  [
    "blogs",
    { status: 1, isPublished: 1, category: 1, publishedAt: -1, createdAt: -1 },
  ],
  ["comments", { blog: 1, isApproved: 1, parentComment: 1, createdAt: -1 }],
];

await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
console.log("connected");

const db = mongoose.connection.db;

for (const [collection, keys] of indexSpecs) {
  const name = await db.collection(collection).createIndex(keys);
  console.log(`${collection}: ensured ${name}`);
}

for (const collection of new Set(indexSpecs.map(([c]) => c))) {
  const existing = await db.collection(collection).indexes();
  console.log(`\n${collection} indexes:`);
  for (const index of existing) {
    console.log(`  ${index.name}  ${JSON.stringify(index.key)}`);
  }
}

await mongoose.disconnect();
