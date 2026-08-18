import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// The profile fields every authenticated route may need. Deliberately narrow:
// it leaves out the password and the unbounded followers / following /
// bookmarks arrays, which no caller of authenticateUser reads and which grow
// without limit as the site is used.
const AUTH_USER_FIELDS =
  'name username email role status avatar bio socialLinks lastLogin createdAt';

export interface AuthenticatedUser {
  userId: string;
  _id: string;
  name?: string;
  username?: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  bio?: string;
  socialLinks?: Record<string, string | undefined>;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

export async function authenticateUser(request: AuthenticatedRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
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

    // Connect to database and verify user exists and is approved. This runs on
    // every authenticated request, so it reads a projection rather than the
    // whole document, and skips hydrating a Mongoose model it never mutates.
    await connectDB();
    const user = await User.findById(decoded.userId)
      .select(AUTH_USER_FIELDS)
      .lean<{
        _id: { toString(): string };
        name?: string;
        username?: string;
        email?: string;
        role?: string;
        status?: string;
        avatar?: string;
        bio?: string;
        socialLinks?: Record<string, string | undefined>;
        lastLogin?: Date;
        createdAt?: Date;
      } | null>();

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.status !== 'approved') {
      return { success: false, error: 'User not approved' };
    }

    const userWithDetails: AuthenticatedUser = {
      userId: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email ?? '',
      role: user.role ?? 'user',
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
      socialLinks: user.socialLinks,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

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
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

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