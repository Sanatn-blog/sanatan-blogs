// TEMPORARILY DISABLED: Social OAuth Providers
// This endpoint is commented out for maintenance/development purposes

import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const socialConfigs = {
//   google: {
//     authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
//     scope: 'openid email profile',
//     additionalParams: {
//       access_type: 'offline',
//       prompt: 'consent'
//     }
//   },
//   facebook: {
//     authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
//     scope: 'email,public_profile',
//     additionalParams: {}
//   },
//   instagram: {
//     authUrl: 'https://api.instagram.com/oauth/authorize',
//     scope: 'user_profile,user_media',
//     additionalParams: {}
//   },
//   twitter: {
//     authUrl: 'https://twitter.com/i/oauth2/authorize',
//     scope: 'tweet.read users.read offline.access',
//     additionalParams: {
//       code_challenge: 'challenge',
//       code_challenge_method: 'plain'
//     }
//   }
// };

export async function GET() {
  // Social OAuth providers temporarily disabled
  return NextResponse.json(
    { message: 'Social OAuth providers are temporarily disabled' },
    { status: 501 }
  );

  /* ORIGINAL CODE - COMMENTED OUT
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  if (!socialConfigs[provider as keyof typeof socialConfigs]) {
    return NextResponse.json(
      { message: 'Unsupported provider' },
      { status: 400 }
    );
  }

  const config = socialConfigs[provider as keyof typeof socialConfigs];
  const clientIdEnvVar = `${provider.toUpperCase()}_CLIENT_ID`;
  const clientId = process.env[clientIdEnvVar];
  
  if (!clientId) {
    return NextResponse.json(
      { message: `${provider} OAuth not configured` },
      { status: 500 }
    );
  }

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/social/${provider}/callback`;

  const params_obj = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: redirectUrl,
    ...config.additionalParams
  };

  const authParams = new URLSearchParams(params_obj);
  const authUrl = `${config.authUrl}?${authParams.toString()}`;
  
  return NextResponse.redirect(authUrl);
  */
} 