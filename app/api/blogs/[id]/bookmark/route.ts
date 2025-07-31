import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id: blogId } = await params;
    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if blog is published
    if (!blog.isPublished || blog.status !== 'published') {
      return NextResponse.json(
        { error: 'Cannot bookmark unpublished blog' },
        { status: 403 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has already bookmarked the blog
    const isBookmarked = user.bookmarks.includes(blogId);

    if (isBookmarked) {
      // Remove bookmark
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $pull: { bookmarks: blogId }
      }, { new: true });
      
      return NextResponse.json({
        message: 'Blog unbookmarked successfully',
        bookmarked: false,
        bookmarksCount: updatedUser?.bookmarks?.length || 0
      });
    } else {
      // Add bookmark
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $addToSet: { bookmarks: blogId }
      }, { new: true });
      
      return NextResponse.json({
        message: 'Blog bookmarked successfully',
        bookmarked: true,
        bookmarksCount: updatedUser?.bookmarks?.length || 0
      });
    }

  } catch (error) {
    console.error('Error handling blog bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id: blogId } = await params;
    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Get authorization header (optional for getting bookmark status)
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded && decoded.userId) {
        userId = decoded.userId;
      }
    }

    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    let isBookmarked = false;
    let bookmarksCount = 0;

    if (userId) {
      // Get user's bookmark status
      const user = await User.findById(userId);
      if (user) {
        isBookmarked = user.bookmarks.includes(blogId);
      }
    }

    // Get total bookmarks count (this would require a separate field in Blog model)
    // For now, we'll return 0 as the backend doesn't track total bookmarks yet
    bookmarksCount = 0;

    return NextResponse.json({
      bookmarked: isBookmarked,
      bookmarksCount
    });

  } catch (error) {
    console.error('Error getting blog bookmark status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 