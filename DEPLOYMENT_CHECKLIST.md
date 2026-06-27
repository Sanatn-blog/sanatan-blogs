# Deployment Checklist - Sanatan Blogs

## Pre-Deployment Verification

### ✅ Code Changes

- [x] All API routes have `export const dynamic = "force-dynamic"`
- [x] All API routes have `export const revalidate = 0`
- [x] Main page.tsx has `export const dynamic = 'force-dynamic'`
- [x] next.config.ts has `generateEtags: false`

### ✅ Database Configuration

- [ ] Verify MONGODB_URI is set in Vercel environment variables
- [ ] Test database connection from Vercel
- [ ] Verify all database indexes are created

### ✅ Environment Variables (Vercel)

Check all required environment variables are set:

- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - JWT token secret
- [ ] `JWT_REFRESH_SECRET` - JWT refresh token secret
- [ ] `NEXTAUTH_SECRET` - NextAuth secret
- [ ] `NEXTAUTH_URL` - Production URL
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `EMAIL_HOST` - Email SMTP host
- [ ] `EMAIL_PORT` - Email SMTP port
- [ ] `EMAIL_USER` - Email username
- [ ] `EMAIL_PASSWORD` - Email password
- [ ] `RAZORPAY_KEY_ID` - Razorpay key ID
- [ ] `RAZORPAY_KEY_SECRET` - Razorpay key secret
- [ ] `NODE_ENV` - Set to `production`

### ✅ Build Test

```bash
npm run build
```

- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All routes compile successfully

### ✅ Local Testing

Test these features locally before deploying:

1. **Blog System**
   - [ ] Create new blog post
   - [ ] Edit existing blog post
   - [ ] Delete blog post
   - [ ] View blog list (verify fresh data)
   - [ ] View single blog (verify fresh data)

2. **Comments**
   - [ ] Add comment
   - [ ] Reply to comment
   - [ ] Edit comment
   - [ ] Delete comment
   - [ ] Verify comments appear immediately

3. **User Features**
   - [ ] Register new user
   - [ ] Login
   - [ ] Update profile
   - [ ] Follow/unfollow user
   - [ ] View followers/following

4. **Admin Features**
   - [ ] View dashboard stats
   - [ ] Manage users
   - [ ] Manage content
   - [ ] View contacts

---

## Deployment Steps

### 1. Commit and Push Changes

```bash
git add .
git commit -m "Fix: Add dynamic rendering and disable caching for fresh content"
git push origin main
```

### 2. Deploy to Vercel

- [ ] Push triggers automatic deployment
- [ ] Monitor deployment logs in Vercel dashboard
- [ ] Wait for deployment to complete

### 3. Initial Verification (Within 5 minutes)

- [ ] Visit homepage - check if it loads
- [ ] Visit `/blogs` - check if blogs load
- [ ] Open a single blog post
- [ ] Check browser console for errors

---

## Post-Deployment Testing

### Immediate Tests (First 15 minutes)

#### 1. Fresh Content Test

- [ ] Create a new blog post
- [ ] Immediately check `/blogs` page
- [ ] Verify new post appears **without** page refresh
- [ ] Check if featured image displays correctly

#### 2. Update Test

- [ ] Edit an existing blog title
- [ ] Visit blog detail page
- [ ] Verify title updated **without** cache delay
- [ ] Update featured image
- [ ] Verify new image loads immediately

#### 3. Comments Test

- [ ] Add a new comment on a blog
- [ ] Refresh page
- [ ] Verify comment appears immediately
- [ ] Try replying to a comment
- [ ] Verify reply appears instantly

#### 4. User Profile Test

- [ ] Update user profile information
- [ ] Visit profile page
- [ ] Verify changes reflect immediately
- [ ] Update avatar image
- [ ] Verify new avatar displays

#### 5. Admin Dashboard Test

- [ ] Login as admin
- [ ] Check dashboard statistics
- [ ] Create/approve a user
- [ ] Verify stats update in real-time

### Caching Verification Tests

#### Test 1: Blog List Freshness

```
1. Note current blog count on /blogs
2. Create new blog post
3. Visit /blogs (new tab, incognito if possible)
4. Expected: New blog appears immediately
5. Result: PASS/FAIL
```

#### Test 2: Blog Detail Freshness

```
1. Open a blog post
2. Edit the blog content
3. Refresh the blog post page
4. Expected: Updated content shows immediately
5. Result: PASS/FAIL
```

#### Test 3: API Response Freshness

```
1. Open DevTools Network tab
2. Visit /blogs page
3. Check /api/blogs request
4. Look for Cache-Control header
5. Expected: "no-store, no-cache, must-revalidate"
6. Result: PASS/FAIL
```

#### Test 4: Image Updates

```
1. Update blog featured image
2. Visit blog detail page
3. Check if new image loads
4. Open image URL directly
5. Expected: New image, not cached version
6. Result: PASS/FAIL
```

#### Test 5: Cross-Device Test

```
1. Create blog on desktop
2. Immediately check on mobile device
3. Expected: New blog visible on mobile
4. Result: PASS/FAIL
```

### Browser Caching Test

- [ ] Test in Chrome (regular)
- [ ] Test in Chrome (incognito)
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test on Mobile browser

---

## Monitoring (First 24 Hours)

### Check Every Hour

- [ ] Site is accessible
- [ ] New content appears immediately
- [ ] No 500 errors in logs
- [ ] Database connections stable

### Performance Monitoring

- [ ] Page load times acceptable
- [ ] API response times < 2 seconds
- [ ] No memory leaks
- [ ] CDN serving static assets correctly

### User Feedback

- [ ] Monitor user reports
- [ ] Check admin notifications
- [ ] Review contact form submissions

---

## Rollback Plan

If issues occur:

### Quick Rollback (Vercel Dashboard)

1. Go to Vercel Dashboard
2. Find previous deployment
3. Click "Promote to Production"
4. Verify site works with old version

### Git Rollback

```bash
git revert HEAD
git push origin main
```

---

## Success Criteria

All these must be TRUE:

- ✅ New blogs appear immediately after publishing
- ✅ Updated content shows without delay
- ✅ Comments appear in real-time
- ✅ Images update correctly
- ✅ Admin dashboard shows current stats
- ✅ No caching-related user complaints
- ✅ Page load times remain acceptable
- ✅ No increase in error rates

---

## Contact Information

**Technical Lead:** [Your Name]  
**Emergency Contact:** [Phone/Email]  
**Vercel Account:** [Account Email]  
**MongoDB Support:** [Support Contact]

---

## Notes

### Cache Headers to Verify

All API responses should include:

```
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0
Pragma: no-cache
Expires: 0
```

### Common Issues & Solutions

**Issue:** Content still cached after deployment  
**Solution:**

1. Check if `dynamic = "force-dynamic"` is in the route
2. Verify environment variables are set
3. Clear CDN cache in Vercel settings

**Issue:** Images not updating  
**Solution:**

1. Check Cloudinary configuration
2. Verify image URLs are unique
3. Clear browser cache

**Issue:** API returning 500 errors  
**Solution:**

1. Check MongoDB connection
2. Verify environment variables
3. Check Vercel function logs

---

## Sign-Off

- [ ] Technical Lead Approval: ******\_\_\_\_******
- [ ] QA Approval: ******\_\_\_\_******
- [ ] Deployment Date: ******\_\_\_\_******
- [ ] Deployment Time: ******\_\_\_\_******
- [ ] Deployed By: ******\_\_\_\_******

---

## Post-Deployment Report

**Date:** ****\_\_****  
**Time:** ****\_\_****  
**Deployment Status:** SUCCESS / FAILED  
**Issues Found:**

- Issue 1:
- Issue 2:

**Performance Metrics:**

- Average Page Load: **\_**ms
- API Response Time: **\_**ms
- Error Rate: **\_**%

**Next Steps:**

1.
2.
3.
