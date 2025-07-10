
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=Code not found', req.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:9002';
  const redirectUri = `${appUrl}/api/auth/callback/spotify`;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials are not set in the environment variables.');
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
       return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorDescription)}`, req.url));
    } 

    const accessToken = responseData.access_token;
    // Redirect to the root of the app URL
    const redirectURL = new URL('/', appUrl);
    redirectURL.searchParams.set('access_token', accessToken);
    
    return NextResponse.redirect(redirectURL);

  } catch (e: any) {
    // Redirect to the root of the app URL with an error
    const errorURL = new URL('/', appUrl);
    errorURL.searchParams.set('error', encodeURIComponent(e.message));
    return NextResponse.redirect(errorURL);
  }
}
