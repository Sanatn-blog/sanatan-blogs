import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { newUsername } = await request.json();

    // Validate input
    if (!newUsername) {
      return NextResponse.json(
        { error: 'New username is required' },
        { status: 400 }
      );
    }

    if (newUsername.length < 2 || newUsername.length > 50) {
      return NextResponse.json(
        { error: 'Username must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    // Check if username contains only valid characters (letters, numbers, underscores, hyphens)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(newUsername)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, underscores, and hyphens' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if username is already taken by another user
    const existingUser = await User.findOne({ 
      name: newUsername,
      _id: { $ne: request.user?._id } // Exclude current user
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Update username
    const updatedUser = await User.findByIdAndUpdate(
      request.user?._id,
      { name: newUsername },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Username changed successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Username change error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 