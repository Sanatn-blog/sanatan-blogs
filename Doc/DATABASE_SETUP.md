# Database Setup Guide

## Current Issue
You're getting a database connection error when trying to log in:
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

This means MongoDB is not running or not accessible.

## Solution Options

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

**Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)

**Step 2: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string

**Step 3: Update .env.local**
Replace the MONGODB_URI in your `.env.local` file:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/sanatan-blogs?retryWrites=true&w=majority
```

**Step 4: Test Connection**
```bash
npm run debug
```

### Option 2: Install MongoDB Locally

**For Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service:
   ```bash
   # Open Command Prompt as Administrator
   net start MongoDB
   ```

**For macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**For Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 3: Use Docker (Advanced)

**Step 1: Install Docker**
Download and install Docker from [docker.com](https://www.docker.com/products/docker-desktop)

**Step 2: Run MongoDB Container**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

**Step 3: Test Connection**
```bash
npm run debug
```

## Quick Fix for Testing

If you want to test the application quickly without setting up a database, you can temporarily modify the login route to bypass database authentication:

**⚠️ WARNING: This is for testing only! Don't use in production!**

1. Edit `app/api/auth/login/route.ts`
2. Add this temporary code at the beginning of the `loginHandler` function:

```typescript
// TEMPORARY: Bypass database for testing
if (email === 'test@example.com' && password === 'password') {
  const mockUser = {
    _id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    status: 'approved'
  };
  
  const tokenPayload = {
    userId: mockUser._id,
    email: mockUser.email,
    role: mockUser.role,
    status: mockUser.status
  };

  const accessToken = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const response = NextResponse.json({
    message: 'Login successful',
    user: mockUser,
    accessToken
  }, { status: 200 });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  });

  return response;
}
```

Then you can log in with:
- Email: `test@example.com`
- Password: `password`

## Testing Your Setup

### 1. Test Database Connection
```bash
npm run debug
```

### 2. Test API Endpoint
Visit: http://localhost:3000/api/test

### 3. Test Login
Try logging in with the credentials you set up.

## Troubleshooting

### Common Issues

**1. Connection Refused**
- MongoDB is not running
- Wrong port (should be 27017)
- Firewall blocking connection

**2. Authentication Failed**
- Wrong username/password in connection string
- User doesn't exist in database

**3. Network Error**
- Check internet connection (for Atlas)
- Check firewall settings
- Verify connection string format

### Debug Commands

**Check if MongoDB is running:**
```bash
# Windows
netstat -an | findstr 27017

# macOS/Linux
netstat -an | grep 27017
```

**Test MongoDB connection:**
```bash
# If MongoDB is installed locally
mongo mongodb://localhost:27017/sanatan-blogs
```

**Check environment variables:**
```bash
npm run debug
```

## Next Steps

1. **Choose a database option** from above
2. **Update your .env.local** with the correct MONGODB_URI
3. **Test the connection** using `npm run debug`
4. **Try logging in** again

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for database users
- Enable network access restrictions in MongoDB Atlas
- Use environment-specific connection strings

## Need Help?

If you're still having issues:
1. Check the console for specific error messages
2. Verify your connection string format
3. Ensure MongoDB is running and accessible
4. Check firewall and network settings 