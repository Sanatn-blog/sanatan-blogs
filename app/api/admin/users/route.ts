import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin, AuthenticatedRequest } from '@/middleware/auth';

// GET - List all users with filtering options
async function getUsersHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    // Build query
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -emailVerificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get counts by status for dashboard
    const statusCounts = await User.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      suspended: 0
    };

    statusCounts.forEach((item) => {
      counts[item._id as keyof typeof counts] = item.count;
    });

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      counts
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// PATCH - Update user status (approve/reject/suspend)
async function updateUserStatusHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, status, reason } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: 'User ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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

    // Update user status
    user.status = status;
    if (reason) {
      // You could add a reason field to the user model if needed
      // user.statusReason = reason;
    }

    await user.save();

    // Log the admin action (you could create an audit log model)
    console.log(`Admin ${request.user?.email} changed user ${user.email} status to ${status}`);

    return NextResponse.json({
      message: `User status updated to ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (super admin only)
async function deleteUserHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Only super admin can delete users
    if (request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admin can delete users' },
        { status: 403 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting super admin users
    if (user.role === 'super_admin') {
      return NextResponse.json(
        { error: 'Cannot delete super admin users' },
        { status: 403 }
      );
    }

    // TODO: Also delete user's blogs and comments
    // await Blog.deleteMany({ author: userId });
    // await Comment.deleteMany({ author: userId });

    await User.findByIdAndDelete(userId);

    console.log(`Super admin ${request.user?.email} deleted user ${user.email}`);

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

// POST - Create new user (admin only)
async function createUserHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phoneNumber, role, status } = body;

    // Basic validation
    if (!name || !email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if user already exists with phone number
    const existingUserByPhone = await User.findOne({ phoneNumber: phoneNumber.trim() });
    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    // Generate a random password for the user
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: randomPassword, // User will need to reset this password
      phoneNumber: phoneNumber.trim(),
      role: role || 'user',
      status: status || 'approved',
      emailVerified: true, // Admin created users are pre-verified
      isVerified: true,
      isActive: true,
      authProvider: 'email'
    });

    await newUser.save();

    // Log the admin action
    console.log(`Admin ${request.user?.email} created user ${newUser.email} with role ${newUser.role}`);

    // Remove sensitive information before sending response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse,
      note: 'User will need to reset their password on first login'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create user error:', error);

    // Handle mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const mongooseError = error as { errors: Record<string, { message: string }> };
      const errors = Object.values(mongooseError.errors).map((err: { message: string }) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      const duplicateError = error as { keyPattern?: Record<string, number> };
      if (duplicateError.keyPattern?.email) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      if (duplicateError.keyPattern?.phoneNumber) {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply authentication middleware
export const GET = requireAdmin(getUsersHandler);
export const POST = requireAdmin(createUserHandler);
export const PATCH = requireAdmin(updateUserStatusHandler);
export const DELETE = requireAdmin(deleteUserHandler); 