# Nodemailer Setup Guide

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com
```

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Testing

1. Start your development server
2. Go to the forgot password page
3. Enter an email address
4. Check your server console for email logs
5. Check the recipient's inbox for the password reset email

## Troubleshooting

- **Authentication failed**: Check your app password
- **Connection timeout**: Verify SMTP host and port
- **SSL/TLS issues**: Try `SMTP_SECURE=false` for port 587, `true` for port 465 