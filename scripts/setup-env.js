#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Sanatan Blogs Environment Setup\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
  fs.copyFileSync(envPath, envPath + '.backup');
}

// Generate JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Create environment file content
const envContent = `# Database Configuration
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/sanatan-blogs

# JWT Configuration
JWT_SECRET=${jwtSecret}

# NextAuth Configuration (optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('hex')}

# Cloudinary Configuration (optional - for image uploads)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (optional)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (optional)
# FACEBOOK_CLIENT_ID=your-facebook-client-id
# FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
`;

// Write the file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env.local file created successfully!');
console.log('\n📝 Next steps:');
console.log('1. Edit .env.local and update MONGODB_URI with your actual database connection string');
console.log('2. If using MongoDB Atlas, use the connection string from your cluster');
console.log('3. For local MongoDB, ensure MongoDB is running on localhost:27017');
console.log('4. Restart your development server: npm run dev');
console.log('\n🔗 Test your setup by visiting: http://localhost:3000/api/test');
console.log('\n📚 For more help, see SETUP.md'); 