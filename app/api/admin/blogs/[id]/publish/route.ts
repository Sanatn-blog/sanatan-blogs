import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function publishBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(request.user?.role || '')) {
      return NextResponse.json(
        { error: 'Admin or Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const resolvedParams = await params;
    const blogId = resolvedParams.id;
    
    console.log(`[${request.user?.role}] Publishing blog with ID:`, blogId);
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Super admin can publish any blog, regular admin can only publish non-banned blogs
    if (request.user?.role === 'admin' && blog.status === 'banned') {
      return NextResponse.json(
        { error: 'Only Super Admin can publish banned blogs' },
        { status: 403 }
      );
    }

    blog.status = 'published';
    blog.isPublished = true;
    blog.publishedAt = new Date();
    await blog.save();

    console.log(`Blog published successfully by ${request.user?.role}`);

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