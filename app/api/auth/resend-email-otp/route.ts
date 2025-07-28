import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generateEmailVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { message: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send new verification email
    const emailContent = generateEmailVerificationEmail(email, otp, user.name);
    const emailSent = await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Resend email OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 