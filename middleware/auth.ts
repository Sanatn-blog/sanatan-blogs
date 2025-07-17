import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    _id: string;
    email: string;
    role: string;
    status: string;
  };
}

export async function authenticateUser(request: AuthenticatedRequest): Promise<{
  success: boolean;
  user?: {
    userId: string;
    _id: string;
    email: string;
    role: string;
    status: string;
  };
  error?: string;
}> {
  try {
    console.log('Authenticating user...');
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    console.log('Token length:', token.length);
    
    const decoded = verifyToken(token);

    if (!decoded) {
      console.log('Token verification failed');
      return { success: false, error: 'Invalid token' };
    }

    console.log('Token decoded successfully, userId:', decoded.userId);

    // Connect to database and verify user exists and is approved
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('User not found in database');
      return { success: false, error: 'User not found' };
    }

    console.log('User found, status:', user.status);
    if (user.status !== 'approved') {
      console.log('User not approved');
      return { success: false, error: 'User not approved' };
    }

    const userWithDetails = {
      userId: user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status
    };

    console.log('Authentication successful');
    return { success: true, user: userWithDetails };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export function requireAuth<T extends { params: Promise<Record<string, string>> }>(
  handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse>
) {
  return async (request: AuthenticatedRequest, context: T) => {
    console.log('requireAuth middleware called');
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      console.log('Authentication failed:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    console.log('Authentication successful, calling handler');
    request.user = authResult.user;
    return handler(request, context);
  };
}

export function requireRole(roles: string[]) {
  return function <T extends { params: Promise<Record<string, string>> }>(
    handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse>
  ) {
    return async (request: AuthenticatedRequest, context: T) => {
      const authResult = await authenticateUser(request);
      
      if (!authResult.success) {
        return NextResponse.json(
          { error: authResult.error },
          { status: 401 }
        );
      }

      if (!roles.includes(authResult.user!.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      request.user = authResult.user;
      return handler(request, context);
    };
  };
}

export function requireAdmin<T extends { params: Promise<Record<string, string>> }>(
  handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse>
) {
  return requireRole(['admin', 'super_admin'])(handler);
}

export function requireSuperAdmin<T extends { params: Promise<Record<string, string>> }>(
  handler: (req: AuthenticatedRequest, context: T) => Promise<NextResponse>
) {
  return requireRole(['super_admin'])(handler);
}

// Utility function to check if user is approved
export async function isUserApproved(userId: string): Promise<boolean> {
  try {
    await connectDB();
    const user = await User.findById(userId);
    return user?.status === 'approved';
  } catch (error) {
    console.error('Error checking user approval:', error);
    return false;
  }
}

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map();

export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return function (handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                request.headers.get('x-client-ip') || 
                'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;

      if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
      }

      const requests = rateLimitMap.get(ip);
      const validRequests = requests.filter((time: number) => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }

      validRequests.push(now);
      rateLimitMap.set(ip, validRequests);

      return handler(request);
    };
  };
} 