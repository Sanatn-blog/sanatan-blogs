import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Check if user exists with this phone number
    const existingUser = await User.findOne({ phoneNumber });
    
    if (!existingUser) {
      return NextResponse.json(
        { message: 'No account found with this phone number' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in user document (in production, use Redis or similar)
    existingUser.otp = otp;
    existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await existingUser.save();

    // In production, send SMS using service like Twilio
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    // For development, return success without sending actual SMS
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 