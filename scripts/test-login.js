import mongoose from 'mongoose';

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // Check environment variables
    console.log('Environment variables check:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Missing');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is missing');
      console.log('Please add MONGODB_URI to your .env file');
      return;
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing');
      console.log('Please add JWT_SECRET to your .env file');
      return;
    }
    
    // Test database connection
    console.log('\nTesting database connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully');
    
    // Test basic database operations
    console.log('\nTesting database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check if users collection exists
    const usersCollection = collections.find(c => c.name === 'users');
    if (!usersCollection) {
      console.log('⚠️  Users collection not found');
      console.log('You may need to create a user first');
    } else {
      console.log('✅ Users collection found');
      
      // Count users
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log('Total users in database:', userCount);
    }
    
    console.log('\n✅ Database connection test completed');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Provide specific guidance based on error type
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 This error usually means:');
      console.log('1. MongoDB server is not running');
      console.log('2. MONGODB_URI is incorrect');
      console.log('3. Network connectivity issues');
      console.log('4. Firewall blocking the connection');
    } else if (error.name === 'MongoParseError') {
      console.log('\n💡 This error usually means:');
      console.log('1. MONGODB_URI format is incorrect');
      console.log('2. Missing username/password in connection string');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\nDatabase disconnected');
    }
  }
}

testLogin(); 