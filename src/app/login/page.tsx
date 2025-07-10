
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Library } from 'lucide-react';

export default function LoginPage() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    // This MUST exactly match the URI registered in your Spotify Developer Dashboard.
    const redirectUri = 'http://127.0.0.1:9002/api/auth/callback/spotify';
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
    ];
    
    // Construct the URL ensuring all parts are correct.
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId || '',
        scope: scopes.join(' '),
        redirect_uri: redirectUri,
    });

    const generatedAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
    setAuthUrl(generatedAuthUrl);
    
    // Redirect immediately
    window.location.href = generatedAuthUrl;
  };

  return (
    <div className="min-h-screen w-full bg-background font-body text-foreground flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center p-8 max-w-2xl w-full bg-background shadow-neumorphic rounded-lg">
          <Library size={64} className="text-primary mb-6" />
          <h1 className="text-3xl font-bold font-headline mb-2 text-foreground">Welcome to SpotBack</h1>
          <p className="text-muted-foreground mb-8">Export and backup your Spotify playlists with ease.</p>
          <Button onClick={handleLogin} disabled={!!authUrl} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">
              <LogIn className="h-5 w-5 mr-3" />
              {authUrl ? 'Redirecting...' : 'Login with Spotify'}
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-muted rounded-md text-left w-full">
              <h2 className="text-lg font-bold mb-2">Debug Information</h2>
              <p className="font-semibold">NEXT_PUBLIC_SPOTIFY_CLIENT_ID:</p>
              <pre className="text-xs bg-gray-800 text-white p-2 rounded-md break-words whitespace-pre-wrap">
                <code>{process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'Not Found!'}</code>
              </pre>
              <p className="font-semibold mt-2">Generated Authorization URL:</p>
              <pre className="text-xs bg-gray-800 text-white p-2 rounded-md break-words whitespace-pre-wrap">
                <code>{authUrl ? authUrl : 'Click button to generate...'}</code>
              </pre>
              {authUrl && <p className="mt-2 text-sm text-muted-foreground">Redirecting...</p>}
            </div>
          )}
      </div>
    </div>
  );
}
