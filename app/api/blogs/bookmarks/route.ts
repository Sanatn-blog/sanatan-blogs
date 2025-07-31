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

    // First check if user exists
    const user = await User.findById(request.user._id).select('bookmarks');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user has no bookmarks, return empty result
    if (!user.bookmarks || user.bookmarks.length === 0) {
      return NextResponse.json({
        bookmarks: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }

    // Use aggregation pipeline for efficient querying with pagination
    const skip = (page - 1) * limit;
    
    const bookmarksAggregation = await User.aggregate([
      {
        $match: { _id: user._id }
      },
      {
        $lookup: {
          from: 'blogs',
          localField: 'bookmarks',
          foreignField: '_id',
          as: 'bookmarkedBlogs',
          pipeline: [
            {
              $match: {
                status: 'published',
                isPublished: true
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      avatar: 1,
                      bio: 1,
                      username: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: '$author'
            },
            {
              $sort: { createdAt: -1 }
            }
          ]
        }
      },
      {
        $project: {
          bookmarkedBlogs: 1,
          totalBookmarks: { $size: '$bookmarkedBlogs' }
        }
      }
    ]);

    const result = bookmarksAggregation[0] || { bookmarkedBlogs: [], totalBookmarks: 0 };
    const { bookmarkedBlogs, totalBookmarks } = result;

    // Apply pagination to the results
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