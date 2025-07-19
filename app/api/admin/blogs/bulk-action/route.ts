import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// Define the type for update data
interface BlogUpdateData {
  status?: 'published' | 'draft' | 'archived' | 'banned';
  isPublished?: boolean;
  publishedAt?: Date | null;
}

async function bulkActionHandler(request: AuthenticatedRequest) {
  try {
    // Check if user is admin or super_admin
    if (!['admin', 'super_admin'].includes(request.user?.role || '')) {
      return NextResponse.json(
        { error: 'Admin or Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { action, blogIds } = body;

    if (!action || !blogIds || !Array.isArray(blogIds) || blogIds.length === 0) {
      return NextResponse.json(
        { error: 'Action and blog IDs are required' },
        { status: 400 }
      );
    }

    console.log(`[${request.user?.role}] Performing bulk action:`, action, 'on', blogIds.length, 'blogs');

    let updateData: BlogUpdateData = {};
    let message = '';

    // For admin users, check if they're trying to modify super admin blogs
    if (request.user?.role === 'admin' && ['ban', 'delete'].includes(action)) {
      const blogs = await Blog.find({ _id: { $in: blogIds } }).populate('author', 'role');
      const superAdminBlogs = blogs.filter(blog => blog.author && (blog.author as Record<string, unknown>).role === 'super_admin');
      
      if (superAdminBlogs.length > 0) {
        return NextResponse.json(
          { error: 'Only Super Admin can perform this action on Super Admin blogs' },
          { status: 403 }
        );
      }
    }

    switch (action) {
      case 'publish':
        updateData = {
          status: 'published',
          isPublished: true,
          publishedAt: new Date()
        };
        message = 'Blogs published successfully';
        break;

      case 'unpublish':
        updateData = {
          status: 'draft',
          isPublished: false,
          publishedAt: null
        };
        message = 'Blogs unpublished successfully';
        break;

      case 'archive':
        updateData = {
          status: 'archived',
          isPublished: false
        };
        message = 'Blogs archived successfully';
        break;

      case 'ban':
        updateData = {
          status: 'banned',
          isPublished: false,
          publishedAt: null
        };
        message = 'Blogs banned successfully';
        break;

      case 'unban':
        updateData = {
          status: 'draft',
          isPublished: false,
          publishedAt: null
        };
        message = 'Blogs unbanned successfully';
        break;

      case 'delete':
        // Delete blogs
        const deleteResult = await Blog.deleteMany({
          _id: { $in: blogIds }
        });
        
        console.log(`Bulk delete completed by ${request.user?.role}:`, deleteResult.deletedCount, 'blogs');
        
        return NextResponse.json({
          message: `${deleteResult.deletedCount} blogs deleted successfully`,
          deletedCount: deleteResult.deletedCount
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update blogs
    const updateResult = await Blog.updateMany(
      { _id: { $in: blogIds } },
      updateData
    );

    console.log(`Bulk action completed by ${request.user?.role}:`, action, updateResult.modifiedCount, 'blogs');

    return NextResponse.json({
      message,
      updatedCount: updateResult.modifiedCount
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(bulkActionHandler); 