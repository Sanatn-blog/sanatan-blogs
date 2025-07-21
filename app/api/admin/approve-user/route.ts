import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function approveUserHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    // Check if the current user is an admin
    if (request.user?.role !== 'admin' && request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find and update the user
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.status === 'approved') {
      return NextResponse.json(
        { message: 'User is already approved' },
        { status: 200 }
      );
    }

    user.status = 'approved';
    await user.save();

    return NextResponse.json({
      message: 'User approved successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        status: user.status,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Approve user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(approveUserHandler); 