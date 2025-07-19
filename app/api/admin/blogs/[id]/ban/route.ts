import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function banBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    console.log(`[${request.user?.role}] Banning blog with ID:`, blogId);
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log('Blog not found with ID:', blogId);
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log('Blog found, current status:', blog.status);

    // Super admin can ban any blog, regular admin cannot ban blogs from super admins
    if (request.user?.role === 'admin') {
      // Check if the blog author is a super admin
      const author = await User.findById(blog.author);
      if (author && author.role === 'super_admin') {
        return NextResponse.json(
          { error: 'Only Super Admin can ban blogs from Super Admin users' },
          { status: 403 }
        );
      }
    }

    blog.status = 'banned';
    blog.isPublished = false;
    blog.publishedAt = null;
    await blog.save();

    console.log(`Blog banned successfully by ${request.user?.role}`);

    return NextResponse.json({
      message: 'Blog banned successfully',
      blog
    });

  } catch (error) {
    console.error('Ban blog error:', error);
    return NextResponse.json(
      { error: 'Failed to ban blog' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(banBlogHandler); 