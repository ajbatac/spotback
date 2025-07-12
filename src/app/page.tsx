
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// This is now a CLIENT component that receives the appUrl as a prop.
function HomePageContent({ appUrl }: { appUrl?: string }) {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const error = searchParams.get('error');

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  // If the app url isn't set (passed from the server component), we must show an error.
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


// This is the main export, a SERVER component that wraps the client component.
export default function Home() {
    // We can safely read the environment variable here on the server.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // We wrap the client component in Suspense to allow it to read search params.
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomePageContent appUrl={appUrl} />
        </Suspense>
    );
}
