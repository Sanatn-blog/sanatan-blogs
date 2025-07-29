import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get current user's bookmarked blogs
async function getBookmarksHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!request.user?._id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get user with bookmarks
    const user = await User.findById(request.user._id).populate({
      path: 'bookmarks',
      match: { status: 'published', isPublished: true },
      populate: {
        path: 'author',
        select: 'name avatar bio'
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const bookmarkedBlogs = user.bookmarks || [];
    const totalBookmarks = bookmarkedBlogs.length;
    const paginatedBookmarks = bookmarkedBlogs.slice(skip, skip + limit);

    return NextResponse.json({
      bookmarks: paginatedBookmarks,
      pagination: {
        page,
        limit,
        total: totalBookmarks,
        pages: Math.ceil(totalBookmarks / limit)
      }
    });

  } catch (error) {
    console.error('Get bookmarks error:', error);
    return NextResponse.json(
      { error: 'Failed to get bookmarks' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getBookmarksHandler); 