
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:9002';
  const rootUrl = new URL('/', appUrl);

  if (error) {
    rootUrl.searchParams.set('error', error);
    return NextResponse.redirect(rootUrl);
  }

  if (!code) {
    rootUrl.searchParams.set('error', 'Code not found in callback');
    return NextResponse.redirect(rootUrl);
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/callback/spotify`;

  if (!clientId || !clientSecret) {
    rootUrl.searchParams.set('error', 'Spotify credentials are not set in environment variables');
    return NextResponse.redirect(rootUrl);
  }

  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: requestBody,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
       const errorDescription = responseData.error_description || 'Failed to fetch access token';
       rootUrl.searchParams.set('error', errorDescription);
       return NextResponse.redirect(rootUrl);
    } 

    const accessToken = responseData.access_token;
    rootUrl.searchParams.set('access_token', accessToken);
    
    return NextResponse.redirect(rootUrl);

  } catch (e: any) {
    rootUrl.searchParams.set('error', e.message || 'An unknown error occurred');
    return NextResponse.redirect(rootUrl);
  }
}
