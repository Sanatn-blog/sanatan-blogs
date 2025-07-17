import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function unbanBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    console.log('Unbanning blog with ID:', blogId);
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found with ID:', blogId);
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log('Blog found, current status:', blog.status);

    // Change from banned to draft
    blog.status = 'draft';
    blog.isPublished = false;
    blog.publishedAt = null;
    await blog.save();

    console.log('Blog unbanned successfully');

    return NextResponse.json({
      message: 'Blog unbanned successfully',
      blog
    });

  } catch (error) {
    console.error('Unban blog error:', error);
    return NextResponse.json(
      { error: 'Failed to unban blog' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(unbanBlogHandler); 