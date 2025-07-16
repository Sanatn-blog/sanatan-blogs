import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get current user's blogs
async function getMyBlogsHandler(request: AuthenticatedRequest) {
  try {
    // Check for required environment variables
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    console.log('Connecting to database for my-blogs...');
    await connectDB();
    console.log('Database connected successfully');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    console.log('My blogs request params:', { page, limit, status });
    console.log('User ID:', request.user?._id);

    if (!request.user?._id) {
      console.log('No user ID found in request');
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

    console.log('Query for user blogs:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get user's blogs
    console.log('Fetching user blogs...');
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${blogs.length} blogs for user`);

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Calculate stats
    const allUserBlogs = await Blog.find({ author: request.user._id }).lean();
    const totalViews = allUserBlogs.reduce((sum, blog) => sum + blog.views, 0);
    const publishedBlogs = allUserBlogs.filter(blog => blog.status === 'published').length;
    const draftBlogs = allUserBlogs.filter(blog => blog.status === 'draft').length;

    const response = {
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
    };

    console.log('Sending my-blogs response with', blogs.length, 'blogs');
    return NextResponse.json(response);

  } catch (error) {
    console.error('Get my blogs error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { error: 'Database configuration error' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch your blogs. Please try again later.' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getMyBlogsHandler); 