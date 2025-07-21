import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, newPassword, newUsername } = body;
    
    if (!email) {
      return NextResponse.json({
        status: 'error',
        message: 'Email is required'
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
    
    // Fix username if provided and invalid
    if (newUsername) {
      user.username = newUsername;
    } else if (user.username && user.username.includes('-')) {
      // Fix invalid username by replacing hyphens with underscores
      user.username = user.username.replace(/-/g, '_');
    }
    
    // Update password if provided
    if (newPassword) {
      user.password = newPassword;
    }
    
    await user.save();
    
    console.log('✅ User updated:', user.email);
    
    return NextResponse.json({
      status: 'success',
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
      }
    });
    
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 