import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import { requireAdmin, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get detailed user information
async function getUserDetailsHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await User.findById(userId)
      .select('-password -emailVerificationToken -resetPasswordToken')
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's blogs count
    const blogsCount = await Blog.countDocuments({ author: userId });

    // Get user's comments count
    const commentsCount = await Comment.countDocuments({ author: userId });

    // Get recent blogs (last 5)
    const recentBlogs = await Blog.find({ author: userId })
      .select('title slug createdAt status')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get recent comments (last 5)
    const recentComments = await Comment.find({ author: userId })
      .select('content createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      user: {
        ...user,
        blogsCount,
        commentsCount,
        recentBlogs,
        recentComments
      }
    });

  } catch (error) {
    console.error('Get user details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}

// PATCH - Update user details
async function updateUserHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id: userId } = await params;
    const body = await request.json();
    const { 
      name, 
      email, 
      role, 
      status, 
      bio, 
      socialLinks, 
      isVerified, 
      isActive,
      emailVerified 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent modifying super admin users (unless you're super admin)
    if (user.role === 'super_admin' && request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Cannot modify super admin users' },
        { status: 403 }
      );
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;
    if (bio !== undefined) user.bio = bio;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
      if (isVerified && !user.verifiedAt) {
        user.verifiedAt = new Date();
      }
    }
    if (isActive !== undefined) user.isActive = isActive;
    if (emailVerified !== undefined) user.emailVerified = emailVerified;

    await user.save();

    // Log the admin action
    console.log(`Admin ${request.user?.email} updated user ${user.email}`);

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        isActive: user.isActive,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
async function deleteUserHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting super admin users (unless you're super admin)
    if (user.role === 'super_admin' && request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Cannot delete super admin users' },
        { status: 403 }
      );
    }

    // Prevent deleting yourself
    if (user._id.toString() === request.user?._id?.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user's blogs
    await Blog.deleteMany({ author: userId });

    // Delete user's comments
    await Comment.deleteMany({ author: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Log the admin action
    console.log(`Admin ${request.user?.email} deleted user ${user.email}`);

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// Apply authentication middleware
export const GET = requireAdmin(getUserDetailsHandler);
export const PATCH = requireAdmin(updateUserHandler);
export const DELETE = requireAdmin(deleteUserHandler); 