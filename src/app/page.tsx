'use client';

import React from 'react';

// This component now renders a minimal page to demonstrate the Spotify auth flow.
export default function Home() {
  // These values MUST be set in your .env file for the authentication to work.
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // If the app url isn't set, we must show an error.
  if (!appUrl) {
    return (
      <div>
        <h1>Error: App URL is not configured.</h1>
        <p>
          Please make sure the <code>NEXT_PUBLIC_APP_URL</code> environment variable is set.
        </p>
      </div>
    );
  }
  
  // This is the specific callback endpoint that will handle the response from Spotify.
  // It MUST be added to your Spotify application's "Redirect URIs" in the Spotify Developer Dashboard.
  const redirectUri = `${appUrl}/api/auth/callback/spotify`;

  // These are the permissions we are requesting from the user.
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-top-read',
  ].join(' ');

  // We construct the full authorization URL.
  const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
  
  if (clientId) {
    spotifyAuthUrl.searchParams.append('response_type', 'code');
    spotifyAuthUrl.searchParams.append('client_id', clientId);
    spotifyAuthUrl.searchParams.append('scope', scopes);
    spotifyAuthUrl.searchParams.append('redirect_uri', redirectUri);
  }

  // If the client ID isn't set, we show an error message.
  if (!clientId) {
    return (
      <div>
        <h1>Error: Spotify Client ID is not configured.</h1>
        <p>
          Please make sure you have a <code>.env</code> file in the root of your project
          and that <code>NEXT_PUBLIC_SPOTIFY_CLIENT_ID</code> is set.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Spotify Barebones Login</h1>
      
      <hr />

      <h2>1. The Call We Will Make</h2>
      <p>
        When you click the link below, you will be sent to this URL to ask for your permission:
      </p>
      <p>
        <strong>URL to call:</strong>
      </p>
      <pre>
        <code>{spotifyAuthUrl.toString()}</code>
      </pre>

      <hr />

      <h2>2. The Return Callback URL</h2>
      <p>After you approve, Spotify will redirect you back to our server at this specific URL:</p>
      <p>
        <strong>Callback URL:</strong>
      </p>
      <pre>
        <code>{redirectUri}</code>
      </pre>
      <p><em>(You must add this exact URL to your allowed Redirect URIs in the Spotify Developer Dashboard)</em></p>
      
      <hr />

      <h2>3. Initiate Login</h2>
      <p>
        <a href={spotifyAuthUrl.toString()}>
          Login with Spotify
        </a>
      </p>
    </div>
  );
}
