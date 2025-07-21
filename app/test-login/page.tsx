'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TestLoginPage() {
  const [emailOrUserId, setEmailOrUserId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<object | null>(null);

  const testLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername: emailOrUserId, password })
      });

      const data = await response.json();
      setTestResult(data);
      
      if (response.ok) {
        toast.success('Test completed successfully');
      } else {
        toast.error(data.message || 'Test failed');
      }
    } catch {
      toast.error('Network error');
      setTestResult({ error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const testLoginWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/auth/login-with-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          emailOrUsername: emailOrUserId, 
          password,
          token: token || undefined
        })
      });

      const data = await response.json();
      setTestResult(data);
      
      if (response.ok) {
        toast.success('Enhanced login test completed successfully');
        // Store the new token for future use
        if (data.accessToken) {
          setToken(data.accessToken);
        }
      } else {
        toast.error(data.error || 'Enhanced login test failed');
      }
    } catch {
      toast.error('Network error');
      setTestResult({ error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-login');
      const data = await response.json();
      setTestResult(data);
      toast.success('Users retrieved');
    } catch {
      toast.error('Failed to get users');
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'user',
          status: 'approved'
        })
      });

      const data = await response.json();
      setTestResult(data);
      
      if (response.ok) {
        toast.success('Test user created successfully');
        setEmailOrUserId('test@example.com');
        setPassword('password123');
      } else {
        toast.error(data.message || 'Failed to create test user');
      }
    } catch {
      toast.error('Failed to create test user');
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async () => {
    if (!emailOrUserId) {
      toast.error('Please enter an email first');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/test-fix-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailOrUserId,
          newPassword: 'password123'
        })
      });

      const data = await response.json();
      setTestResult(data);
      
      if (response.ok) {
        toast.success('Password reset successfully');
        setPassword('password123');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Login Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={getUsers}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Get All Users
              </button>
              
              <button
                onClick={createTestUser}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Create Test User
              </button>
              
              <button
                onClick={resetUserPassword}
                disabled={loading}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                Reset Password
              </button>
            </div>
          </div>

          {/* Login Test Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Test Login</h2>
            
            <form onSubmit={testLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or User ID
                </label>
                <input
                  type="text"
                  value={emailOrUserId}
                  onChange={(e) => setEmailOrUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email or user ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter password"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Standard Login'}
              </button>
            </form>
          </div>

          {/* Enhanced Login Test Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Enhanced Login (with JWT)</h2>
            
            <form onSubmit={testLoginWithToken} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or User ID
                </label>
                <input
                  type="text"
                  value={emailOrUserId}
                  onChange={(e) => setEmailOrUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email or user ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JWT Token (Optional)
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter JWT token for enhanced verification"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Enhanced Login'}
              </button>
            </form>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 