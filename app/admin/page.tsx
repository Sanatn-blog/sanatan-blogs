'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  UserPlus, 
  MessageSquare,
  Star,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalViews: number;
  activeUsers: number;
  newUsersToday: number;
  blogsToday: number;
  commentsToday: number;
  averageRating: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'blog_published' | 'comment_added';
  user: string;
  action: string;
  timestamp: string;
}

interface Blog {
  _id: string;
  title: string;
  views: number;
  status: string;
  publishedAt?: string;
  author: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
    activeUsers: 0,
    newUsersToday: 0,
    blogsToday: 0,
    commentsToday: 0,
    averageRating: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch blogs data
      const blogsResponse = await fetch('/api/blogs?limit=100');
      if (!blogsResponse.ok) {
        throw new Error('Failed to fetch blogs data');
      }
      const blogsData = await blogsResponse.json();

      // Calculate stats from blogs data
      const totalBlogs = blogsData.pagination.totalBlogs;
      const totalViews = blogsData.blogs.reduce((sum: number, blog: Blog) => sum + blog.views, 0);
      const publishedBlogs = blogsData.blogs.filter((blog: Blog) => blog.status === 'published');
      const blogsToday = blogsData.blogs.filter((blog: Blog) => {
        if (!blog.publishedAt) return false;
        const today = new Date();
        const publishedDate = new Date(blog.publishedAt);
        return publishedDate.toDateString() === today.toDateString();
      }).length;

      // Get recent blogs for activity feed
      const recentBlogsData = blogsData.blogs.slice(0, 5);
      setRecentBlogs(recentBlogsData);

      // Create activity feed from recent blogs
      const activityFeed: RecentActivity[] = recentBlogsData.map((blog: Blog, index: number) => ({
        id: `blog-${index}`,
        type: 'blog_published',
        user: blog.author.name,
        action: `Published "${blog.title}"`,
        timestamp: blog.publishedAt ? new Date(blog.publishedAt).toLocaleString() : 'Recently'
      }));

      setRecentActivity(activityFeed);

      // Set stats (some are still mock for now as we need additional APIs)
      setStats({
        totalUsers: 1247, // Mock - need users API
        totalBlogs,
        totalViews,
        activeUsers: 342, // Mock - need analytics API
        newUsersToday: 23, // Mock - need users API
        blogsToday,
        commentsToday: 47, // Mock - need comments API
        averageRating: 4.6 // Mock - need ratings API
      });

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: '+25%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '-3%',
      changeType: 'negative' as const,
      icon: Activity,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const todayStats = [
    {
      title: 'New Users Today',
      value: stats.newUsersToday,
      icon: UserPlus,
      color: 'text-blue-600'
    },
    {
      title: 'Blogs Published',
      value: stats.blogsToday,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Comments Added',
      value: stats.commentsToday,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'blog_published':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard!</h1>
            <p className="text-orange-100">
              Manage your Sanatan Blogs platform with comprehensive analytics and controls.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {card.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Overview</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {todayStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {stat.title}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors group">
            <Users className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-blue-700 dark:text-blue-400">Manage Users</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-colors group">
            <FileText className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-green-700 dark:text-green-400">Review Content</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-colors group">
            <PieChart className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-purple-700 dark:text-purple-400">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
} 