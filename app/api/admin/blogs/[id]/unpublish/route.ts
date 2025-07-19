import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function unpublishBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    console.log(`[${request.user?.role}] Unpublishing blog with ID:`, blogId);
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found with ID:', blogId);
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log('Blog found, current status:', blog.status);

    blog.status = 'draft';
    blog.isPublished = false;
    blog.publishedAt = null;
    await blog.save();

    console.log(`Blog unpublished successfully by ${request.user?.role}`);

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