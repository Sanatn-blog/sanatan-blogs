// TEMPORARILY DISABLED: Registration OTP Verification
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import connectDB from '@/lib/mongodb';
// import User from '@/models/User';

export async function POST() {
  // Registration OTP verification temporarily disabled
  return NextResponse.json(
    { message: 'Registration OTP verification is temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  try {
    await connectDB();
    
    const body = await request.json();
    const { phoneNumber, otp, name } = body;

    if (!phoneNumber || !otp || !name) {
      return NextResponse.json(
        { message: 'Phone number, OTP, and name are required' },
        { status: 400 }
      );
    }

    // Find temporary user record
    const tempUser = await User.findOne({ 
      phoneNumber, 
      isTemporary: true 
    });
    
    if (!tempUser) {
      return NextResponse.json(
        { message: 'Invalid registration session' },
        { status: 400 }
      );
    }

    // Check if OTP is valid and not expired
    if (!tempUser.otp || tempUser.otp !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (!tempUser.otpExpiry || tempUser.otpExpiry < new Date()) {
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Create permanent user account
    tempUser.otp = undefined;
    tempUser.otpExpiry = undefined;
    tempUser.isTemporary = undefined;
    tempUser.isActive = true;
    tempUser.isVerified = true;
    tempUser.verifiedAt = new Date();
    
    await tempUser.save();

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        id: tempUser._id, 
        phoneNumber: tempUser.phoneNumber,
        name: tempUser.name,
        role: tempUser.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: tempUser._id },
              process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set refresh token in httpOnly cookie
    const response = NextResponse.json(
      { 
        message: 'Registration successful',
        accessToken,
        user: {
          id: tempUser._id,
          name: tempUser.name,
          phoneNumber: tempUser.phoneNumber,
          role: tempUser.role
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
    console.error('Verify registration OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  */
} 