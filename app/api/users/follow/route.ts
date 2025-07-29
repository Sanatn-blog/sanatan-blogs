import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify the token
    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the request body
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      );
    }

    // Check if user is trying to follow themselves
    if (decoded.userId === targetUserId) {
      return NextResponse.json(
        { error: 'You cannot follow yourself' },
        { status: 400 }
      );
    }

    // Get current user and target user
    const currentUser = await User.findById(decoded.userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow: Remove from following and followers
      await User.findByIdAndUpdate(decoded.userId, {
        $pull: { following: targetUserId }
      });
      
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: decoded.userId }
      });

      // Get updated target user to get accurate follower count
      const updatedTargetUser = await User.findById(targetUserId);

      return NextResponse.json({
        message: 'User unfollowed successfully',
        isFollowing: false,
        followersCount: updatedTargetUser?.followers?.length || 0
      });
    } else {
      // Follow: Add to following and followers
      await User.findByIdAndUpdate(decoded.userId, {
        $addToSet: { following: targetUserId }
      });
      
      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: decoded.userId }
      });

      // Get updated target user to get accurate follower count
      const updatedTargetUser = await User.findById(targetUserId);

      return NextResponse.json({
        message: 'User followed successfully',
        isFollowing: true,
        followersCount: updatedTargetUser?.followers?.length || 0
      });
    }

  } catch (error) {
    console.error('Follow/Unfollow error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify the token
    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the target user ID from query params
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      );
    }

    // Get current user and target user
    const currentUser = await User.findById(decoded.userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Check if following
    const isFollowing = currentUser.following.includes(targetUserId);

    return NextResponse.json({
      isFollowing,
      followersCount: targetUser.followers?.length || 0,
      followingCount: targetUser.following?.length || 0
    });

  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 