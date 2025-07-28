import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generatePasswordResetEmail(email: string, otp: string, userName: string) {
  const subject = 'Reset Your Password - Sanatan Blogs';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
          <p>Sanatan Blogs</p>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password for your Sanatan Blogs account.</p>
          <p>Use the following verification code to reset your password:</p>
          
          <div class="otp-code">${otp}</div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <p>Best regards,<br>The Sanatan Blogs Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Reset Your Password - Sanatan Blogs

Hello ${userName},

We received a request to reset your password for your Sanatan Blogs account.

Use the following verification code to reset your password:

${otp}

This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The Sanatan Blogs Team

This email was sent to ${email}
  `;

  return { subject, html, text };
}

export function generateWelcomeEmail(email: string, userName: string) {
  const subject = 'Welcome to Sanatan Blogs!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Sanatan Blogs</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Sanatan Blogs!</h1>
          <p>Your spiritual journey begins here</p>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Welcome to Sanatan Blogs! We're excited to have you join our community of spiritual seekers and wisdom enthusiasts.</p>
          
          <p>Here's what you can do with your new account:</p>
          <ul>
            <li>Read inspiring spiritual articles and blogs</li>
            <li>Connect with like-minded individuals</li>
            <li>Share your own spiritual insights</li>
            <li>Participate in meaningful discussions</li>
          </ul>
          
          <p>Ready to start your journey?</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">Explore Sanatan Blogs</a>
          
          <p>Best regards,<br>The Sanatan Blogs Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to Sanatan Blogs!

Hello ${userName},

Welcome to Sanatan Blogs! We're excited to have you join our community of spiritual seekers and wisdom enthusiasts.

Here's what you can do with your new account:
- Read inspiring spiritual articles and blogs
- Connect with like-minded individuals
- Share your own spiritual insights
- Participate in meaningful discussions

Ready to start your journey? Visit our website to explore.

Best regards,
The Sanatan Blogs Team

This email was sent to ${email}
  `;

  return { subject, html, text };
} 

export function generateEmailVerificationEmail(email: string, otp: string, userName: string) {
  const subject = 'Verify Your Email - Sanatan Blogs';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
          <p>Sanatan Blogs</p>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Thank you for registering with Sanatan Blogs! To complete your registration, please verify your email address.</p>
          <p>Use the following verification code to verify your email:</p>
          
          <div class="otp-code">${otp}</div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <p>Best regards,<br>The Sanatan Blogs Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Verify Your Email - Sanatan Blogs

Hello ${userName},

Thank you for registering with Sanatan Blogs! To complete your registration, please verify your email address.

Use the following verification code to verify your email:

${otp}

This code will expire in 10 minutes.

If you didn't create an account with us, please ignore this email.

Best regards,
The Sanatan Blogs Team

This email was sent to ${email}
  `;

  return { subject, html, text };
} 