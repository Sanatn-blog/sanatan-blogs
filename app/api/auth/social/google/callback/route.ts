// TEMPORARILY DISABLED: Google OAuth Callback
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import connectDB from '@/lib/mongodb';
// import User from '@/models/User';

export async function GET() {
  // Google OAuth callback temporarily disabled
  return NextResponse.json(
    { message: 'Google OAuth callback is temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state') || '/dashboard';

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/social/google/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`);
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`);
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.id,
        avatar: googleUser.picture,
        isVerified: true,
        verifiedAt: new Date(),
        isActive: true,
        authProvider: 'google'
      });
      await user.save();
    } else {
      // Update existing user with Google info
      user.googleId = googleUser.id;
      user.avatar = googleUser.picture;
      if (!user.isVerified) {
        user.isVerified = true;
        user.verifiedAt = new Date();
      }
      await user.save();
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        name: user.name,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
              process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create response with redirect
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}${state}?token=${accessToken}`);

    // Set refresh token in httpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`);
  }
  */
} 