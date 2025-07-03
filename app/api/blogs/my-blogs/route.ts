import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get current user's blogs
async function getMyBlogsHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    if (!request.user?._id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Build query for user's blogs
    const query: Record<string, unknown> = {
      author: request.user._id
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get user's blogs
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Calculate stats
    const allUserBlogs = await Blog.find({ author: request.user._id }).lean();
    const totalViews = allUserBlogs.reduce((sum, blog) => sum + blog.views, 0);
    const publishedBlogs = allUserBlogs.filter(blog => blog.status === 'published').length;
    const draftBlogs = allUserBlogs.filter(blog => blog.status === 'draft').length;

    return NextResponse.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalBlogs: allUserBlogs.length,
        totalViews,
        publishedBlogs,
        draftBlogs
      }
    });

  } catch (error) {
    console.error('Get my blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getMyBlogsHandler); 