# Email Setup for Production

This document explains how to set up email functionality for the Sanatan Blogs application in production.

## Current Implementation

The application currently uses a basic email utility (`lib/email.ts`) that logs emails to the console for development purposes. For production, you'll need to implement actual email sending.

## Email Services

Here are some popular email services you can use:

### 1. Nodemailer with SMTP

Install nodemailer:
```bash
npm install nodemailer
npm install @types/nodemailer --save-dev
```

Update `lib/email.ts`:
```typescript
import nodemailer from 'nodemailer';

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
```

Environment variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com
```

### 2. SendGrid

Install SendGrid:
```bash
npm install @sendgrid/mail
```

Update `lib/email.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await sgMail.send({
      from: process.env.FROM_EMAIL!,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
```

Environment variables:
```env
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### 3. AWS SES

Install AWS SDK:
```bash
npm install @aws-sdk/client-ses
```

Update `lib/email.ts`:
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const command = new SendEmailCommand({
      Source: process.env.FROM_EMAIL,
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
        },
        Body: {
          Html: {
            Data: options.html,
          },
          Text: {
            Data: options.text || '',
          },
        },
      },
    });

    await ses.send(command);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
```

Environment variables:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
FROM_EMAIL=noreply@yourdomain.com
```

### 4. Resend

Install Resend:
```bash
npm install resend
```

Update `lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
```

Environment variables:
```env
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
```

## Email Templates

The application includes email templates for:
- Password reset emails
- Welcome emails

These templates are defined in `lib/email.ts` and can be customized as needed.

## Testing

For testing purposes, you can use services like:
- Mailtrap (for development)
- Ethereal Email (for testing)

## Security Considerations

1. Always use environment variables for sensitive information
2. Use app-specific passwords for Gmail
3. Verify your domain with your email service provider
4. Set up SPF, DKIM, and DMARC records for better deliverability
5. Monitor email sending limits and bounce rates

## Rate Limiting

Consider implementing rate limiting for email sending to prevent abuse:
- Limit password reset requests per email
- Implement cooldown periods
- Monitor for suspicious activity 