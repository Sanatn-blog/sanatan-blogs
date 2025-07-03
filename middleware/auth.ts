import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload & {
    _id: string;
  };
}

export async function authenticateUser(request: AuthenticatedRequest): Promise<{
  success: boolean;
  user?: JWTPayload & { _id: string };
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return { success: false, error: 'Invalid token' };
    }

    // Connect to database and verify user exists and is approved
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.status !== 'approved') {
      return { success: false, error: 'User not approved' };
    }

    const userWithId = {
      ...decoded,
      _id: user._id.toString()
    };

    return { success: true, user: userWithId };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: AuthenticatedRequest) => {
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    request.user = authResult.user;
    return handler(request);
  };
}

export function requireRole(roles: string[]) {
  return function (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (request: AuthenticatedRequest) => {
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
      return handler(request);
    };
  };
}

export function requireAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return requireRole(['admin', 'super_admin'])(handler);
}

export function requireSuperAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
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