# Email Verification System

This document describes the email verification system implemented for user registration in Sanatan Blogs.

## Overview

The email verification system ensures that users provide a valid email address during registration and verifies their ownership of that email through OTP (One-Time Password) verification.

## Features

### 1. Registration Flow
- Users register with their email, username, password, and other details
- A 6-digit OTP is generated and sent to the user's email
- User account is created with `status: 'pending'` and `emailVerified: false`
- User is redirected to the verification page

### 2. Email Verification
- Users enter the 6-digit OTP received via email
- OTP is validated against the stored value in the database
- OTP expires after 10 minutes for security
- Upon successful verification:
  - `emailVerified` is set to `true`
  - `status` is changed to `'approved'`
  - `isActive` is set to `true`
  - User receives JWT tokens for authentication

### 3. Resend OTP
- Users can request a new OTP if they don't receive the initial email
- 60-second cooldown between resend requests
- New OTP is generated and sent to the user's email

### 4. Login Protection
- Unverified users cannot log in
- Login attempts by unverified users are redirected to the verification page
- Clear error messages guide users to complete verification

## API Endpoints

### 1. Registration
- **POST** `/api/auth/register`
- Creates user account and sends verification email
- Returns `requiresVerification: true` to indicate email verification is needed

### 2. Email Verification
- **POST** `/api/auth/verify-email-otp`
- Verifies the OTP and activates the user account
- Returns JWT tokens upon successful verification

### 3. Resend OTP
- **POST** `/api/auth/resend-email-otp`
- Sends a new verification OTP to the user's email
- Includes rate limiting to prevent abuse

## Pages

### 1. Registration Page (`/register`)
- Collects user information
- Redirects to verification page after successful registration

### 2. Verification Page (`/verify-email`)
- Allows users to enter their OTP
- Provides resend OTP functionality
- Shows countdown timer for resend button

### 3. Success Page (`/email-verified`)
- Confirms successful email verification
- Automatically redirects to dashboard after 3 seconds

## Database Schema Updates

The User model includes these fields for email verification:

```typescript
{
  emailVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpiry: Date,
  isActive: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  }
}
```

## Email Templates

### Verification Email
- Professional HTML email template
- Includes 6-digit OTP code
- 10-minute expiration notice
- Branded with Sanatan Blogs styling

## Security Features

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **Rate Limiting**: Registration and resend endpoints are rate-limited
3. **Secure Tokens**: JWT tokens include password hash for additional security
4. **HTTP-Only Cookies**: Refresh tokens stored in secure HTTP-only cookies
5. **Input Validation**: Comprehensive validation for all inputs

## Environment Variables Required

Make sure these environment variables are set for email functionality:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_SECURE=false
FROM_EMAIL=noreply@yourdomain.com
JWT_SECRET=your-jwt-secret
```

## Testing

To test the email verification system:

1. Register a new user with a valid email
2. Check the email for the verification code
3. Enter the code on the verification page
4. Verify successful redirection to dashboard
5. Test login with unverified account (should redirect to verification)
6. Test resend OTP functionality

## Error Handling

The system handles various error scenarios:

- Invalid OTP codes
- Expired OTP codes
- Email sending failures
- Network errors
- Database connection issues

All errors provide clear, user-friendly messages to guide users through the verification process. 