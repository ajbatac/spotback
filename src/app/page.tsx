
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';

function LoginPage() {
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

      if (!appUrl || !clientId) {
        throw new Error("Missing required configuration. Please check that NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_SPOTIFY_CLIENT_ID are set in your environment.");
      }

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
      setConfigError(e.message || 'An unknown error occurred while preparing the login URL.');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center p-8 text-center pt-10">
        <div className="flex flex-col items-center space-y-6 max-w-lg mx-auto">
          <Image
            src="/spotify.png"
            alt="SpotBack Logo"
            width={64}
            height={64}
            data-ai-hint="logo"
          />
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

          <div className="pt-8 text-left border-t border-gray-200 mt-8">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-3">Why SpotBack?</h2>
            <p className="text-muted-foreground">
              Losing your Spotify playlists can feel like losing a piece of your personality. Whether your account gets hacked, your phone crashes, or you just switch devices, SpotBack makes sure your music stays with you.
            </p>
            <p className="text-muted-foreground mt-2">
              It’s the simple way to backup your playlists so you never lose the songs that matter most.
            </p>
          </div>
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
  const errorFromUrl = asearchParams.get('error');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This safely gates the rendering of components that depend on client-side state.
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
