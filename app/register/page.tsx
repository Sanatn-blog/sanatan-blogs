'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  UserPlus,
  Smartphone,
} from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [authLoading, setAuthLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const router = useRouter();

  // Debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Debounced values for validation
  const debouncedEmail = useDebounce(formData.email, 500);
  const debouncedPhone = useDebounce(formData.phoneNumber, 500);

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
          const userData = await response.json();
          // Check user status and redirect accordingly
          if (userData.user.status === 'pending') {
            router.push('/application-submitted');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    checkExistingAuth();
  }, [checkExistingAuth]);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation function
  const validatePhoneNumber = (phone: string) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Check if email exists
  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !validateEmail(email)) return;
    
    setCheckingEmail(true);
    try {
      const response = await fetch(`/api/auth/check-exists?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.email) {
          setFieldErrors(prev => ({ ...prev, email: 'Email address already exists' }));
        } else {
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  // Check if phone number exists
  const checkPhoneExists = useCallback(async (phone: string) => {
    if (!phone || !validatePhoneNumber(phone)) return;
    
    setCheckingPhone(true);
    try {
      const response = await fetch(`/api/auth/check-exists?phoneNumber=${encodeURIComponent(phone)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.phoneNumber) {
          setFieldErrors(prev => ({ ...prev, phoneNumber: 'Phone number already exists' }));
        } else {
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.phoneNumber;
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('Error checking phone:', error);
    } finally {
      setCheckingPhone(false);
    }
  }, []);

  // Check email existence when debounced email changes
  useEffect(() => {
    if (debouncedEmail && validateEmail(debouncedEmail)) {
      checkEmailExists(debouncedEmail);
    }
  }, [debouncedEmail, checkEmailExists]);

  // Check phone existence when debounced phone changes
  useEffect(() => {
    if (debouncedPhone && validatePhoneNumber(debouncedPhone)) {
      checkPhoneExists(debouncedPhone);
    }
  }, [debouncedPhone, checkPhoneExists]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validation
    if (!formData.name.trim()) {
      setFieldErrors({ name: 'Name is required' });
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setFieldErrors({ email: 'Email is required' });
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setFieldErrors({ phoneNumber: 'Phone number is required' });
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setFieldErrors({ phoneNumber: 'Please enter a valid phone number' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();

            if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken}; path=/; httpOnly; secure; sameSite=strict`;
        }
        router.push('/application-submitted');
      } else {
        // Field-specific error handling
        if (data.error) {
          if (data.error.toLowerCase().includes('email')) {
            setFieldErrors({ email: data.error });
          } else if (data.error.toLowerCase().includes('phone')) {
            setFieldErrors({ phoneNumber: data.error });
          } else if (data.error.toLowerCase().includes('password')) {
            setFieldErrors({ password: data.error });
          } else if (data.error.toLowerCase().includes('name')) {
            setFieldErrors({ name: data.error });
          } else {
            setError(data.error);
          }
        } else {
          setError('Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) {
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
          <h2 className="text-3xl font-bold text-gray-900">Join Our Community!</h2>
          <p className="mt-2 text-gray-600">
            Create your account to start your spiritual journey with us
          </p>
        </div>

        {/* Main Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailRegister} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900`}
                  placeholder="Enter your full name"
                />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
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
                  className={`w-full pl-10 pr-4 py-3 border ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900`}
                  placeholder="Enter your email"
                />
                {checkingEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border ${fieldErrors.phoneNumber ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900`}
                  placeholder="+91 98765 43210"
                />
                {checkingPhone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Include country code (e.g., +91 for India)
              </p>
              {fieldErrors.phoneNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
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
                  className={`w-full pl-10 pr-12 py-3 border ${fieldErrors.password ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border ${fieldErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-orange-600 hover:text-orange-500 font-medium">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-500 font-medium">
                  Privacy Policy
                </Link>
              </label>
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
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 