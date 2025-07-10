
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(`Error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse('Code not found in query parameters', { status: 400 });
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = 'http://localhost:9002/api/auth/callback/spotify';

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
    
    // In a real app, you would not pass the token in the URL.
    // You would set a secure, HTTP-only cookie or use another session mechanism.
    // For this demo, we'll redirect and the client will store it in localStorage.
    const redirectUrl = new URL('/', req.nextUrl.origin);
    
    // This script will run on the client, save the token, and then reload.
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body>
        <script>
          window.localStorage.setItem('spotify-token', '${accessToken}');
          window.location.href = '${redirectUrl.toString()}';
        </script>
        <p>Authenticating with Spotify, please wait...</p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (e: any) {
    console.error(e);
    return new NextResponse(`Internal Server Error: ${e.message}`, { status: 500 });
  }
}
