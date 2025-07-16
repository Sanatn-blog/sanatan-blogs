# Troubleshooting Guide - My Blogs Page

## Issue: "My Blogs" page not showing blogs

If you're not seeing any blogs on your "My Blogs" page, follow these steps to diagnose and fix the issue:

### Step 1: Check Authentication

1. **Verify you're logged in:**
   - Make sure you're logged into the application
   - Check if you have a valid access token in localStorage
   - Open browser dev tools → Application → Local Storage → Check for `accessToken`

2. **Test authentication endpoint:**
   - Visit `/api/auth/me` in your browser
   - Should return your user information if authenticated

### Step 2: Check Database Connection

1. **Test database connection:**
   - Visit `/api/test` in your browser
   - Should show successful connection and blog count

2. **Verify environment variables:**
   - Check `.env.local` file exists
   - Ensure `MONGODB_URI` is set correctly
   - Ensure `JWT_SECRET` is set

### Step 3: Check if Blogs Exist

1. **Check if you have any blogs:**
   - Visit `/api/blogs` to see all published blogs
   - If no blogs exist, you need to create some first

2. **Check if you're the author:**
   - Blogs in "My Blogs" must have you as the author
   - If you created blogs through a different account, they won't show up

### Step 4: Create Sample Data

If you don't have any blogs, create some:

1. **Create a user account:**
   ```bash
   # Register through the app interface
   # Or use the admin panel to create/approve a user
   ```

2. **Seed with sample blogs:**
   ```bash
   npm run seed
   ```

3. **Create blogs manually:**
   - Go to `/write-blog` page
   - Create and publish some blogs

### Step 5: Debug Common Issues

#### Issue: "User not authenticated"
- **Cause:** Missing or invalid access token
- **Solution:** Log out and log back in

#### Issue: "Database connection failed"
- **Cause:** MongoDB not running or wrong connection string
- **Solution:** 
  - Check MongoDB is running
  - Verify MONGODB_URI in `.env.local`
  - Restart the development server

#### Issue: "No blogs found"
- **Cause:** No blogs exist for the current user
- **Solution:** Create blogs through the write-blog interface

#### Issue: "System configuration error"
- **Cause:** Missing environment variables
- **Solution:** Run `npm run setup` and configure `.env.local`

### Step 6: Browser Console Debugging

1. **Open browser dev tools** (F12)
2. **Check Console tab** for error messages
3. **Check Network tab** when loading My Blogs page:
   - Look for `/api/blogs/my-blogs` request
   - Check if it returns 200 status
   - Check response body for blogs data

### Step 7: Server Logs

1. **Check terminal/console** where you ran `npm run dev`
2. **Look for error messages** related to:
   - Database connection
   - Authentication
   - API requests

### Common Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "User not authenticated" | Missing/invalid token | Log in again |
| "Database connection failed" | MongoDB not running | Start MongoDB, check connection string |
| "No blogs found" | No blogs exist for user | Create blogs or check author field |
| "System configuration error" | Missing env vars | Run `npm run setup` |
| "Request timeout" | Network/slow connection | Check internet, try again |

### Quick Fix Checklist

- [ ] Are you logged in?
- [ ] Is MongoDB running?
- [ ] Is `.env.local` configured?
- [ ] Do you have any blogs in the database?
- [ ] Are the blogs authored by your user account?
- [ ] Is the development server running?
- [ ] Are there any console errors?

### Still Having Issues?

1. **Check the test endpoint:** Visit `/api/test` to verify database connection
2. **Check authentication:** Visit `/api/auth/me` to verify login status
3. **Create test data:** Run `npm run seed` to add sample blogs
4. **Check server logs:** Look for error messages in the terminal

### Getting Help

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Check the server terminal for backend errors
3. Verify your MongoDB connection string
4. Ensure all environment variables are set correctly
5. Try creating a fresh user account and test with that 