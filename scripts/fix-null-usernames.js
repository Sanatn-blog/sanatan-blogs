const mongoose = require('mongoose');
const User = require('./User');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

async function generateUniqueUsername(name, User) {
  // Clean the name and create base username
  const baseUsername = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .substring(0, 20); // Limit to 20 characters
  
  // If base username is too short, add some random characters
  let username = baseUsername;
  if (username.length < 3) {
    username = username + Math.random().toString(36).substring(2, 5);
  }
  
  // Check if username exists, if so, add random numbers
  let counter = 1;
  let finalUsername = username;
  
  while (counter <= 100) { // Limit attempts to prevent infinite loop
    const existingUser = await User.findOne({ username: finalUsername });
    if (!existingUser) {
      break;
    }
    
    // Add random numbers to make it unique
    const randomSuffix = Math.floor(Math.random() * 9999) + 1;
    finalUsername = `${username}${randomSuffix}`;
    counter++;
  }
  
  // If we still can't find a unique username, add timestamp
  if (counter > 100) {
    const timestamp = Date.now().toString().slice(-6);
    finalUsername = `${username}${timestamp}`;
  }
  
  return finalUsername;
}

async function fixNullUsernames() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Find users with null or empty usernames
    const usersWithNullUsernames = await User.find({
      $or: [
        { username: null },
        { username: '' },
        { username: { $exists: false } }
      ]
    }).select('name username email');

    console.log(`📊 Found ${usersWithNullUsernames.length} users with null/empty usernames`);

    if (usersWithNullUsernames.length === 0) {
      console.log('✅ All users have valid usernames!');
      return;
    }

    console.log('\n🔍 Users with null/empty usernames:');
    usersWithNullUsernames.forEach(user => {
      console.log(`   ${user.name} (${user.email}): "${user.username || 'NULL/EMPTY'}"`);
    });

    console.log('\n🔄 Fixing null/empty usernames...');
    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithNullUsernames) {
      try {
        // Generate unique username based on their name
        const newUsername = await generateUniqueUsername(user.name, User);
        
        await User.findByIdAndUpdate(user._id, { username: newUsername });
        console.log(`✅ Fixed ${user.name}: "${user.username || 'NULL/EMPTY'}" → "${newUsername}"`);
        
        successCount++;
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error fixing username for ${user.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Fix Summary:');
    console.log(`   ✅ Successfully fixed: ${successCount} users`);
    console.log(`   ❌ Errors: ${errorCount} users`);

    // Check for duplicate usernames after fixing
    const duplicateUsernames = await User.aggregate([
      { $group: { _id: '$username', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    if (duplicateUsernames.length > 0) {
      console.log(`\n⚠️  Warning: ${duplicateUsernames.length} duplicate usernames found after fixing:`);
      duplicateUsernames.forEach(dup => {
        console.log(`   "${dup._id}": ${dup.count} users`);
      });
    } else {
      console.log('\n✅ No duplicate usernames found!');
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixNullUsernames(); 