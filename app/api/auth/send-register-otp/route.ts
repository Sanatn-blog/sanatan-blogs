import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { phoneNumber, name } = body;

    if (!phoneNumber || !name) {
      return NextResponse.json(
        { message: 'Phone number and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists with this phone number
    const existingUser = await User.findOne({ phoneNumber });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Account already exists with this phone number' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a temporary user record with OTP
    const tempUser = new User({
      name,
      phoneNumber,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isTemporary: true // Flag to identify temp registration records
    });
    
    await tempUser.save();

    // In production, send SMS using service like Twilio
    console.log(`Registration OTP for ${phoneNumber}: ${otp}`);
    
    // For development, return success without sending actual SMS
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send registration OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 