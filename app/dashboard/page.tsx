'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  FileText, 
  Edit, 
  LogOut, 
  Calendar,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

interface UserStats {
  totalBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

interface Blog {
  _id: string;
  title: string;
  views?: number;
  likes?: number;
  comments?: Array<{ _id: string }>;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/blogs/my-blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Calculate stats from blogs data
        const totalViews = data.blogs.reduce((sum: number, blog: Blog) => sum + (blog.views || 0), 0);
        const totalLikes = data.blogs.reduce((sum: number, blog: Blog) => sum + (blog.likes || 0), 0);
        const totalComments = data.blogs.reduce((sum: number, blog: Blog) => sum + (blog.comments?.length || 0), 0);
        
        setStats({
          totalBlogs: data.blogs.length,
          totalViews,
          totalLikes,
          totalComments
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h1>
          <Link href="/login">
            <span className="inline-block px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-medium shadow hover:from-orange-700 hover:to-pink-700 transition-all text-sm sm:text-base">
              Login
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // If user status is pending, show application submitted page
  if (user.status === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Application Submitted!</h1>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Thank you for submitting your application to become a blog writer.</p>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">Our admin team will review your application and verify your credentials. Once approved, you&apos;ll be able to write and publish your own blogs.</p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-yellow-800 text-xs sm:text-sm font-medium">
              <strong>Current Status:</strong> Awaiting Admin Verification
            </p>
            <p className="text-yellow-700 text-xs mt-1 leading-relaxed">You&apos;ll receive a notification once your application is reviewed.</p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-600 text-xs sm:text-sm">While you wait, explore our existing blog collection:</p>
            <Link href="/blogs">
              <span className="inline-block w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-medium shadow hover:from-orange-700 hover:to-pink-700 transition-all text-sm sm:text-base">Explore Blogs</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage your blog content and track your performance</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                user.status === 'approved' ? 'bg-green-100 text-green-800' :
                user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalLikes}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalComments}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/write-blog">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-200">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Write New Blog</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Create and publish a new blog post</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/blogs">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Blogs</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Manage your published blogs</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/blogs">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Explore Blogs</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Read blogs from other writers</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Account created</p>
                <p className="text-xs text-gray-600">Welcome to our community!</p>
              </div>
            </div>
            {stats.totalBlogs > 0 && (
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Blog published</p>
                  <p className="text-xs text-gray-600">Your first blog is now live!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 