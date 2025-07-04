// TEMPORARILY DISABLED: OTP Verification
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import connectDB from '@/lib/mongodb';
// import User from '@/models/User';

export async function POST() {
  // OTP verification temporarily disabled
  return NextResponse.json(
    { message: 'OTP verification is temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  try {
    await connectDB();
    
    const body = await request.json();
    const { phoneNumber, otp } = body;

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Find user with phone number
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid phone number' },
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

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
              process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set refresh token in httpOnly cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
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
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  */
} 