import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET - Get Super Admin dashboard data
async function getSuperAdminDataHandler(request: AuthenticatedRequest) {
  try {
    // Only Super Admin can access this endpoint
    if (request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get comprehensive platform statistics
    const [
      totalUsers,
      totalBlogs,
      totalComments,
      usersByRole,
      blogsByStatus,
      recentActivity,
      systemHealth
    ] = await Promise.all([
      // User statistics
      User.countDocuments(),
      Blog.countDocuments(),
      Comment.countDocuments(),
      
      // Users by role
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      
      // Blogs by status
      Blog.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Recent activity (last 10 actions)
      Blog.find()
        .sort({ updatedAt: -1 })
        .limit(10)
        .populate('author', 'name email role')
        .select('title status updatedAt author')
        .lean(),
      
      // System health check
      Promise.resolve({
        database: 'connected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      })
    ]);

    // Process role statistics
    const roleStats = {
      super_admin: 0,
      admin: 0,
      user: 0
    };
    usersByRole.forEach((item: { _id: string; count: number }) => {
      roleStats[item._id as keyof typeof roleStats] = item.count;
    });

    // Process blog status statistics
    const statusStats = {
      published: 0,
      draft: 0,
      archived: 0,
      banned: 0
    };
    blogsByStatus.forEach((item: { _id: string; count: number }) => {
      statusStats[item._id as keyof typeof statusStats] = item.count;
    });

    // Get today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      newUsersToday,
      newBlogsToday,
      newCommentsToday
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: today } }),
      Blog.countDocuments({ createdAt: { $gte: today } }),
      Comment.countDocuments({ createdAt: { $gte: today } })
    ]);

    return NextResponse.json({
      platformStats: {
        totalUsers,
        totalBlogs,
        totalComments,
        newUsersToday,
        newBlogsToday,
        newCommentsToday
      },
      roleStats,
      statusStats,
      recentActivity,
      systemHealth
    });

  } catch (error) {
    console.error('Super Admin data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Super Admin data' },
      { status: 500 }
    );
  }
}

// POST - Perform Super Admin actions
async function performSuperAdminActionHandler(request: AuthenticatedRequest) {
  try {
    // Only Super Admin can perform these actions
    if (request.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'promote_to_admin':
        return await promoteUserToAdmin(data.userId);
      
      case 'demote_from_admin':
        return await demoteUserFromAdmin(data.userId);
      
      case 'bulk_user_action':
        return await performBulkUserAction(data);
      
      case 'system_maintenance':
        return await performSystemMaintenance(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid Super Admin action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Super Admin action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform Super Admin action' },
      { status: 500 }
    );
  }
}

// Helper functions for Super Admin actions
async function promoteUserToAdmin(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  if (user.role === 'admin') {
    return NextResponse.json(
      { error: 'User is already an admin' },
      { status: 400 }
    );
  }

  user.role = 'admin';
  user.status = 'approved';
  await user.save();

  console.log(`User ${user.email} promoted to admin by Super Admin`);

  return NextResponse.json({
    message: 'User promoted to admin successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
}

async function demoteUserFromAdmin(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'User is not an admin' },
      { status: 400 }
    );
  }

  user.role = 'user';
  await user.save();

  console.log(`User ${user.email} demoted from admin by Super Admin`);

  return NextResponse.json({
    message: 'User demoted from admin successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
}

async function performBulkUserAction(data: { action: string; userIds: string[] }) {
  const { action, userIds } = data;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json(
      { error: 'User IDs are required' },
      { status: 400 }
    );
  }

  let updateData: Record<string, string> = {};
  let message = '';

  switch (action) {
    case 'approve':
      updateData = { status: 'approved' };
      message = 'Users approved successfully';
      break;
    
    case 'suspend':
      updateData = { status: 'suspended' };
      message = 'Users suspended successfully';
      break;
    
    case 'reject':
      updateData = { status: 'rejected' };
      message = 'Users rejected successfully';
      break;
    
    default:
      return NextResponse.json(
        { error: 'Invalid bulk user action' },
        { status: 400 }
      );
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    updateData
  );

  console.log(`Bulk user action performed by Super Admin:`, action, result.modifiedCount, 'users');

  return NextResponse.json({
    message,
    updatedCount: result.modifiedCount
  });
}

async function performSystemMaintenance(data: { action: string }) {
  const { action } = data;

  switch (action) {
    case 'cleanup_orphaned_data':
      // Clean up orphaned comments
      const orphanedComments = await Comment.deleteMany({
        blog: { $exists: false }
      });
      
      // Clean up orphaned likes
      const blogs = await Blog.find();
      let cleanedLikes = 0;
      
      for (const blog of blogs) {
        const originalLikesLength = blog.likes.length;
                blog.likes = blog.likes.filter((likeId: string) =>
          blog.likes.includes(likeId)
        );
        if (blog.likes.length !== originalLikesLength) {
          await blog.save();
          cleanedLikes += originalLikesLength - blog.likes.length;
        }
      }

      console.log(`System maintenance performed by Super Admin:`, action);

      return NextResponse.json({
        message: 'System maintenance completed',
        results: {
          orphanedCommentsRemoved: orphanedComments.deletedCount,
          orphanedLikesRemoved: cleanedLikes
        }
      });
    
    default:
      return NextResponse.json(
        { error: 'Invalid maintenance action' },
        { status: 400 }
      );
  }
}

export const GET = requireAuth(getSuperAdminDataHandler);
export const POST = requireAuth(performSuperAdminActionHandler); 