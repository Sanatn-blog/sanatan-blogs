'use client';

import { useState, useEffect } from 'react';
import { FullScreenLoading, SimpleLoading, SkeletonLoading } from '@/components/LoadingPage';

export default function LoadingDemoPage() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // Auto-hide full screen loading after 5 seconds
    if (showFullScreen) {
      const timer = setTimeout(() => {
        setShowFullScreen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showFullScreen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Full Screen Loading */}
      {showFullScreen && <FullScreenLoading />}
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Loading Components Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Explore the beautiful loading components for Sanatan Blogs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Screen Loading Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Full Screen Loading
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A beautiful full-screen loading experience with progress bar and spiritual elements.
            </p>
            <button
              onClick={() => setShowFullScreen(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Show Full Screen Loading
            </button>
          </div>

          {/* Custom Loading Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Custom Loading
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Customizable loading component with different messages and options.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowSimple(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Show Simple Loading
              </button>
              <button
                onClick={() => setShowSkeleton(true)}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300"
              >
                Show Skeleton Loading
              </button>
            </div>
          </div>

          {/* Simple Loading Demo */}
          {showSimple && (
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Simple Loading Component
              </h2>
              <SimpleLoading message="Loading content..." />
              <button
                onClick={() => setShowSimple(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Hide Loading
              </button>
            </div>
          )}

          {/* Skeleton Loading Demo */}
          {showSkeleton && (
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Skeleton Loading Component
              </h2>
              <div className="space-y-6">
                <SkeletonLoading />
                <SkeletonLoading />
                <SkeletonLoading />
              </div>
              <button
                onClick={() => setShowSkeleton(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Hide Skeleton
              </button>
            </div>
          )}
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Usage Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Full Screen Loading
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`import { FullScreenLoading } from '@/components/LoadingPage';

// Use in your component
{isLoading && <FullScreenLoading />}`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Custom Loading
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`import LoadingPage from '@/components/LoadingPage';

// Use with custom message and progress
<LoadingPage 
  message="Loading spiritual wisdom..."
  showProgress={true}
  progress={75}
/>`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Simple Loading
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`import { SimpleLoading } from '@/components/LoadingPage';

// Use for inline loading
<SimpleLoading message="Loading..." />`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Skeleton Loading
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`import { SkeletonLoading } from '@/components/LoadingPage';

// Use for content placeholders
<SkeletonLoading />`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 