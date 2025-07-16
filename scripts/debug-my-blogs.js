#!/usr/bin/env node

import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

console.log('🔍 My Blogs Debug Script\n');

// Check 1: Environment Variables
console.log('1. Checking Environment Variables...');
const envCheck = {
  MONGODB_URI: !!process.env.MONGODB_URI,
  JWT_SECRET: !!process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV
};

console.log('Environment Status:', envCheck);

if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI is missing!');
  console.log('   Run: npm run setup');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.log('❌ JWT_SECRET is missing!');
  console.log('   Run: npm run setup');
  process.exit(1);
}

console.log('✅ Environment variables are set\n');

// Check 2: Database Connection
console.log('2. Testing Database Connection...');

async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connection successful');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections found:', collections.map(c => c.name));
    
    // Check if we have the required models
    const { default: User } = await import('../models/User.js');
    const { default: Blog } = await import('../models/Blog.js');
    
    // Count documents
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    
    console.log(`👥 Users in database: ${userCount}`);
    console.log(`📝 Blogs in database: ${blogCount}`);
    
    if (userCount === 0) {
      console.log('⚠️  No users found. You need to create a user first.');
      console.log('   Register through the app interface or use admin panel.');
    }
    
    if (blogCount === 0) {
      console.log('⚠️  No blogs found. You need to create blogs first.');
      console.log('   Run: npm run seed (after creating a user)');
    }
    
    // Show sample blogs with authors
    if (blogCount > 0) {
      console.log('\n📚 Sample blogs:');
      const sampleBlogs = await Blog.find().populate('author', 'name email').limit(3).lean();
      sampleBlogs.forEach((blog, index) => {
        console.log(`   ${index + 1}. "${blog.title}" by ${blog.author?.name || 'Unknown'} (${blog.status})`);
      });
    }
    
    await mongoose.disconnect();
    console.log('🔌 Database disconnected\n');
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\nPossible solutions:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify MONGODB_URI in .env.local');
    console.log('3. Check network connectivity');
    process.exit(1);
  }
}

// Check 3: API Endpoints
console.log('3. API Endpoint Status...');
console.log('   Test these URLs in your browser:');
console.log('   - http://localhost:3000/api/test (Database connection)');
console.log('   - http://localhost:3000/api/auth/me (Authentication - requires login)');
console.log('   - http://localhost:3000/api/blogs (All published blogs)');
console.log('   - http://localhost:3000/api/blogs/my-blogs (Your blogs - requires login)');

// Check 4: Common Issues
console.log('\n4. Common Issues Checklist:');
console.log('   □ Are you logged in? (Check localStorage for accessToken)');
console.log('   □ Is the development server running? (npm run dev)');
console.log('   □ Are there any console errors in browser?');
console.log('   □ Is MongoDB running?');
console.log('   □ Do you have blogs authored by your user account?');

// Run database test
testDatabase().then(() => {
  console.log('\n🎯 Next Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('3. Log in to your account');
  console.log('4. Visit /dashboard/blogs to see your blogs');
  console.log('5. If no blogs appear, create some at /write-blog');
  
  console.log('\n📚 For more help, see TROUBLESHOOTING.md');
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 