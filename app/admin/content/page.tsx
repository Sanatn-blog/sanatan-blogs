'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, Plus, Loader2, Search } from 'lucide-react';

export default function ContentManagement() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []); 

  if (loading) {
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
              <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Blog</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-900 rounded-lg">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Blogs</p>
                <p className="text-2xl font-bold text-white">0</p>
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
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-900 rounded-lg">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Published</p>
                <p className="text-2xl font-bold text-white">0</p>
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
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <select className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700 text-white">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-700 text-white">
              <option value="all">All Categories</option>
            </select>

            <div className="text-sm text-gray-300 flex items-center">
              0 blogs found
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="p-6 text-center">
            <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
            <p className="text-gray-300 mb-6">
              Start by creating your first blog post or import existing content.
            </p>
            <button className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Create First Blog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
