'use client';

import Link from 'next/link';
import { ArrowRight, Users, BookOpen, Shield, Star, PenTool } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, loading, mounted } = useAuth();

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              सनातन 
              <span className="text-orange-600"> Blogs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Share your thoughts, stories, and knowledge with the world. 
              Join our community of writers and readers who believe in authentic storytelling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                // User is logged in - show write blog and explore blogs buttons
                <>
                  <Link
                    href="/write-blog"
                    className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    <PenTool className="mr-2 h-5 w-5" />
                    Write Blog
                  </Link>
                  <Link
                    href="/blogs"
                    className="inline-flex items-center px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    Explore Blogs
                  </Link>
                </>
              ) : (
                // User is not logged in - show register and sign in buttons
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Start Writing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-30 animate-pulse delay-300"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Sanatan Blogs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A platform built for serious writers and thoughtful readers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 text-white rounded-lg mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Secure Platform
              </h3>
              <p className="text-gray-600">
                Advanced security measures with admin approval system to ensure quality content and user safety.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 text-white rounded-lg mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Connect with like-minded writers and readers. Build meaningful relationships through authentic content.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-lg mb-6">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Rich Content
              </h3>
              <p className="text-gray-600">
                Create beautiful blogs with image uploads, SEO optimization, and multiple content categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start your blogging journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-full text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Register
              </h3>
              <p className="text-gray-600">
                Create your account with basic information
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-full text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Approved
              </h3>
              <p className="text-gray-600">
                Wait for admin approval to ensure quality
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-full text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Writing
              </h3>
              <p className="text-gray-600">
                Create and publish your amazing content
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 text-white rounded-full text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Build Audience
              </h3>
              <p className="text-gray-600">
                Engage with readers and grow your following
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of writers who trust Sanatan Blogs to share their thoughts with the world.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Today
            <Star className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
