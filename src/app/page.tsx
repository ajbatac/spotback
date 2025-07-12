
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, KeyRound } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

function LoginPage() {
  const { credentials } = useAuth();
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');
  const [configError, setConfigError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setupAuthUrl() {
      if (!credentials) {
          setIsReady(true);
          return;
      }
      try {
        const { clientId, clientSecret } = credentials;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
          throw new Error("Application URL is not configured. The NEXT_PUBLIC_APP_URL environment variable is missing.");
        }

        if (!clientId || !clientSecret) {
          throw new Error("Missing required Spotify keys. Please enter your credentials.");
        }

        const scopes = [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-read-collaborative',
          'user-top-read',
        ].join(' ');

        const callbackUrl = new URL('/api/auth/callback/spotify', appUrl);
        const constructedRedirectUri = callbackUrl.toString();

        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('scope', scopes);
        authUrl.searchParams.append('redirect_uri', constructedRedirectUri);
        authUrl.searchParams.append('show_dialog', 'true');
        
        // Encode the credentials in base64 to pass them through the state parameter
        const state = btoa(JSON.stringify({ clientId, clientSecret }));
        authUrl.searchParams.append('state', state);

        setSpotifyAuthUrl(authUrl.toString());
      } catch (e: any) {
        setConfigError(e.message || 'An unknown error occurred while preparing the login URL.');
      } finally {
        setIsReady(true);
      }
    }

    setupAuthUrl();
  }, [credentials]);

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

          {!isReady ? (
             <Button size="lg" disabled>
              Loading...
            </Button>
          ) : configError ? (
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
              <p className="font-bold">Configuration Error</p>
              <p>{configError}</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 w-full sm:w-auto">
                {credentials && spotifyAuthUrl ? (
                    <Button size="lg" asChild>
                      <a href={spotifyAuthUrl}>
                        <LogIn className="mr-2 h-5 w-5" />
                        Login with Spotify
                      </a>
                    </Button>
                ) : (
                    <Button size="lg" asChild>
                        <Link href="/credentials">
                            <KeyRound className="mr-2 h-5 w-5" />
                            Start by Entering Your API Keys
                        </Link>
                    </Button>
                )}
            </div>
          )}

          <div className="pt-8 text-left w-full">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-3">Why SpotBack?</h2>
              <p className="text-muted-foreground">
                Losing your Spotify playlists can feel like losing a piece of your personality. Whether your account gets hacked, your phone crashes, or you just switch devices, SpotBack makes sure your music stays with you.
              </p>
              <p className="text-muted-foreground mt-2">
                It’s the simple way to backup your playlists so you never lose the songs that matter most.
              </p>
            </div>
          </div>
          
          <div className="pt-2 text-left w-full">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-3">Why do I need to use my own API Keys?</h2>
              <p className="text-muted-foreground">
                Spotify requires every app, even for personal use, to have a registered developer application. While you can use SpotBack as an individual, you’ll need to create your own free Spotify Developer account and generate your own client ID and secret key.
              </p>
              <p className="text-muted-foreground mt-2">
                This helps ensure security, compliance, and gives you full control over your data and access. {' '}
                <Link href="/credentials" className="font-medium text-primary hover:underline">
                    Follow the instructions here to get started.
                </Link>
              </p>
            </div>
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
  const errorFromUrl = searchParams.get('error');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, "/");
    } else if (errorFromUrl) {
      setError(errorFromUrl);
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
