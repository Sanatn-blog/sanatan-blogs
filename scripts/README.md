# Username Migration Scripts

This directory contains migration scripts for the Sanatan Blogs application.

## Username Migration

The `update-usernames.js` script updates all existing users in MongoDB to have unique usernames while preserving their full names.

### What it does:

1. **Finds users without usernames**: Identifies users who don't have a username field or have empty/null usernames
2. **Generates unique usernames**: Creates unique usernames based on each user's full name
3. **Updates database**: Updates each user record with their new unique username
4. **Preserves full names**: Keeps the original `name` field unchanged
5. **Provides detailed logging**: Shows progress and results of the migration

### Username Generation Rules:

- Based on the user's full name (converted to lowercase, alphanumeric only)
- Minimum 3 characters, maximum 30 characters
- Only letters, numbers, and underscores allowed
- Guaranteed unique across all users
- If conflicts exist, adds random numbers (1-9999)
- Fallback: adds timestamp if 100 attempts fail

### Before Running:

1. **Backup your database** - Always backup your MongoDB database before running migrations
2. **Set environment variables** - Make sure your MongoDB connection string is set:
   ```bash
   export MONGODB_URI="your_mongodb_connection_string"
   ```
3. **Install dependencies** - Run `npm install` in the scripts directory

### Available Scripts:

1. **Check current state** - See which users have usernames:
   ```bash
   npm run check
   ```

2. **Dry run** - See what would be changed without making changes:
   ```bash
   npm run dry-run
   ```

3. **Run migration** - Actually update the usernames:
   ```bash
   npm run update-usernames
   ```

### Running the Migration:

```bash
# Navigate to scripts directory
cd scripts

# Install dependencies
npm install

# First, check current state
npm run check

# Then, do a dry run to see what would change
npm run dry-run

# Finally, run the actual migration
npm run update-usernames
```

Or run directly:
```bash
node check-usernames.js
node update-usernames-dry-run.js
node update-usernames.js
```

### Example Output:

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully!
📊 Found 15 users without usernames
🔄 Processing user: John Doe (john@example.com)
✅ Updated John Doe with username: johndoe
🔄 Processing user: Jane Smith (jane@example.com)
✅ Updated Jane Smith with username: janesmith
...

📈 Migration Summary:
✅ Successfully updated: 15 users
❌ Failed to update: 0 users
📊 Total processed: 15 users
🎉 All users now have unique usernames!
🔌 Disconnected from MongoDB
🏁 Migration completed!
```

### Safety Features:

- **Dry run option**: Can be modified to show what would be changed without actually updating
- **Error handling**: Continues processing other users if one fails
- **Progress logging**: Shows real-time progress
- **Verification**: Checks that all users have usernames after migration
- **Rate limiting**: Small delays between updates to avoid overwhelming the database

### Troubleshooting:

1. **Connection errors**: Check your MongoDB connection string
2. **Permission errors**: Ensure your MongoDB user has write permissions
3. **Duplicate key errors**: The script handles these automatically by generating unique usernames
4. **Validation errors**: The script includes proper validation for username format

### After Migration:

1. **Verify results**: Check that all users now have unique usernames
2. **Update application**: Ensure your application code uses the `username` field where appropriate
3. **Test functionality**: Test user login, profile pages, and any username-dependent features

### Files:

- `check-usernames.js` - Check current username state
- `update-usernames-dry-run.js` - Dry run migration (no changes)
- `update-usernames.js` - Main migration script
- `User.js` - CommonJS version of User model
- `utils.js` - CommonJS version of utility functions
- `package.json` - Dependencies for the scripts
- `README.md` - This documentation 