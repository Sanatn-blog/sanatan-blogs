import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateSecureAccessToken, generateRefreshToken } from '@/lib/jwt';
import { rateLimit } from '@/middleware/auth';

async function loginHandler(request: NextRequest) {
  try {
    console.log('🔐 Login attempt started');
    await connectDB();

    const body = await request.json();
    const { emailOrUsername, password } = body;

    console.log('📧 Login attempt for:', emailOrUsername);

    // Basic validation
    if (!emailOrUsername || !password) {
      console.log('❌ Missing emailOrUsername or password');
      return NextResponse.json(
        { error: 'Email or user ID and password are required' },
        { status: 400 }
      );
    }

    // Find user with password field included
    // Try to find by email, username, or user ID
    let user = null;
    
    // Check if it's a valid ObjectId (user ID)
    if (emailOrUsername.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('🔍 Searching by user ID:', emailOrUsername);
      user = await User.findById(emailOrUsername).select('+password');
    }
    
    // If not found by ID, try username
    if (!user) {
      console.log('🔍 Searching by username:', emailOrUsername);
      const usernameSearch = await User.findOne({
        username: emailOrUsername.toLowerCase()
      }).select('+password');
      console.log('🔍 Username search result:', usernameSearch ? 'Found' : 'Not found');
      user = usernameSearch;
    }
    
    // If not found by username, try email
    if (!user) {
      console.log('🔍 Searching by email:', emailOrUsername);
      user = await User.findOne({
        email: emailOrUsername.toLowerCase()
      }).select('+password');
    }
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found. Please check your email, username, or user ID.' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', user.email, 'Status:', user.status);

    // Check if user is approved and verified
    if (user.status === 'rejected') {
      console.log('❌ User rejected');
      return NextResponse.json(
        { error: 'Your account has been rejected. Please contact admin.' },
        { status: 403 }
      );
    } else if (user.status === 'suspended') {
      console.log('❌ User suspended');
      return NextResponse.json(
        { error: 'Your account has been suspended. Please contact admin.' },
        { status: 403 }
      );
    } else if (user.status === 'pending' && !user.emailVerified) {
      console.log('❌ User not verified');
      return NextResponse.json(
        { 
          error: 'Please verify your email address before logging in.',
          requiresVerification: true,
          email: user.email
        },
        { status: 403 }
      );
    } else if (user.status === 'pending') {
      console.log('⚠️ User is pending - allowing login for testing');
      // For testing purposes, we'll allow pending users to log in
      // In production, you should remove this and require approval
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Invalid password. Please check your password and try again.' },
        { status: 401 }
      );
    }

    // Update last login without triggering validation
    try {
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() }, { new: true });
    } catch (updateError) {
      console.log('⚠️ Failed to update lastLogin, but continuing with login:', updateError);
      // Continue with login even if lastLogin update fails
    }

    // Generate tokens with password hash for additional security
    const accessToken = generateSecureAccessToken(user._id.toString(), user.password);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Prepare user response (without sensitive data)
    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
      socialLinks: user.socialLinks,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    console.log('✅ Login successful for:', user.email);

    // Set secure HTTP-only cookies for tokens
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      accessToken
    }, { status: 200 });

    // Set refresh token as HTTP-only cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    
    // Handle specific validation errors
    if (error instanceof Error && error.message.includes('User validation failed')) {
      return NextResponse.json(
        { error: 'Account validation error. Please contact support.' },
        { status: 400 }
      );
    }
    
    // Handle other specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Login failed. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Apply rate limiting (10 login attempts per 15 minutes per IP)
export const POST = rateLimit(10, 15 * 60 * 1000)(loginHandler); 