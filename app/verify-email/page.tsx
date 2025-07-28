'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface VerificationFormData {
  email: string;
  otp: string;
}

export default function VerifyEmailPage() {
  const [formData, setFormData] = useState<VerificationFormData>({
    email: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();

  // Get email from URL params if available
  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    if (emailFromParams) {
      setFormData(prev => ({ ...prev, email: emailFromParams }));
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email.trim() || !formData.otp.trim()) {
      setError('Please enter both email and verification code');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: formData.otp.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully! Redirecting...');
        
        // Store tokens
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        
        // Update auth context with user data
        if (data.user) {
          updateUser(data.user);
        }
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push('/email-verified');
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification code sent successfully!');
        setCountdown(60); // 60 second cooldown
      } else {
        setError(data.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                required
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest text-gray-900"
                placeholder="123456"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Check your spam folder or{' '}
            <Link href="/contact" className="text-orange-600 hover:text-orange-700">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 