'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Eye, 
  BookmarkPlus,
  User,
  ArrowLeft,
  Loader2,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BookmarkedBlog {
  _id: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  readingTime: number;
  views: number;
  likes: string[];
  publishedAt?: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface BookmarksResponse {
  bookmarks: BookmarkedBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`/api/blogs/bookmarks?page=${pagination.page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookmarks');
      }

      const data: BookmarksResponse = await response.json();
      setBookmarks(data.bookmarks);
      setPagination(data.pagination);

    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchBookmarks();
    }
  }, [authLoading, user, fetchBookmarks]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRemoveBookmark = async (blogId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`/api/blogs/${blogId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove the blog from the local state
        setBookmarks(prev => prev.filter(blog => blog._id !== blogId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to remove bookmark');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Failed to remove bookmark');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view your bookmarks.</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <BookmarkPlus className="h-6 w-6 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchBookmarks}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h2>
            <p className="text-gray-600 mb-6">Start exploring blogs and bookmark your favorites!</p>
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Explore Blogs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {pagination.total} bookmarked {pagination.total === 1 ? 'blog' : 'blogs'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Featured Image */}
                  {blog.featuredImage && (
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {blog.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                      <Link href={`/blogs/${blog._id}`}>
                        {blog.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-3 mb-4">
                      {blog.author.avatar ? (
                        <Image
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm text-gray-700 font-medium">
                        {blog.author.name}
                      </span>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(blog.publishedAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.readingTime} min read
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {blog.views}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center"
                      >
                        Read Article
                      </Link>
                      <button
                        onClick={() => handleRemoveBookmark(blog._id)}
                        className="ml-3 p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Remove bookmark"
                      >
                        <BookmarkPlus className="h-5 w-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 