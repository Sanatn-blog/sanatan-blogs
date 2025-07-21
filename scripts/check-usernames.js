const mongoose = require('mongoose');
const User = require('./User');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sanatan-blogs';

async function checkUsernames() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Get total user count
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);

    // Find users with usernames
    const usersWithUsername = await User.find({
      username: { $exists: true, $ne: null, $ne: '' }
    }).select('name username email');

    // Find users without usernames
    const usersWithoutUsername = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' },
        { username: { $regex: /^\s*$/ } }
      ]
    }).select('name email');

    console.log(`✅ Users with usernames: ${usersWithUsername.length}`);
    console.log(`❌ Users without usernames: ${usersWithoutUsername.length}`);

    // Check for duplicate usernames
    const duplicateUsernames = await User.aggregate([
      { $group: { _id: '$username', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    console.log(`⚠️  Duplicate usernames found: ${duplicateUsernames.length}`);

    if (duplicateUsernames.length > 0) {
      console.log('\n🔍 Duplicate usernames:');
      duplicateUsernames.forEach(dup => {
        console.log(`   ${dup._id}: ${dup.count} users`);
      });
    }

    // Show some examples of users with usernames
    if (usersWithUsername.length > 0) {
      console.log('\n📝 Examples of users with usernames:');
      console.log('-'.repeat(50));
      for (let i = 0; i < Math.min(10, usersWithUsername.length); i++) {
        const user = usersWithUsername[i];
        console.log(`${user.name} → @${user.username}`);
      }
      if (usersWithUsername.length > 10) {
        console.log(`... and ${usersWithUsername.length - 10} more users`);
      }
    }

    // Show users without usernames
    if (usersWithoutUsername.length > 0) {
      console.log('\n❌ Users without usernames:');
      console.log('-'.repeat(50));
      for (let i = 0; i < Math.min(10, usersWithoutUsername.length); i++) {
        const user = usersWithoutUsername[i];
        console.log(`${user.name} (${user.email || 'no email'})`);
      }
      if (usersWithoutUsername.length > 10) {
        console.log(`... and ${usersWithoutUsername.length - 10} more users`);
      }
    }

    // Summary
    console.log('\n📈 Summary:');
    console.log(`Total users: ${totalUsers}`);
    console.log(`With usernames: ${usersWithUsername.length} (${((usersWithUsername.length / totalUsers) * 100).toFixed(1)}%)`);
    console.log(`Without usernames: ${usersWithoutUsername.length} (${((usersWithoutUsername.length / totalUsers) * 100).toFixed(1)}%)`);
    console.log(`Duplicate usernames: ${duplicateUsernames.length}`);

    if (usersWithoutUsername.length > 0) {
      console.log('\n💡 Run the migration to add usernames: npm run update-usernames');
    } else if (duplicateUsernames.length > 0) {
      console.log('\n⚠️  Fix duplicate usernames before proceeding');
    } else {
      console.log('\n🎉 All users have unique usernames!');
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the check
if (require.main === module) {
  checkUsernames()
    .then(() => {
      console.log('🏁 Username check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Username check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkUsernames }; 