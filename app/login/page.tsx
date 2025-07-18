'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  LogIn,
  
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}



export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { login, loading: authLoading } = useAuth();

  const checkExistingAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          router.push('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    checkExistingAuth();
  }, [checkExistingAuth]);



  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const firstName = result.user?.name?.split(' ')[0] || 'User';
        toast.success(`🎉 Welcome back, ${firstName}!`);
        router.push('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // const sendOtp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     // API call to send OTP
  //     const response = await fetch('/api/auth/send-otp', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ phoneNumber: otpData.phoneNumber }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setOtpSent(true);
  //       setOtpTimer(60); // 60 seconds timer
  //     } else {
  //       setError(data.message || 'Failed to send OTP');
  //     }
  //   } catch {
  //     setError('Network error. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const verifyOtp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await fetch('/api/auth/verify-otp', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(otpData),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       localStorage.setItem('accessToken', data.accessToken);
  //       if (data.refreshToken) {
  //         document.cookie = `refreshToken=${data.refreshToken}; path=/; httpOnly; secure; sameSite=strict`;
  //       }
  //       router.push('/dashboard');
  //     } else {
  //       setError(data.message || 'Invalid OTP');
  //     }
  //   } catch {
  //     setError('Network error. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSocialLogin = async (provider: string) => {
  //   setSocialLoading(provider);
  //   try {
  //     // Redirect to social auth endpoint
  //     window.location.href = `/api/auth/social/${provider}`;
  //   } catch (error) {
  //     console.error(`${provider} login failed:`, error);
  //     setSocialLoading(null);
  //   }
  // };

  // const resendOtp = () => {
  //   if (otpTimer === 0) {
  //     const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
  //     sendOtp(fakeEvent);
  //   }
  // };

  // const socialProviders = [
  //   {
  //     name: 'Google',
  //     icon: (
  //       <svg className="w-5 h-5" viewBox="0 0 24 24">
  //         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  //         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  //         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
  //         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  //       </svg>
  //     ),
  //     color: 'hover:bg-red-50 border-gray-300 text-gray-700',
  //     provider: 'google'
  //   },
  //   {
  //     name: 'Facebook',
  //     icon: (
  //       <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
  //         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  //       </svg>
  //     ),
  //     color: 'hover:bg-blue-50 border-gray-300 text-gray-700',
  //     provider: 'facebook'
  //   },
  //   {
  //     name: 'Instagram',
  //     icon: (
  //       <svg className="w-5 h-5" fill="url(#instagram-gradient)" viewBox="0 0 24 24">
  //         <defs>
  //           <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
  //             <stop offset="0%" stopColor="#833ab4"/>
  //             <stop offset="50%" stopColor="#fd1d1d"/>
  //             <stop offset="100%" stopColor="#fcb045"/>
  //           </linearGradient>
  //         </defs>
  //         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  //       </svg>
  //     ),
  //     color: 'hover:bg-pink-50 border-gray-300 text-gray-700',
  //     provider: 'instagram'
  //   },
  //   {
  //     name: 'Twitter',
  //     icon: (
  //       <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
  //         <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  //       </svg>
  //     ),
  //     color: 'hover:bg-blue-50 border-gray-300 text-gray-700',
  //     provider: 'twitter'
  //   }
  // ];

  if (!mounted || checkingAuth || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-2xl text-white font-bold">SB</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue your spiritual journey
          </p>
        </div>

        {/* Login Method Toggle - Commented out for now */}
        {/* <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                setLoginMethod('email');
                setOtpSent(false);
                setError('');
              }}
              className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-xl font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => {
                setLoginMethod('phone');
                setOtpSent(false);
                setError('');
              }}
              className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-xl font-medium transition-colors ${
                loginMethod === 'phone'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Phone</span>
            </button>
          </div>
        </div> */}

        {/* Main Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Email Login - Always show this now */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Phone OTP Login - Commented out for now */}
          {/* {loginMethod === 'phone' && (
            <div className="space-y-6">
              {!otpSent ? (
                <form onSubmit={sendOtp} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={otpData.phoneNumber}
                        onChange={(e) => setOtpData({ ...otpData, phoneNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      We&apos;ll send you a verification code
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Smartphone className="h-5 w-5" />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Your Phone</h3>
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code sent to <br />
                      <span className="font-medium">{otpData.phoneNumber}</span>
                    </p>
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
                      value={otpData.otp}
                      onChange={(e) => setOtpData({ ...otpData, otp: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest text-gray-900"
                      placeholder="123456"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpData({ ...otpData, otp: '' });
                      }}
                      className="flex items-center space-x-1 text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Change Number</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={otpTimer > 0}
                      className="text-orange-600 hover:text-orange-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpData.otp.length !== 6}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )} */}

          {/* Divider - Commented out for now */}
          {/* <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>
          </div> */}

          {/* Social Login Buttons - Commented out for now */}
          {/* <div className="grid grid-cols-2 gap-3">
            {socialProviders.map((provider) => (
              <button
                key={provider.provider}
                onClick={() => handleSocialLogin(provider.provider)}
                disabled={socialLoading === provider.provider}
                className={`flex items-center justify-center space-x-2 py-3 px-4 border rounded-xl transition-all duration-300 font-medium ${provider.color} ${
                  socialLoading === provider.provider ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {socialLoading === provider.provider ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                ) : (
                  <>
                    {provider.icon}
                    <span className="hidden sm:inline">{provider.name}</span>
                  </>
                )}
              </button>
            ))}
          </div> */}
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 