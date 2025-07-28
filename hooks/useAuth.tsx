'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  mounted: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string; user?: User; requiresVerification?: boolean; email?: string }>;
  register: (userData: { name: string; email: string; password: string; bio?: string; socialLinks?: object }) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  updateUser: (userData: Partial<User> & { id?: string }) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        localStorage.removeItem('accessToken');
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        // Immediately set the user state
        setUser(data.user);
        // Force a re-render by updating loading state
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.error,
          requiresVerification: data.requiresVerification,
          email: data.email
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    socialLinks?: object;
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
    router.push('/');
  };

  const updateUser = (userData: Partial<User> & { id?: string }) => {
    // Map 'id' field to '_id' if it exists
    const mappedUserData = userData.id ? { ...userData, _id: userData.id } : userData;
    delete (mappedUserData as any).id; // Remove the 'id' field
    
    if (user) {
      setUser({ ...user, ...mappedUserData });
    } else if (mappedUserData._id) {
      // If no user exists but we have user data with an ID, create a new user state
      setUser(mappedUserData as User);
    }
  };

  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return null;
  };

  const value = {
    user,
    loading: loading || !mounted,
    mounted,
    login,
    register,
    logout,
    checkAuth,
    refreshToken,
    updateUser,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 