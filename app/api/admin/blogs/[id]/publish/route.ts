import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function publishBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if user is admin
    if (request.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const resolvedParams = await params;
    const blogId = resolvedParams.id;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    blog.status = 'published';
    blog.isPublished = true;
    blog.publishedAt = new Date();
    await blog.save();

    return NextResponse.json({
      message: 'Blog published successfully',
      blog
    });

  } catch (error) {
    console.error('Publish blog error:', error);
    return NextResponse.json(
      { error: 'Failed to publish blog' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(publishBlogHandler); 