'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { PenTool, Eye, Edit, Trash2, Plus, Loader2, Calendar, Tag, Search, Filter } from 'lucide-react';
import Image from 'next/image';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  likes: string[];
  readingTime: number;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    _id: string;
    name: string;
  };
}

interface BlogStats {
  totalBlogs: number;
  totalViews: number;
  publishedBlogs: number;
  draftBlogs: number;
}

export default function MyBlogs() {
  const { user, loading } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState<BlogStats>({
    totalBlogs: 0,
    totalViews: 0,
    publishedBlogs: 0,
    draftBlogs: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  const fetchUserBlogs = async () => {
    try {
      setLoadingBlogs(true);
      setError(null);

      // Get the access token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to view your blogs');
        setLoadingBlogs(false);
        return;
      }

      console.log('Fetching user blogs with token...');
      
      // Fetch user's blogs using the dedicated endpoint
      const response = await fetch('/api/blogs/my-blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.blogs || !Array.isArray(data.blogs)) {
        throw new Error('Invalid response format from server');
      }
      
      console.log('Received user blogs:', data.blogs.length);
      setBlogs(data.blogs);
      setFilteredBlogs(data.blogs);
      setStats(data.stats);

    } catch (err) {
      console.error('Error fetching user blogs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load blogs';
      setError(errorMessage);
      
      // Show more specific error messages to user
      if (errorMessage.includes('User not authenticated')) {
        setError('Please log in to view your blogs');
      } else if (errorMessage.includes('Database connection failed')) {
        setError('Unable to connect to the database. Please try again in a few moments.');
      } else if (errorMessage.includes('Database configuration error')) {
        setError('System configuration issue. Please contact support.');
      } else if (errorMessage.includes('timeout')) {
        setError('Request timed out. Please check your internet connection and try again.');
      } else {
        setError('Unable to load your blogs. Please try again later.');
      }
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Filter blogs based on search and status
  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, statusFilter, blogs]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Archived</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      // Get the access token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please log in to delete blogs');
        return;
      }

      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          alert('Please log in to delete blogs');
        } else if (response.status === 403) {
          alert('You can only delete your own blogs');
        } else if (response.status === 404) {
          alert('Blog not found');
        } else {
          alert(errorData.error || 'Failed to delete blog');
        }
        return;
      }

      // Remove from local state
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setFilteredBlogs(filteredBlogs.filter(blog => blog._id !== blogId));
      
      // Show success message
      alert('Blog deleted successfully');
      
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-orange-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mb-4">Access Denied</h1>
          <p className="text-gray-100 text-sm sm:text-base mb-6">Please log in to access your blogs.</p>
          <Link href="/login" className="inline-block bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📚 My Blogs</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your blog posts</p>
            </div>
            <Link
              href="/write-blog"
              className="flex items-center justify-center sm:justify-start space-x-2 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Write New Blog</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <PenTool className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Published</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.publishedBlogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <PenTool className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.draftBlogs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {loadingBlogs ? (
            <div className="text-center py-8 sm:py-12">
              <Loader2 className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto"></Loader2>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading your blogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Blogs</h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">{error}</p>
              <div className="text-xs sm:text-sm text-gray-500 mb-6">
                If this problem persists, please check your login status or try again later.
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={fetchUserBlogs}
                  className="inline-flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
                >
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Try Again</span>
                </button>
                {error.includes('log in') && (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <span>Go to Login</span>
                  </Link>
                )}
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <PenTool className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {blogs.length === 0 
                  ? "Start sharing your thoughts with the world by writing your first blog post!"
                  : "No blogs match your current search or filter criteria."
                }
              </p>
              <Link
                href="/write-blog"
                className="inline-flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
              >
                <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Write Your First Blog</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredBlogs.map((blog) => (
                <div key={blog._id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    {/* Featured Image */}
                    {blog.featuredImage && (
                      <div className="flex-shrink0 w-24 h-24 sm:w-32 sm:h-32">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{blog.title}</h3>
                        {getStatusBadge(blog.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">{blog.excerpt}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-3  sm:h-4 w-4" />
                          {formatDate(blog.publishedAt)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 sm:h-4" />
                          {blog.views} views
                        </span>
                        <span className="flex items-center">
                          <Tag className="h-3  sm:h-4 w-4" />
                          {blog.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {(blog.tags || []).slice(0, 3).map((tag) => (
                          
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {(blog.tags || []).length > 3 && (
                          <span className="text-gray-500 text-xs">+{(blog.tags || []).length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2 sm:ml-4">
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                      <Link
                        href={`/write-blog?edit=${blog._id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 