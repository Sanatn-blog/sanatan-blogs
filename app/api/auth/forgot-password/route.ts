import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json(
        { message: 'If an account with this email exists, a reset code has been sent' },
        { status: 200 }
      );
    }

    // Check if user is approved
    if (user.status !== 'approved') {
      return NextResponse.json(
        { message: 'If an account with this email exists, a reset code has been sent' },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update user with OTP and expiry (10 minutes) - using updateOne to avoid validation issues
    await User.updateOne(
      { _id: user._id },
      { 
        otp: otp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    );

    // Send password reset email
    const emailContent = generatePasswordResetEmail(email, otp, user.name);
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    return NextResponse.json(
      { message: 'If an account with this email exists, a reset code has been sent' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 