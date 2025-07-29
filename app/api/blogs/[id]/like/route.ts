import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
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
        { error: 'Cannot like unpublished blog' },
        { status: 403 }
      );
    }

    // Check if user has already liked the blog
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      // Unlike the blog
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likes: userId }
      });
      
      return NextResponse.json({
        message: 'Blog unliked successfully',
        liked: false,
        likesCount: blog.likes.length - 1
      });
    } else {
      // Like the blog
      await Blog.findByIdAndUpdate(blogId, {
        $addToSet: { likes: userId }
      });
      
      return NextResponse.json({
        message: 'Blog liked successfully',
        liked: true,
        likesCount: blog.likes.length + 1
      });
    }

  } catch (error) {
    console.error('Error handling blog like:', error);
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

    // Get authorization header (optional for getting like status)
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

    const isLiked = userId ? blog.likes.includes(userId) : false;
    const likesCount = blog.likes.length;

    return NextResponse.json({
      liked: isLiked,
      likesCount,
      totalLikes: likesCount
    });

  } catch (error) {
    console.error('Error getting blog like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 