// TEMPORARILY DISABLED: Facebook OAuth
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';

export async function GET() {
  // Facebook OAuth temporarily disabled
  return NextResponse.json(
    { message: 'Facebook OAuth is temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  // Facebook OAuth configuration
  const facebookAuthUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/social/facebook/callback`;
  
  if (!clientId) {
    return NextResponse.json(
      { message: 'Facebook OAuth not configured' },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'email,public_profile',
    response_type: 'code',
    state: redirectUrl
  });

  const authUrl = `${facebookAuthUrl}?${params.toString()}`;
  
  return NextResponse.redirect(authUrl);
  */
} 