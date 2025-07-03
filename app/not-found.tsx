'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, BookOpen, Users } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-orange-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-orange-600 text-white p-4 rounded-full animate-bounce">
              <Search className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            पेज नहीं मिला!
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sorry, the page you are looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <Link
            href="/blogs"
            className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse Blogs
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            या फिर इन pages पर जाएं:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-orange-200"
            >
              <Home className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Home</span>
            </Link>
            
            <Link
              href="/about"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-orange-200"
            >
              <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">About Us</span>
            </Link>
            
            <Link
              href="/login"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-orange-200"
            >
              <div className="w-6 h-6 bg-orange-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Login</span>
            </Link>
            
            <Link
              href="/register"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-orange-200"
            >
              <div className="w-6 h-6 bg-orange-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Sign Up</span>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back to Previous Page
          </button>
        </div>

        {/* Fun Message */}
        <div className="mt-8">
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-2xl">🤔</div>
              <p className="text-orange-800 font-medium">
                Lost in the world of blogs? Let us help you find your way!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 