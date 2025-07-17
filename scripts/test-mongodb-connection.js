#!/usr/bin/env node

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Connections...\n');

  const testConnections = [
    {
      name: 'Current (Localhost)',
      uri: 'mongodb://localhost:27017/sanatan-blogs'
    },
    {
      name: 'MongoDB Atlas (Example)',
      uri: 'mongodb+srv://username:password@cluster.mongodb.net/sanatan-blogs'
    }
  ];

  for (const connection of testConnections) {
    console.log(`Testing: ${connection.name}`);
    console.log(`URI: ${connection.uri}`);
    
    try {
      // This is a simplified test - in reality you'd need valid credentials
      console.log('❌ Cannot test without valid credentials');
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('📋 To fix the login error:');
  console.log('');
  console.log('Option 1: Use MongoDB Atlas (Recommended)');
  console.log('1. Go to https://cloud.mongodb.com');
  console.log('2. Create a free cluster');
  console.log('3. Get your connection string');
  console.log('4. Update .env.local with your Atlas URI');
  console.log('');
  console.log('Option 2: Install MongoDB locally');
  console.log('1. Download MongoDB Community Server');
  console.log('2. Install and start MongoDB service');
  console.log('3. Keep current localhost URI');
  console.log('');
  console.log('🔄 After fixing:');
  console.log('1. Restart server: npm run dev');
  console.log('2. Try logging in again');
}

testMongoDBConnection(); 