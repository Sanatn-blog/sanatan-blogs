'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmailVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Success Message */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Email Verified!</h2>
          <p className="mt-2 text-gray-600">
            Your email has been successfully verified. Welcome to Sanatan Blogs!
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900">
              Verification Complete
            </h3>
            
            <p className="text-sm text-gray-600">
              Your account is now active and ready to use. You&apos;ll be redirected to the home page in a few seconds.
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
              >
                Go to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            You can now access all features of Sanatan Blogs
          </p>
        </div>
      </div>
    </div>
  );
} 