'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

function LoginPage() {
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) {
          const config = await response.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
          throw new Error(config.error || `Server responded with status: ${response.status}`);
        }
        const config = await response.json();
        if (config.error) {
          throw new Error(config.error);
        }
        const { appUrl, clientId } = config;

        const scopes = [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-read-collaborative',
          'user-top-read',
        ].join(' ');

        const constructedRedirectUri = `${appUrl}/api/auth/callback/spotify`;
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('scope', scopes);
        authUrl.searchParams.append('redirect_uri', constructedRedirectUri);
        setSpotifyAuthUrl(authUrl.toString());
      } catch (e: any) {
        setConfigError(e.message || 'An unknown error occurred while fetching config.');
      }
    }
    fetchConfig();
  }, []);

  if (configError) {
    return (
      <div>
        <h1>Configuration Error</h1>
        <p>Could not initialize the application:</p>
        <pre><code>{configError}</code></pre>
      </div>
    );
  }

  return (
    <div>
      <h1>SpotBack</h1>
      <p>Backup your Spotify playlists.</p>
      {spotifyAuthUrl ? (
        <a href={spotifyAuthUrl}>Login with Spotify</a>
      ) : (
        <p>Loading login link...</p>
      )}
    </div>
  );
}

function Dashboard() {
  const { accessToken, logout } = useAuth();
  // In the future, we will fetch and display Spotify data here.
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome! You are logged in.</p>
      <p>
        <strong>Access Token:</strong> <code style={{ wordBreak: 'break-all' }}>{accessToken}</code>
      </p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}


function HomePageContent() {
  const { accessToken, setToken } = useAuth();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('access_token');
  const errorFromUrl = searchParams.get('error');
  const [error, setError] = useState('');

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Clean the URL
      window.history.replaceState({}, document.title, "/");
    } else if (errorFromUrl) {
      setError(errorFromUrl);
       // Clean the URL
      window.history.replaceState({}, document.title, "/");
    }
  }, [tokenFromUrl, errorFromUrl, setToken]);

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
  
  return accessToken ? <Dashboard /> : <LoginPage />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}