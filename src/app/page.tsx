
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Music, LogIn } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';

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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center p-8 text-center pt-24 sm:pt-32">
        <div className="flex flex-col items-center space-y-6 max-w-lg mx-auto">
          <div className="bg-primary/20 p-4 rounded-full">
            <Music className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-800">
            Spot<span className="text-primary">Back</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your go-to Spotify helper. Backup your playlists and music memories fast — like, literally 3 clicks and you're done.
          </p>

          {configError ? (
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
              <p className="font-bold">Configuration Error</p>
              <p>{configError}</p>
            </div>
          ) : spotifyAuthUrl ? (
            <Button size="lg" asChild>
              <a href={spotifyAuthUrl}>
                <LogIn className="mr-2 h-5 w-5" />
                Login with Spotify
              </a>
            </Button>
          ) : (
            <Button size="lg" disabled>
              Loading...
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HomePageContent() {
  const { accessToken, setToken } = useAuth();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('access_token');
  const errorFromUrl = searchParams.get('error');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
      <div className="flex min-h-screen flex-col items-center justify-center text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Login Failed</h1>
        <p className="text-muted-foreground mt-2">Spotify returned an error:</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm text-left"><code>{error}</code></pre>
        <Button asChild variant="link" className="mt-4">
          <a href="/">Try Again</a>
        </Button>
      </div>
    );
  }
  
  if (!isClient) {
    // Render nothing on the server and initial client render to avoid hydration mismatch
    return null;
  }
  
  return accessToken ? <Dashboard /> : <LoginPage />;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
