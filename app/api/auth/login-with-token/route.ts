import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateSecureAccessToken, generateRefreshToken, verifyPasswordWithToken } from '@/lib/jwt';
import { rateLimit } from '@/middleware/auth';

async function loginWithTokenHandler(request: NextRequest) {
  try {
    console.log('🔐 Login with token attempt started');
    await connectDB();

    const body = await request.json();
    const { emailOrUsername, password, token } = body;

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
    let user = null;
    
    // Check if it's a valid ObjectId (user ID)
    if (emailOrUsername.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('🔍 Searching by user ID:', emailOrUsername);
      user = await User.findById(emailOrUsername).select('+password');
    }
    
    // If not found by ID, try username
    if (!user) {
      console.log('🔍 Searching by username:', emailOrUsername);
      user = await User.findOne({
        username: emailOrUsername.toLowerCase()
      }).select('+password');
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

    // Check if user is approved
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
    } else if (user.status === 'pending') {
      console.log('⚠️ User is pending - allowing login for testing');
    }

    // Verify password using database
    console.log('🔐 Verifying password with database...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password valid (database):', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password (database)');
      return NextResponse.json(
        { error: 'Invalid password. Please check your password and try again.' },
        { status: 401 }
      );
    }

    // Additional verification with JWT token if provided
    let tokenVerificationPassed = true;
    if (token) {
      console.log('🔐 Verifying password with JWT token...');
      const isTokenPasswordValid = await verifyPasswordWithToken(token, password);
      console.log('🔐 Password valid (JWT token):', isTokenPasswordValid);
      
      if (!isTokenPasswordValid) {
        console.log('⚠️ Password verification with token failed, but database verification passed');
        tokenVerificationPassed = false;
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

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
      accessToken,
      tokenVerificationPassed,
      securityLevel: token ? 'enhanced' : 'standard'
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
    console.error('❌ Login with token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting (10 login attempts per 15 minutes per IP)
export const POST = rateLimit(10, 15 * 60 * 1000)(loginWithTokenHandler); 