const mongoose = require('mongoose');
const User = require('./User');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

async function createTestUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('⚠️ Test user already exists, updating password...');
      
      // Update password
      existingUser.password = 'Test123!';
      await existingUser.save();
      
      console.log('✅ Test user password updated successfully!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Password: Test123!`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   Status: ${existingUser.status}`);
    } else {
      // Create new test user
      const testUser = new User({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        phoneNumber: '1234567890',
        role: 'user',
        status: 'approved',
        emailVerified: true
      });

      await testUser.save();
      
      console.log('✅ Test user created successfully!');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Username: ${testUser.username}`);
      console.log(`   Password: Test123!`);
      console.log(`   Role: ${testUser.role}`);
      console.log(`   Status: ${testUser.status}`);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createTestUser(); 