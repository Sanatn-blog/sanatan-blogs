import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get current user's profile
async function getProfileHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const user = await User.findById(request.user?._id).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

// PUT - Update current user's profile
async function updateProfileHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, bio, location, expertise, achievements, socialLinks } = body;

    // Validate input
    if (name && (name.length < 2 || name.length > 50)) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    if (location && location.length > 100) {
      return NextResponse.json(
        { error: 'Location cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    
    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio?.trim() || null;
    if (location !== undefined) updateData.location = location?.trim() || null;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (achievements !== undefined) updateData.achievements = achievements;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

    const updatedUser = await User.findByIdAndUpdate(
      request.user?._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getProfileHandler);
export const PUT = requireAuth(updateProfileHandler); 