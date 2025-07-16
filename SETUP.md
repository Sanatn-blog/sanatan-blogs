# Sanatan Blogs - Setup Guide

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sanatan-blogs
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sanatan-blogs

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### Optional Variables

```bash
# NextAuth Configuration (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (if using Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (if using Facebook login)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud service)

3. **Create environment file:**
   ```bash
   npm run setup
   # This will create .env.local with generated secrets
   ```

4. **Edit environment file:**
   ```bash
   # Edit .env.local and update MONGODB_URI with your actual database connection string
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sanatan-blogs
   # For local MongoDB: mongodb://localhost:27017/sanatan-blogs
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Test your setup:**
   ```bash
   # Visit http://localhost:3000/api/test to verify database connection
   ```

7. **Seed with sample data (optional):**
   ```bash
   # First create and approve a user through the app interface
   npm run seed
   ```

## Common Issues

### "Error Loading Blogs" Issue

If you're seeing "Error Loading Blogs" or "Failed to fetch blogs", check:

1. **MongoDB Connection:**
   - Ensure MongoDB is running
   - Verify MONGODB_URI is correct
   - Check network connectivity

2. **Environment Variables:**
   - Ensure `.env.local` exists
   - Verify MONGODB_URI and JWT_SECRET are set
   - Restart the development server after changes

3. **Database Setup:**
   - Ensure the database exists
   - Check if there are any blogs in the database

### Testing Database Connection

You can test the database connection by visiting `/api/test` endpoint (if available) or check the console logs when accessing `/blogs`.

## Troubleshooting

1. **Check console logs** in both browser and terminal
2. **Verify environment variables** are loaded correctly
3. **Test database connection** manually
4. **Check network requests** in browser developer tools 