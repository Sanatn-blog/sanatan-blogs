import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateSecureAccessToken, generateRefreshToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
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
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Check if OTP is valid and not expired
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify the user
    user.emailVerified = true;
    user.isActive = true;
    user.isVerified = true;
    user.verifiedAt = new Date();
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    // Set status to approved for verified users
    user.status = 'approved';
    
    await user.save();

    // Generate JWT tokens
    const accessToken = generateSecureAccessToken(user._id.toString(), user.password || '');
    const refreshToken = generateRefreshToken(user._id.toString());

    // Set refresh token in httpOnly cookie
    const response = NextResponse.json(
      { 
        message: 'Email verified successfully',
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified
        }
      },
      { status: 200 }
    );

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Verify email OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 