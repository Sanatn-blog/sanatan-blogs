const mongoose = require('mongoose');
const User = require('./User');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

async function fixInvalidUsernames() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Find users with invalid usernames (containing characters other than letters, numbers, underscores)
    const invalidUsernameRegex = /[^a-zA-Z0-9_]/;
    const usersWithInvalidUsernames = await User.find({
      username: { $regex: invalidUsernameRegex }
    }).select('name username email');

    console.log(`📊 Found ${usersWithInvalidUsernames.length} users with invalid usernames`);

    if (usersWithInvalidUsernames.length === 0) {
      console.log('✅ All usernames are valid!');
      return;
    }

    console.log('\n🔍 Users with invalid usernames:');
    usersWithInvalidUsernames.forEach(user => {
      console.log(`   ${user.name} (${user.email}): "${user.username}"`);
    });

    console.log('\n🔄 Fixing invalid usernames...');
    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithInvalidUsernames) {
      try {
        // Fix username by replacing invalid characters with underscores
        const fixedUsername = user.username.replace(/[^a-zA-Z0-9_]/g, '_');
        
        // Ensure username is not empty after fixing
        if (!fixedUsername || fixedUsername.length < 3) {
          // Generate a new username based on name
          const baseUsername = user.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20);
          
          const newUsername = baseUsername + Math.floor(Math.random() * 9999) + 1;
          
          await User.findByIdAndUpdate(user._id, { username: newUsername });
          console.log(`✅ Fixed ${user.name}: "${user.username}" → "${newUsername}"`);
        } else {
          await User.findByIdAndUpdate(user._id, { username: fixedUsername });
          console.log(`✅ Fixed ${user.name}: "${user.username}" → "${fixedUsername}"`);
        }
        
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
fixInvalidUsernames(); 