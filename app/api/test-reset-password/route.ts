import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, newPassword } = body;
    
    if (!email || !newPassword) {
      return NextResponse.json({
        status: 'error',
        message: 'Email and new password are required'
      }, { status: 400 });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return NextResponse.json({
        status: 'error',
        message: 'User not found'
      }, { status: 404 });
    }
    
    // Update password (will be hashed by the pre-save hook)
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Password reset for user:', user.email);
    
    return NextResponse.json({
      status: 'success',
      message: 'Password reset successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 