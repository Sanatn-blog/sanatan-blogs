import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// Define the type for update data
interface BlogUpdateData {
  status?: 'published' | 'draft' | 'archived';
  isPublished?: boolean;
  publishedAt?: Date | null;
}

async function bulkActionHandler(request: AuthenticatedRequest) {
  try {
    // Check if user is admin
    if (request.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
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

    let updateData: BlogUpdateData = {};
    let message = '';

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

      case 'delete':
        // Delete blogs
        const deleteResult = await Blog.deleteMany({
          _id: { $in: blogIds }
        });
        
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