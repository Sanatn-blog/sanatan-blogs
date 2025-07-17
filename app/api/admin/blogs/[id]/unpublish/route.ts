import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function unpublishBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if user is admin
    if (request.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { id: blogId } = await params;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    blog.status = 'draft';
    blog.isPublished = false;
    blog.publishedAt = null;
    await blog.save();

    return NextResponse.json({
      message: 'Blog unpublished successfully',
      blog
    });

  } catch (error) {
    console.error('Unpublish blog error:', error);
    return NextResponse.json(
      { error: 'Failed to unpublish blog' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(unpublishBlogHandler); 