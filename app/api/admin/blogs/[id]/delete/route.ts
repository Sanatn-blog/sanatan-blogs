import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

async function deleteBlogHandler(request: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    console.log(`[${request.user?.role}] Deleting blog with ID:`, blogId);
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Super admin can delete any blog, regular admin cannot delete blogs from super admins
    if (request.user?.role === 'admin') {
      // Check if the blog author is a super admin
      const author = await User.findById(blog.author);
      if (author && author.role === 'super_admin') {
        return NextResponse.json(
          { error: 'Only Super Admin can delete blogs from Super Admin users' },
          { status: 403 }
        );
      }
    }

    await Blog.findByIdAndDelete(blogId);

    console.log(`Blog deleted successfully by ${request.user?.role}`);

    return NextResponse.json({
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(deleteBlogHandler); 