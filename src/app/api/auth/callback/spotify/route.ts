import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  // This check MUST happen first. If appUrl is not set, we cannot construct
  // the rootUrl to redirect to. This is a critical server configuration error.
  if (!appUrl) {
    // In this specific and critical case, we cannot redirect. We return a
    // plain text error because the app's base URL is unknown.
    return new Response(
      'FATAL_ERROR: App URL is not configured. Please set NEXT_PUBLIC_APP_URL in your environment variables.',
      { status: 500 }
    );
  }

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
  
  // Use the canonical NEXT_PUBLIC_APP_URL to construct the redirect URI.
  // This must exactly match what is in the Spotify Developer Dashboard.
  const redirectUri = `${appUrl}/api/auth/callback/spotify`;

  if (!clientId || !clientSecret) {
    const error_msg = "Server misconfiguration: Spotify credentials not set. Check server environment variables.";
    rootUrl.searchParams.set('error', error_msg);
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
       const errorDescription = responseData.error_description || 'Failed to fetch access token from Spotify. Please ensure the Redirect URI in your Spotify Dashboard is set correctly.';
       rootUrl.searchParams.set('error', errorDescription);
       return NextResponse.redirect(rootUrl);
    } 

    const accessToken = responseData.access_token;
    rootUrl.searchParams.set('access_token', accessToken);
    
    return NextResponse.redirect(rootUrl);

  } catch (e: any) {
    // This catch block will now handle the "Unexpected token '<'" error if Spotify returns HTML
    const errorMessage = e.message.includes("JSON") 
      ? "Error communicating with Spotify. They returned an unexpected response. Please double-check that your Redirect URI is correctly configured in the Spotify Developer Dashboard."
      : (e.message || 'An unknown error occurred during token exchange');
    rootUrl.searchParams.set('error', errorMessage);
    return NextResponse.redirect(rootUrl);
  }
}
