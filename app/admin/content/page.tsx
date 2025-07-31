'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Eye, 
  Plus, 
  Loader2, 
  Search, 
  Edit, 
  Eye as ViewIcon,
  Calendar,
  Clock,
  Filter,
  CheckCircle,
  XCircle,
  Archive,
  RefreshCw,
  X,
  User,
  Tag,
  PartyPopper,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// TypeScript interfaces
interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: Author;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived' | 'banned';
  views: number;
  likes: string[];
  comments: string[];
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

interface BlogResponse {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  categories: string[];
}

export default function ContentManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false);

  // Fetch blogs
  const fetchBlogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        status: statusFilter,
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/blogs?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: BlogResponse = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
      setCategories(data.categories);
      
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchTerm]);

  // Load blogs on component mount and filter changes
  useEffect(() => {
    fetchBlogs(1);
  }, [fetchBlogs]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedBlogs.length === 0) return;

    try {
      setActionLoading(true);
      
      // Get the access token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to perform this action');
        setActionLoading(false);
        return;
      }
      
      // Check if token is valid format
      if (!token.includes('.') || token.split('.').length !== 3) {
        setError('Authentication token is corrupted. Please log out and log in again.');
        setActionLoading(false);
        return;
      }
      
      const response = await fetch('/api/admin/blogs/bulk-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: bulkAction,
          blogIds: selectedBlogs
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to perform bulk action';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Show success message for publish actions
      if (bulkAction === 'publish') {
        const blogCount = selectedBlogs.length;
        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } relative max-w-lg w-full mx-auto pointer-events-auto overflow-hidden rounded-2xl`}>
            {/* Background with gradient and glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 opacity-95"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
            
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
              <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-bounce opacity-50"></div>
            </div>
            
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <PartyPopper className="h-7 w-7 text-white animate-bounce" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      🎉 {blogCount} Blog{blogCount > 1 ? 's' : ''} Published!
                    </h3>
                  </div>
                  
                  <p className="text-sm text-emerald-50 mb-3 leading-relaxed">
                    {blogCount > 1 ? 'These amazing posts are' : 'This amazing post is'} now live and ready to inspire readers!
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-yellow-200 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-100 opacity-90">
                      Bulk action completed successfully ✨
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
        ), {
          duration: 6000,
          position: 'top-center',
        });
      } else if (bulkAction === 'unpublish') {
        toast.success(`📝 ${selectedBlogs.length} blog${selectedBlogs.length > 1 ? 's' : ''} unpublished successfully!`, {
          duration: 4000,
          iconTheme: {
            primary: '#6366f1',
            secondary: '#ffffff',
          },
        });
      }
      
      // Refresh blogs and clear selection
      await fetchBlogs(pagination.currentPage);
      setSelectedBlogs([]);
      setBulkAction('');
      
    } catch (err) {
      console.error('Bulk action error:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform bulk action');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle individual blog actions
  const handleBlogAction = async (blogId: string, action: string) => {
    try {
      setActionLoading(true);
      
      // Get the access token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to perform this action');
        setActionLoading(false);
        return;
      }
      
      // Check if token is valid format
      if (!token.includes('.') || token.split('.').length !== 3) {
        setError('Authentication token is corrupted. Please log out and log in again.');
        setActionLoading(false);
        return;
      }
      
      const response = await fetch(`/api/admin/blogs/${blogId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMessage = 'Failed to perform action';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Show success message for publish actions
      if (action === 'publish') {
        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } relative max-w-lg w-full mx-auto pointer-events-auto overflow-hidden rounded-2xl`}>
            {/* Background with gradient and glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 opacity-95"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
            
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
              <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-bounce opacity-50"></div>
            </div>
            
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <PartyPopper className="h-7 w-7 text-white animate-bounce" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      🎉 Blog Published Successfully!
                    </h3>
                  </div>
                  
                  <p className="text-sm text-emerald-50 mb-3 leading-relaxed">
                    This amazing post is now live and ready to inspire readers around the world!
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-yellow-200 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-100 opacity-90">
                      Admin action completed successfully ✨
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
        ), {
          duration: 6000,
          position: 'top-center',
        });
      } else if (action === 'unpublish') {
        toast.success('📝 Blog unpublished successfully!', {
          duration: 4000,
          iconTheme: {
            primary: '#6366f1',
            secondary: '#ffffff',
          },
        });
      }
      
      // Refresh blogs
      await fetchBlogs(pagination.currentPage);
      
    } catch (err) {
      console.error('Blog action error:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle blog selection
  const toggleBlogSelection = (blogId: string) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  // Toggle all blogs selection
  const toggleAllBlogs = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map(blog => blog._id));
    }
  };

  // Handle blog row click
  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowBlogDetail(true);
  };

  // Close blog detail modal
  const closeBlogDetail = () => {
    setShowBlogDetail(false);
    setSelectedBlog(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'banned':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Calculate stats
  const stats = {
    total: pagination.totalBlogs,
    published: blogs.filter(blog => blog.status === 'published').length,
    draft: blogs.filter(blog => blog.status === 'draft').length,
    archived: blogs.filter(blog => blog.status === 'archived').length,
    banned: blogs.filter(blog => blog.status === 'banned').length,
    totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0)
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-orange-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-300">Loading content management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">📝 Content Management</h1>
              <p className="text-gray-300 mt-2">Manage all blogs, categories, and content</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => fetchBlogs(pagination.currentPage)}
                disabled={loading}
                className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <Link href="/write-blog" className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-900 rounded-lg">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Blogs</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-900 rounded-lg">
                <Eye className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Views</p>
                <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Published</p>
                <p className="text-2xl font-bold text-white">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-900 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Drafts</p>
                <p className="text-2xl font-bold text-white">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-700 rounded-lg">
                <Archive className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Archived</p>
                <p className="text-2xl font-bold text-white">{stats.archived}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-900 rounded-lg">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Banned</p>
                <p className="text-2xl font-bold text-white">{stats.banned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700 text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="banned">Banned</option>
            </select>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700 text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="text-sm text-gray-300 flex items-center justify-center sm:justify-start">
              {pagination.totalBlogs} blogs found
            </div>

            <div className="flex items-center justify-center space-x-2 sm:justify-start">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Filters</span>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBlogs.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-white font-medium">
                  {selectedBlogs.length} blog{selectedBlogs.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  >
                    <option value="">Select Action</option>
                    <option value="publish">Publish</option>
                    <option value="unpublish">Unpublish</option>
                    <option value="ban">Ban</option>
                    <option value="unban">Unban</option>
                    <option value="archive">Archive</option>
                    <option value="delete">Delete</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction || actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedBlogs([])}
                className="text-gray-400 hover:text-white self-end sm:self-auto"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content Table */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Start by creating your first blog post or import existing content.'
                }
              </p>
              <Link href="/write-blog" className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                <Plus className="h-5 w-5" />
                <span>Create First Blog</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block table-responsive">
                <table className="w-full admin-table">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="w-12 px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                          onChange={toggleAllBlogs}
                          className="rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                        />
                      </th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Blog
                      </th>
                      <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800">
                    {blogs.map((blog) => (
                      <tr 
                        key={blog._id} 
                        className="hover:bg-gray-750 cursor-pointer transition-colors duration-200 blog-card"
                        onClick={() => handleBlogClick(blog)}
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedBlogs.includes(blog._id)}
                            onChange={() => toggleBlogSelection(blog._id)}
                            className="rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 h-8 w-8 relative">
                              {blog.featuredImage ? (
                                <Image
                                  src={blog.featuredImage}
                                  alt={blog.title}
                                  fill
                                  className="h-8 w-8 rounded object-cover"
                                  sizes="32px"
                                />
                              ) : (
                                <div className="h-8 w-8 bg-gray-600 rounded flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-white line-clamp-2">
                                {blog.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 h-8 w-8">
                                                          {blog.author.avatar ? (
                              <Image
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">
                                    {blog.author.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm text-white truncate">{blog.author.name}</div>
                              <div className="text-xs text-gray-400 truncate">{blog.author.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                            {blog.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(blog.status)}`}>
                            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{blog.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{blog.comments.length}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/blogs/${blog.slug}`}
                              className="text-blue-400 hover:text-blue-300 p-1 rounded action-button"
                              title="View"
                            >
                              <ViewIcon className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/write-blog?edit=${blog._id}`}
                              className="text-orange-400 hover:text-orange-300 p-1 rounded action-button"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                <div className="p-4 space-y-4">
                  {blogs.map((blog) => (
                    <div 
                      key={blog._id} 
                      className="bg-gray-750 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-200 blog-card"
                      onClick={() => handleBlogClick(blog)}
                    >
                      {/* Header with checkbox and actions */}
                      <div className="flex items-center justify-between mb-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBlogs.includes(blog._id)}
                            onChange={() => toggleBlogSelection(blog._id)}
                            className="rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                          />
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(blog.status)}`}>
                            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="text-blue-400 hover:text-blue-300 p-1 rounded action-button"
                            title="View"
                          >
                            <ViewIcon className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/write-blog?edit=${blog._id}`}
                            className="text-orange-400 hover:text-orange-300 p-1 rounded action-button"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Blog content */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="flex-shrink-0 h-16 w-16 relative">
                          {blog.featuredImage ? (
                            <Image
                              src={blog.featuredImage}
                              alt={blog.title}
                              fill
                              className="h-16 w-16 rounded-lg object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-3">
                            {truncateText(blog.excerpt, 150)}
                          </p>
                          <div className="text-xs text-gray-500">
                            {blog.readingTime} min read • {formatDate(blog.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Author and stats */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 h-6 w-6">
                            {blog.author.avatar ? (
                              <Image
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                width={24}
                                height={24}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-6 w-6 bg-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {blog.author.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-white truncate max-w-24">{blog.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{blog.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{blog.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-300 text-center sm:text-left">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => fetchBlogs(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev || loading}
                className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchBlogs(pagination.currentPage + 1)}
                disabled={!pagination.hasNext || loading}
                className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Blog Detail Modal */}
        {showBlogDetail && selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content custom-scrollbar">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Blog Details</h2>
                <button
                  onClick={closeBlogDetail}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Blog Info */}
                  <div className="space-y-6">
                    {/* Featured Image */}
                    {selectedBlog.featuredImage && (
                      <div className="relative h-48 bg-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={selectedBlog.featuredImage}
                          alt={selectedBlog.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}

                    {/* Title and Excerpt */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 break-words">{selectedBlog.title}</h3>
                      <p className="text-gray-300 leading-relaxed break-words">{selectedBlog.excerpt}</p>
                    </div>

                    {/* Meta Information */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{selectedBlog.readingTime} min read</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Created: {formatDate(selectedBlog.createdAt)}</span>
                        </div>
                      </div>
                      
                      {selectedBlog.publishedAt && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>Published: {formatDate(selectedBlog.publishedAt)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Updated: {formatDate(selectedBlog.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBlog.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700 text-gray-200 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Author and Stats */}
                  <div className="space-y-6">
                    {/* Author Information */}
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        Author
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-12 w-12">
                          {selectedBlog.author.avatar ? (
                            <Image
                              src={selectedBlog.author.avatar}
                              alt={selectedBlog.author.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-orange-600 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {selectedBlog.author.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-medium truncate">{selectedBlog.author.name}</div>
                          <div className="text-gray-400 text-sm truncate">{selectedBlog.author.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Blog Stats */}
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedBlog.views.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedBlog.comments.length}</div>
                          <div className="text-xs text-gray-400">Comments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedBlog.likes.length}</div>
                          <div className="text-xs text-gray-400">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedBlog.readingTime}</div>
                          <div className="text-xs text-gray-400">Min Read</div>
                        </div>
                      </div>
                    </div>

                    {/* Blog Status */}
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedBlog.status)}`}>
                            {selectedBlog.status.charAt(0).toUpperCase() + selectedBlog.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white truncate max-w-32">{selectedBlog.category}</span>
                        </div>
                        {selectedBlog.featured && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Featured:</span>
                            <span className="text-orange-400 font-medium">Yes</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-750 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/blogs/${selectedBlog.slug}`}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ViewIcon className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                        <Link
                          href={`/write-blog?edit=${selectedBlog._id}`}
                          className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                        {selectedBlog.status === 'banned' ? (
                          <button
                            onClick={() => {
                              handleBlogAction(selectedBlog._id, 'unban');
                              closeBlogDetail();
                            }}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Unban</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleBlogAction(selectedBlog._id, 'ban');
                              closeBlogDetail();
                            }}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Ban</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
