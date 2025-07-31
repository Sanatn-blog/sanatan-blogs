# Environment Variables Setup

Create a `.env.local` file in the root directory and add the following variables:

## Required Variables

### Google Analytics (NEW)
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
Replace `G-XXXXXXXXXX` with your actual Google Analytics 4 tracking ID.

### Database
```
MONGODB_URI=mongodb://localhost:27017/sanatan-blogs
```

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-here
```

### Email Configuration (SMTP)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@sanatanblogs.com
```

### Cloudinary (Image uploads)
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Social Authentication
```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
```

### App Configuration
```
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Admin Setup (Optional)
```
ADMIN_EMAIL=admin@sanatanblogs.com
DEFAULT_ADMIN_PASSWORD=admin123
```

## Getting Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or select existing one
3. Go to Admin > Property Settings
4. Copy your Measurement ID (starts with G-)
5. Add it to your `.env.local` file as `NEXT_PUBLIC_GA_ID`

## Note
- Never commit `.env.local` to version control
- All `NEXT_PUBLIC_` variables are exposed to the browser
- Restart your development server after adding new environment variables