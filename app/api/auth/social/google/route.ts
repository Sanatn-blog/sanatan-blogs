// TEMPORARILY DISABLED: Google OAuth
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';

export async function GET() {
  // Google OAuth temporarily disabled
  return NextResponse.json(
    { message: 'Google OAuth is temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // Google OAuth configuration
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/social/google/callback`;
  
  if (!clientId) {
    return NextResponse.json(
      { message: 'Google OAuth not configured' },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: redirectUrl,
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `${googleAuthUrl}?${params.toString()}`;
  
  return NextResponse.redirect(authUrl);
  */
} 