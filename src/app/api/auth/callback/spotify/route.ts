
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
  const redirectUri = 'http://127.0.0.1:9002/api/auth/callback/spotify';

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
    const redirectURL = new URL('/', req.url);
    redirectURL.searchParams.set('access_token', accessToken);
    
    return NextResponse.redirect(redirectURL);

  } catch (e: any) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(e.message)}`, req.url));
  }
}
