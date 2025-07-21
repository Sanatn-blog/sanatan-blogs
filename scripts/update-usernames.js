const mongoose = require('mongoose');
const User = require('./User');
const { generateUniqueUsername } = require('./utils');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sanatan-blogs';

async function updateUsernames() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Find all users that don't have a username or have an empty username
    const usersWithoutUsername = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' },
        { username: { $regex: /^\s*$/ } } // Only whitespace
      ]
    });

    console.log(`📊 Found ${usersWithoutUsername.length} users without usernames`);

    if (usersWithoutUsername.length === 0) {
      console.log('✅ All users already have usernames!');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutUsername) {
      try {
        console.log(`🔄 Processing user: ${user.name} (${user.email || user.phoneNumber})`);
        
        // Generate unique username based on their name
        const username = await generateUniqueUsername(user.name, User);
        
        // Update the user with the new username
        await User.findByIdAndUpdate(user._id, { username });
        
        console.log(`✅ Updated ${user.name} with username: ${username}`);
        successCount++;
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error updating user ${user.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully updated: ${successCount} users`);
    console.log(`❌ Failed to update: ${errorCount} users`);
    console.log(`📊 Total processed: ${usersWithoutUsername.length} users`);

    // Verify the migration
    const remainingUsersWithoutUsername = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' },
        { username: { $regex: /^\s*$/ } }
      ]
    });

    if (remainingUsersWithoutUsername.length === 0) {
      console.log('🎉 All users now have unique usernames!');
    } else {
      console.log(`⚠️  ${remainingUsersWithoutUsername.length} users still don't have usernames`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
if (require.main === module) {
  updateUsernames()
    .then(() => {
      console.log('🏁 Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { updateUsernames }; 