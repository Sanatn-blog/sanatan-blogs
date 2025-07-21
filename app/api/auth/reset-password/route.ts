import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp, newPassword } = body;

    // Validate required fields
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Additional password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    console.log('User lookup result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or OTP' },
        { status: 400 }
      );
    }

    console.log('User status:', user.status);
    console.log('User OTP:', user.otp);
    console.log('User OTP expiry:', user.otpExpiry);

    // Check if user is approved
    if (user.status !== 'approved') {
      return NextResponse.json(
        { message: 'Invalid email or OTP' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json(
        { message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if new password is different from current password
    if (user.password) {
      try {
        const isSamePassword = await bcryptjs.compare(newPassword, user.password);
        if (isSamePassword) {
          return NextResponse.json(
            { message: 'New password must be different from your current password' },
            { status: 400 }
          );
        }
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        // Continue with password reset even if comparison fails
      }
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedNewPassword = await bcryptjs.hash(newPassword, saltRounds);

    console.log('Password reset attempt for user:', user.email);
    console.log('OTP verified, updating password...');

    try {
      // Update password and clear OTP using updateOne to avoid middleware conflicts
      const updateResult = await User.updateOne(
        { _id: user._id },
        { 
          password: hashedNewPassword,
          otp: null,
          otpExpiry: null
        }
      );

      console.log('Password update result:', updateResult);
      
      if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to update password - no documents modified');
      }
    } catch (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    
    // Provide more specific error messages for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
} 