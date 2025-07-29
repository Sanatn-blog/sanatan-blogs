import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB();

    const { id: userId } = await params;

    // Get user with populated following
    const user = await User.findById(userId)
      .populate('following', 'name username avatar bio')
      .select('following');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      following: user.following,
      followingCount: user.following.length
    });

  } catch (error) {
    console.error('Get following error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 