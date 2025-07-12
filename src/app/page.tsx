'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function HomePageContent() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const error = searchParams.get('error');

  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config');
        
        // Check if the response is not OK (e.g., 500 error)
        if (!response.ok) {
          // Try to get a specific error message from the JSON body
          const config = await response.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
          throw new Error(config.error || `Server responded with status: ${response.status}`);
        }
        
        const config = await response.json();
        
        // This check is redundant if the above handles non-ok, but good for safety
        if (config.error) {
            throw new Error(config.error);
        }

        const { appUrl, clientId } = config;

        // This check is also mostly for safety, the API route should have validated this
        if (!appUrl || !clientId) {
            throw new Error('Required configuration (URL or Client ID) is missing from server response.');
        }

        const scopes = [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-read-collaborative',
          'user-top-read',
        ].join(' ');

        const constructedRedirectUri = `${appUrl}/api/auth/callback/spotify`;
        setRedirectUri(constructedRedirectUri);

        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('scope', scopes);
        authUrl.searchParams.append('redirect_uri', constructedRedirectUri);
        setSpotifyAuthUrl(authUrl.toString());

      } catch (e: any) {
        // Set the final error message to be displayed
        setConfigError(e.message || 'An unknown error occurred while fetching config.');
      }
    }

    fetchConfig();
  }, []);

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

  if (configError) {
      return (
          <div>
              <h1>Configuration Error</h1>
              <p>Could not initialize the application:</p>
              <pre><code>{configError}</code></pre>
          </div>
      )
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
        <code>{spotifyAuthUrl || 'Loading...'}</code>
      </pre>

      <hr />

      <h2>2. The Return Callback URL</h2>
      <p>After you approve, Spotify will redirect you back to our server at this specific URL:</p>
      <p>
        <strong>Callback URL:</strong>
      </p>
      <pre>
        <code>{redirectUri || 'Loading...'}</code>
      </pre>
      <p><em>(You must add this exact URL to your allowed Redirect URIs in the Spotify Developer Dashboard)</em></p>

      <hr />

      <h2>3. Initiate Login</h2>
      {spotifyAuthUrl ? (
        <p>
          <a href={spotifyAuthUrl}>
            Login with Spotify
          </a>
        </p>
      ) : (
        <p>Loading login link...</p>
      )}
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
