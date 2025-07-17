#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 MongoDB URI Updater\n');

// Get the new URI from command line argument
const newUri = process.argv[2];

if (!newUri) {
  console.log('❌ Please provide your MongoDB connection string as an argument');
  console.log('');
  console.log('Example:');
  console.log('node scripts/update-mongodb-uri.js "mongodb+srv://username:password@cluster.mongodb.net/sanatan-blogs"');
  console.log('');
  console.log('📋 Steps to get your connection string:');
  console.log('1. Go to https://cloud.mongodb.com');
  console.log('2. Create a free cluster');
  console.log('3. Click "Connect" on your cluster');
  console.log('4. Choose "Connect your application"');
  console.log('5. Copy the connection string');
  console.log('6. Replace <password> with your actual password');
  console.log('7. Run this script with the connection string');
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found. Run "node scripts/setup-env.js" first.');
  process.exit(1);
}

// Read the current .env.local file
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace the MONGODB_URI line
const updatedContent = envContent.replace(
  /MONGODB_URI=.*/,
  `MONGODB_URI=${newUri}`
);

// Write the updated content back
fs.writeFileSync(envPath, updatedContent);

console.log('✅ MongoDB URI updated successfully!');
console.log('');
console.log('🔄 Next steps:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Test the connection: http://localhost:3000/api/test');
console.log('3. Try logging in again'); 