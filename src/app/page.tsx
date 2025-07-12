
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function HomePageContent() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const error = searchParams.get('error');

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl || !clientId) {
    return (
      <div>
        <h1>Error: Application is not configured correctly.</h1>
        <p>
          Please ensure <code>NEXT_PUBLIC_APP_URL</code> and <code>NEXT_PUBLIC_SPOTIFY_CLIENT_ID</code> are set.
        </p>
      </div>
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback/spotify`;
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-top-read',
  ].join(' ');

  const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
  spotifyAuthUrl.searchParams.append('response_type', 'code');
  spotifyAuthUrl.searchParams.append('client_id', clientId);
  spotifyAuthUrl.searchParams.append('scope', scopes);
  spotifyAuthUrl.searchParams.append('redirect_uri', redirectUri);

  if (accessToken) {
    return (
      <div>
        <h1>Login Successful!</h1>
        <p>Your Spotify Access Token is:</p>
        <pre><code style={{wordBreak: 'break-all'}}>{accessToken}</code></pre>
        <hr />
        <a href="/">Start Over</a>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Login Failed</h1>
        <p>Spotify returned an error:</p>
        <pre><code>{error}</code></pre>
        <hr />
        <a href="/">Try Again</a>
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

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomePageContent />
        </Suspense>
    );
}
