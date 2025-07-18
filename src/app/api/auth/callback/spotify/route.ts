
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
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
  
  let clientId: string | undefined;
  let clientSecret: string | undefined;

  // Credentials must be passed from the client via the state parameter.
  if (state) {
    try {
      // Use Buffer.from for server-side base64 decoding, as atob is not available in Node.js
      const decodedStateString = Buffer.from(state, 'base64').toString('ascii');
      const decodedState = JSON.parse(decodedStateString);
      if (decodedState.clientId && decodedState.clientSecret) {
        clientId = decodedState.clientId;
        clientSecret = decodedState.clientSecret;
      }
    } catch (e) {
        const error_msg = "Could not parse credentials from state. Please try logging in again.";
        rootUrl.searchParams.set('error', error_msg);
        return NextResponse.redirect(rootUrl);
    }
  }
  
  const callbackUrl = new URL('/api/auth/callback/spotify', appUrl);
  const redirectUri = callbackUrl.toString();

  if (!clientId || !clientSecret) {
    const error_msg = "Missing Spotify credentials. The application now requires you to provide your own API keys.";
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
    const errorMessage = e.message.includes("JSON") 
      ? "Error communicating with Spotify. They returned an unexpected response. Please double-check that your Redirect URI is correctly configured in the Spotify Developer Dashboard."
      : (e.message || 'An unknown error occurred during token exchange');
    rootUrl.searchParams.set('error', errorMessage);
    return NextResponse.redirect(rootUrl);
  }
}
