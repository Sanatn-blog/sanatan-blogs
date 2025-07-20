import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import Contact from '@/models/Contact';
import Subscription from '@/models/Subscription';
import { requireAdmin } from '@/middleware/auth';

// GET - Get comprehensive admin dashboard data
async function getDashboardDataHandler() {
  try {
    await connectDB();

    // Get today's date for calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Fetch all data in parallel for better performance
    const [
      // User statistics
      totalUsers,
      newUsersToday,
      newUsersYesterday,
      usersByStatus,
      
      // Blog statistics
      totalBlogs,
      newBlogsToday,
      newBlogsYesterday,
      blogsByStatus,
      totalViews,
      
      // Comment statistics
      totalComments,
      newCommentsToday,
      newCommentsYesterday,
      
      // Contact statistics
      totalContacts,
      newContacts,
      contactsToday,
      contactsThisWeek,
      recentContacts,
      
      // Subscription statistics
      totalSubscriptions,
      newSubscriptionsToday,
      
      // Recent activity
      recentBlogs,
      recentUsers
    ] = await Promise.all([
      // User counts
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),
      User.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      
      // Blog counts
      Blog.countDocuments(),
      Blog.countDocuments({ createdAt: { $gte: today } }),
      Blog.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),
      Blog.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]),
      
      // Comment counts
      Comment.countDocuments(),
      Comment.countDocuments({ createdAt: { $gte: today } }),
      Comment.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),
      
      // Contact counts
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ createdAt: { $gte: today } }),
      Contact.countDocuments({ createdAt: { $gte: weekAgo } }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      
      // Subscription counts
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ 
        status: 'active', 
        subscribedAt: { $gte: today } 
      }),
      
      // Recent activity
      Blog.find()
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status createdAt author')
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role status createdAt')
        .lean()
    ]);

    // Process user status statistics
    const userStatusStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      suspended: 0
    };
    usersByStatus.forEach((item: { _id: string; count: number }) => {
      userStatusStats[item._id as keyof typeof userStatusStats] = item.count;
    });

    // Process blog status statistics
    const blogStatusStats = {
      draft: 0,
      published: 0,
      archived: 0,
      banned: 0
    };
    blogsByStatus.forEach((item: { _id: string; count: number }) => {
      blogStatusStats[item._id as keyof typeof blogStatusStats] = item.count;
    });

    // Calculate total views
    const totalViewsCount = totalViews[0]?.totalViews || 0;

    // Calculate percentage changes
    const userGrowthPercent = newUsersYesterday > 0 
      ? Math.round(((newUsersToday - newUsersYesterday) / newUsersYesterday) * 100)
      : newUsersToday > 0 ? 100 : 0;
    
    const blogGrowthPercent = newBlogsYesterday > 0 
      ? Math.round(((newBlogsToday - newBlogsYesterday) / newBlogsYesterday) * 100)
      : newBlogsToday > 0 ? 100 : 0;
    
    const commentGrowthPercent = newCommentsYesterday > 0 
      ? Math.round(((newCommentsToday - newCommentsYesterday) / newCommentsYesterday) * 100)
      : newCommentsToday > 0 ? 100 : 0;

    // Create recent activity feed
    const recentActivity = [
      ...recentBlogs.map((blog) => ({
        id: `blog-${blog._id}`,
        type: 'blog_published' as const,
        user: blog.author?.name || 'Unknown Author',
        action: `Published "${blog.title}"`,
        timestamp: new Date(blog.createdAt).toLocaleString(),
        status: blog.status
      })),
      ...recentUsers.map((user) => ({
        id: `user-${user._id}`,
        type: 'user_registered' as const,
        user: user.name,
        action: `Registered as ${user.role}`,
        timestamp: new Date(user.createdAt).toLocaleString(),
        status: user.status
      })),
      ...recentContacts.map((contact) => ({
        id: `contact-${contact._id}`,
        type: 'contact_submitted' as const,
        user: contact.name,
        action: `Submitted: "${contact.subject}"`,
        timestamp: new Date(contact.createdAt).toLocaleString(),
        status: contact.status
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalBlogs,
        totalViews: totalViewsCount,
        totalComments,
        totalContacts,
        totalSubscriptions,
        activeUsers: userStatusStats.approved,
        newUsersToday,
        blogsToday: newBlogsToday,
        commentsToday: newCommentsToday,
        newContacts,
        contactsToday,
        contactsThisWeek,
        newSubscriptionsToday
      },
      growth: {
        users: userGrowthPercent,
        blogs: blogGrowthPercent,
        comments: commentGrowthPercent
      },
      userStatusStats,
      blogStatusStats,
      recentActivity,
      summary: {
        totalContent: totalBlogs + totalComments,
        engagementRate: totalUsers > 0 ? Math.round((totalComments / totalUsers) * 100) : 0,
        averageViewsPerBlog: totalBlogs > 0 ? Math.round(totalViewsCount / totalBlogs) : 0,
        platformHealth: 'excellent'
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getDashboardDataHandler); 