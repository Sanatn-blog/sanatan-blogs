'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, Eye, Heart, Clock, ChevronRight, TrendingUp, Star } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  likes: string[];
  readingTime: number;
  createdAt: string;
  updatedAt: string;
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
  popularTags: Array<{
    name: string;
    count: number;
  }>;
}

const categories = ['All', 'Spirituality', 'Yoga', 'Philosophy', 'Festivals', 'Culture', 'History', 'Technology', 'Health', 'Education', 'Lifestyle', 'Art', 'Science', 'Politics', 'Environment', 'Other'];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNext: false,
    hasPrev: false
  });
  const blogsPerPage = 6;

  // Fetch blogs from API
  const fetchBlogs = async (page: number = 1, category?: string, search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: blogsPerPage.toString()
      });
      
      if (category && category !== 'All') {
        params.append('category', category);
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/blogs?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data: BlogResponse = await response.json();
      
      setBlogs(data.blogs);
      setFilteredBlogs(data.blogs);
      setPagination(data.pagination);
      
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // Handle search and category changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBlogs(1, selectedCategory !== 'All' ? selectedCategory : undefined, searchTerm || undefined);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBlogs(page, selectedCategory !== 'All' ? selectedCategory : undefined, searchTerm || undefined);
  };

  const featuredBlogs = blogs.filter(blog => blog.views > 100); // Consider high-view blogs as featured

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* SEO Meta Tags */}
      <head>
        <title>Sanatan Blogs - Spiritual Knowledge and Life Philosophy</title>
        <meta name="description" content="Read excellent articles on Sanatan Dharma, Yoga, Meditation, and spiritual knowledge. Study ancient Indian philosophy to improve your life." />
        <meta name="keywords" content="Sanatan Dharma, Yoga, Meditation, Spirituality, Gita, Vedanta, Indian Philosophy" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Sanatan Blogs - Spiritual Knowledge and Life Philosophy" />
        <meta property="og:description" content="Deep articles connecting ancient Indian knowledge with modern life" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/blogs" />
      </head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sanatan <span className="text-yellow-300">Blogs</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
            Read deep articles connecting ancient Indian knowledge with modern life
          </p>
          <div className="flex items-center justify-center space-x-2 text-yellow-200">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-lg">Begin Your Spiritual Journey</span>
            <Star className="h-5 w-5 fill-current" />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            <span className="font-medium">{pagination.totalBlogs}</span> articles found
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <TrendingUp className="inline-block h-8 w-8 text-orange-600 mr-2" />
                Featured Articles
              </h2>
              <p className="text-lg text-gray-600">Most popular and important articles</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-600">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="bg-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                      <Link href={`/blogs/${blog._id}`}>
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(blog.publishedAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.readingTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">
                            {blog.author.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{blog.author.name}</span>
                      </div>

                      <Link
                        href={`/blogs/${blog._id}`}
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Read
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Blogs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Articles
            </h2>
            <p className="text-lg text-gray-600">Explore other articles to go deeper into knowledge</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Articles</h3>
              <p className="text-gray-600 mb-8">{error}</p>
              <button
                onClick={() => fetchBlogs(1)}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gradient-to-r from-gray-400 to-gray-600">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-orange-600 text-white px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                      <Link href={`/blogs/${blog._id}`}>
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(blog.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {blog.readingTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">
                            {blog.author.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{blog.author.name}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {blog.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {blog.likes.length}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="w-full bg-orange-600 text-white py-2 px-4 rounded-xl hover:bg-orange-700 transition-colors font-medium text-center block"
                      >
                        Read Full Article
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h3>
              <p className="text-gray-600 mb-8">Please try changing your search or filter</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
              >
                View All Articles
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Latest Articles Directly in Your Email
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Subscribe to our newsletter and receive articles full of spiritual knowledge regularly
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}