import React from 'react';
import Link from 'next/link';

export default function ApplicationSubmittedPage() {
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
        
        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
          Thank you for submitting your application to become a blog writer.
        </p>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          Our admin team will review your application and verify your credentials. Once approved, you&apos;ll be able to write and publish your own blogs.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-yellow-800 text-xs sm:text-sm font-medium">
            <strong>Current Status:</strong> Awaiting Admin Verification
          </p>
          <p className="text-yellow-700 text-xs mt-1 leading-relaxed">
            You&apos;ll receive a notification once your application is reviewed.
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-600 text-xs sm:text-sm">
            While you wait, explore our existing blog collection:
          </p>
          <Link href="/blogs">
            <span className="inline-block w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-medium shadow hover:from-orange-700 hover:to-pink-700 transition-all text-sm sm:text-base">
              Explore Blogs
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 