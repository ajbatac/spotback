
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Spotify callback error:', error);
    const errorRedirectUrl = new URL('/login', req.nextUrl.origin);
    errorRedirectUrl.searchParams.set('error', 'access_denied');
    return NextResponse.redirect(errorRedirectUrl);
  }

  if (!code) {
    console.error('Spotify callback: code not found');
    const errorRedirectUrl = new URL('/login', req.nextUrl.origin);
    errorRedirectUrl.searchParams.set('error', 'missing_code');
    return NextResponse.redirect(errorRedirectUrl);
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = 'https://localhost:9002/api/auth/callback/spotify';

  if (!clientId || !clientSecret) {
      throw new Error('Spotify client ID or secret is not configured in environment variables.');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Spotify token exchange error:', errorData);
        throw new Error(errorData.error_description || 'Failed to fetch access token');
    }

    const data = await response.json();
    const accessToken = data.access_token;
    
    // Redirect to the main page. A script on that page will store the token.
    const successRedirectUrl = new URL('/', req.nextUrl.origin);
    
    // We pass the token in a hash fragment. The client-side code will pick it up
    // from there, store it, and clean the URL. This is more secure than query params.
    successRedirectUrl.hash = `access_token=${accessToken}`;

    return NextResponse.redirect(successRedirectUrl);

  } catch (e: any) {
    console.error('Internal server error during Spotify auth:', e.message);
    const errorRedirectUrl = new URL('/login', req.nextUrl.origin);
    errorRedirectUrl.searchParams.set('error', 'internal_error');
    return NextResponse.redirect(errorRedirectUrl);
  }
}
    