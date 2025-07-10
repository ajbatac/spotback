
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Library } from 'lucide-react';

export default function LoginPage() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = 'https://localhost:9002/api/auth/callback/spotify';
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
    ];
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code` +
      `&client_id=${clientId}` +
      `&scope=${scopes.join('%20')}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen w-full bg-background font-body text-foreground flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm w-full bg-background shadow-neumorphic rounded-lg">
          <Library size={64} className="text-primary mb-6" />
          <h1 className="text-3xl font-bold font-headline mb-2 text-foreground">Welcome to SpotBack</h1>
          <p className="text-muted-foreground mb-8">Export and backup your Spotify playlists with ease.</p>
          <Button onClick={handleLogin} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">
              <LogIn className="h-5 w-5 mr-3" />
              Login with Spotify
          </Button>
      </div>
    </div>
  );
}

    