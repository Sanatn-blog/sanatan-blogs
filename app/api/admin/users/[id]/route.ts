import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get user details
async function getUserHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(request.user?.role || '')) {
      return NextResponse.json(
        { error: 'Admin or Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    
    const user = await User.findById(userId).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

// PUT - Update user (including role management for Super Admin)
async function updateUserHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Only Super Admin can update user roles
    if (request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super Admin access required for user management' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();
    
    const { role, status, ...otherFields } = body;
    
    // Prevent Super Admin from modifying their own role
    if (userId === request.user?.userId && role && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Cannot modify your own role' },
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

    // Update fields
    const updateData: Record<string, unknown> = {};
    
    if (role && ['user', 'admin', 'super_admin'].includes(role)) {
      updateData.role = role;
    }
    
    if (status && ['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      updateData.status = status;
    }
    
    // Add other allowed fields
    Object.keys(otherFields).forEach(key => {
      if (['name', 'bio', 'location', 'expertise', 'achievements', 'socialLinks'].includes(key)) {
        updateData[key] = otherFields[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');

    console.log(`User updated by Super Admin:`, updatedUser?.email, 'Role:', updatedUser?.role, 'Status:', updatedUser?.status);

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (Super Admin only)
async function deleteUserHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Only Super Admin can delete users
    if (request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super Admin access required for user deletion' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    
    // Prevent Super Admin from deleting themselves
    if (userId === request.user?.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
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

    // Check if user has blogs
    const userBlogs = await Blog.find({ author: userId });
    
    if (userBlogs.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with existing blogs. Please delete or transfer their blogs first.' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);

    console.log(`User deleted by Super Admin:`, user.email);

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

// PATCH - Update user status and role (Admin/Super Admin)
async function patchUserHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(request.user?.role || '')) {
      return NextResponse.json(
        { error: 'Admin or Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();
    
    const { role, status } = body;
    
    // Prevent users from modifying their own role/status
    if (userId === request.user?.userId) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
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

    // Only Super Admin can modify roles
    if (role && request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super Admin access required for role management' },
        { status: 403 }
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
    const updateData: Record<string, unknown> = {};
    
    if (role && ['user', 'admin', 'super_admin'].includes(role)) {
      updateData.role = role;
    }
    
    if (status && ['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      updateData.status = status;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -otp -otpExpiry');

    console.log(`User updated by ${request.user?.role}:`, updatedUser?.email, 'Role:', updatedUser?.role, 'Status:', updatedUser?.status);

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Patch user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getUserHandler);
export const PATCH = requireAuth(patchUserHandler);
export const PUT = requireAuth(updateUserHandler);
export const DELETE = requireAuth(deleteUserHandler); 