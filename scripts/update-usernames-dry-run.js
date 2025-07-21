const mongoose = require('mongoose');
const User = require('./User');
const { generateUniqueUsername } = require('./utils');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sanatan-blogs';

async function updateUsernamesDryRun() {
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

    console.log('\n🔍 DRY RUN - No changes will be made to the database');
    console.log('=' .repeat(60));

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutUsername) {
      try {
        console.log(`\n🔄 Would process user: ${user.name} (${user.email || user.phoneNumber})`);
        console.log(`   Current username: ${user.username || 'NOT SET'}`);
        
        // Generate unique username based on their name
        const username = await generateUniqueUsername(user.name, User);
        
        console.log(`   Would set username to: ${username}`);
        console.log(`   ✅ Would update ${user.name} with username: ${username}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error generating username for ${user.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('📈 DRY RUN Summary:');
    console.log(`✅ Would successfully update: ${successCount} users`);
    console.log(`❌ Would fail to update: ${errorCount} users`);
    console.log(`📊 Total that would be processed: ${usersWithoutUsername.length} users`);
    console.log('\n💡 To actually run the migration, use: node update-usernames.js');

    // Show some examples of what the usernames would look like
    if (usersWithoutUsername.length > 0) {
      console.log('\n📝 Example username generations:');
      console.log('-'.repeat(40));
      for (let i = 0; i < Math.min(5, usersWithoutUsername.length); i++) {
        const user = usersWithoutUsername[i];
        const username = await generateUniqueUsername(user.name, User);
        console.log(`${user.name} → ${username}`);
      }
      if (usersWithoutUsername.length > 5) {
        console.log(`... and ${usersWithoutUsername.length - 5} more users`);
      }
    }

  } catch (error) {
    console.error('❌ Dry run failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the dry run
if (require.main === module) {
  updateUsernamesDryRun()
    .then(() => {
      console.log('🏁 Dry run completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Dry run failed:', error);
      process.exit(1);
    });
}

module.exports = { updateUsernamesDryRun }; 