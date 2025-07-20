'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  UserPlus, 
  MessageSquare,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Clock,
  Shield,
  Zap,
  Target,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalViews: number;
  totalComments: number;
  totalContacts: number;
  totalSubscriptions: number;
  activeUsers: number;
  newUsersToday: number;
  blogsToday: number;
  commentsToday: number;
  newContacts: number;
  contactsToday: number;
  contactsThisWeek: number;
  newSubscriptionsToday: number;
}

interface GrowthData {
  users: number;
  blogs: number;
  comments: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'blog_published' | 'comment_added' | 'contact_submitted';
  user: string;
  action: string;
  timestamp: string;
  status?: string;
}



export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
    totalComments: 0,
    totalContacts: 0,
    totalSubscriptions: 0,
    activeUsers: 0,
    newUsersToday: 0,
    blogsToday: 0,
    commentsToday: 0,
    newContacts: 0,
    contactsToday: 0,
    contactsThisWeek: 0,
    newSubscriptionsToday: 0
  });
  const [growth, setGrowth] = useState<GrowthData>({
    users: 0,
    blogs: 0,
    comments: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      
      setStats(data.stats);
      setGrowth(data.growth);
      setRecentActivity(data.recentActivity);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: `${growth.users >= 0 ? '+' : ''}${growth.users}%`,
      changeType: growth.users > 0 ? 'positive' as 'positive' | 'negative' | 'neutral' : 
                 growth.users < 0 ? 'negative' as 'positive' | 'negative' | 'neutral' : 
                 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs.toLocaleString(),
      change: `${growth.blogs >= 0 ? '+' : ''}${growth.blogs}%`,
      changeType: growth.blogs > 0 ? 'positive' as 'positive' | 'negative' | 'neutral' : 
                 growth.blogs < 0 ? 'negative' as 'positive' | 'negative' | 'neutral' : 
                 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: '+25%',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: Eye,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Contact Submissions',
      value: stats.totalContacts.toLocaleString(),
      change: stats.newContacts > 0 ? `+${stats.newContacts} new` : 'No new',
      changeType: stats.newContacts > 0 ? 'positive' as 'positive' | 'negative' | 'neutral' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: Mail,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  const todayStats = [
    {
      title: 'New Users Today',
      value: stats.newUsersToday,
      icon: UserPlus,
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Blogs Published',
      value: stats.blogsToday,
      icon: FileText,
      gradient: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Contact Submissions',
      value: stats.contactsToday,
      icon: Mail,
      gradient: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Comments Added',
      value: stats.commentsToday,
      icon: MessageSquare,
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <UserPlus className="h-4 w-4 text-blue-400" />;
      case 'blog_published':
        return <FileText className="h-4 w-4 text-emerald-400" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4 text-purple-400" />;
      case 'contact_submitted':
        return <Mail className="h-4 w-4 text-orange-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return 'text-green-400';
      case 'draft':
      case 'pending':
        return 'text-yellow-400';
      case 'banned':
      case 'rejected':
      case 'suspended':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-gray-700/50">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Your Sanatan Blogs platform is running smoothly. Here&apos;s what&apos;s happening today.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Status: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="lg:hidden p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-5 w-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`relative group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border ${card.borderColor} hover:border-opacity-40 transition-all duration-300 hover:scale-105`}>
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${card.bgGradient}"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                    card.changeType === 'positive' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : card.changeType === 'negative'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {card.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : card.changeType === 'negative' ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {card.value}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">
                    {card.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Today's Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Today&apos;s Overview</h2>
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-4">
            {todayStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all duration-300 border border-gray-600/30 hover:border-gray-600/50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                      {stat.title}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="group flex items-start space-x-4 p-4 hover:bg-gray-700/30 rounded-xl transition-all duration-300 border border-gray-600/30 hover:border-gray-600/50">
                  <div className="flex-shrink-0 mt-1 p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {activity.user}
                      </p>
                      {activity.status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)} bg-gray-700/50`}>
                          {activity.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No recent activity</p>
                <p className="text-sm mt-2">Activity will appear here as it happens</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Submissions Summary */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Contact Submissions</h2>
          <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
            <Mail className="h-5 w-5 text-orange-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {stats.totalContacts}
            </div>
            <div className="text-sm text-gray-300 font-medium">Total Submissions</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {stats.newContacts}
            </div>
            <div className="text-sm text-gray-300 font-medium">New (Unread)</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {stats.contactsToday}
            </div>
            <div className="text-sm text-gray-300 font-medium">Today</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {stats.contactsThisWeek}
            </div>
            <div className="text-sm text-gray-300 font-medium">This Week</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => router.push('/admin/users')}
            className="group flex items-center justify-center space-x-3 p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-2xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 hover:scale-105"
          >
            <Users className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">Manage Users</span>
          </button>
          <button 
            onClick={() => router.push('/admin/content')}
            className="group flex items-center justify-center space-x-3 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 rounded-2xl transition-all duration-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:scale-105"
          >
            <FileText className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">Review Content</span>
          </button>
          <button 
            onClick={() => router.push('/admin/contacts')}
            className="group flex items-center justify-center space-x-3 p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 rounded-2xl transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40 hover:scale-105"
          >
            <Mail className="h-6 w-6 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">View Contacts</span>
          </button>
          <button 
            onClick={() => router.push('/admin/subscriptions')}
            className="group flex items-center justify-center space-x-3 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-2xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 hover:scale-105"
          >
            <PieChart className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">View Subscriptions</span>
          </button>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">All systems operational</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Shield className="h-4 w-4" />
              <span>Security: Active</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Zap className="h-4 w-4" />
              <span>Performance: Excellent</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Target className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 