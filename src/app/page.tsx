'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListMusic, FileArchive } from 'lucide-react';
import Image from 'next/image';

const handleLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:9002';
  const redirectUri = `${appUrl}/api/auth/callback/spotify`;
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-top-read',
  ].join(' ');

  if (!clientId) {
    console.error("Spotify Client ID is not set in environment variables.");
    // In a real app, you'd want to show a user-friendly error here
    return;
  }

  const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
  spotifyAuthUrl.searchParams.append('response_type', 'code');
  spotifyAuthUrl.searchParams.append('client_id', clientId);
  spotifyAuthUrl.searchParams.append('scope', scopes);
  spotifyAuthUrl.searchParams.append('redirect_uri', redirectUri);
  
  window.location.href = spotifyAuthUrl.toString();
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/spotify.png" alt="SpotBack Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">SpotBack</h1>
        </div>
        <Button onClick={handleLogin}>Login with Spotify</Button>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Never Lose a Playlist Again
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SpotBack allows you to securely back up your Spotify playlists. Export them in various formats, keep your music safe, and take control of your data.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <Button size="lg" className="w-full" onClick={handleLogin}>
                    Login with Spotify to Get Started
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    We use your Spotify account only to read your playlists. We never store your data.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="https://placehold.co/600x400.png"
                  data-ai-hint="music abstract"
                  width="600"
                  height="400"
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Music, Your Data</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SpotBack provides all the tools you need to create secure, accessible backups of your musical world.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              <Card>
                <CardHeader>
                  <ListMusic className="h-8 w-8 mb-2" />
                  <CardTitle>Comprehensive Backups</CardTitle>
                  <CardDescription>
                    Select any or all of your playlists for backup. SpotBack fetches the complete tracklist, including song titles, artists, and albums.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <FileArchive className="h-8 w-8 mb-2" />
                  <CardTitle>Multiple Export Formats</CardTitle>
                  <CardDescription>
                    Export your playlists as simple CSV files, structured JSON, or a convenient ZIP archive containing all selected playlists.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 SpotBack. All rights reserved.</p>
      </footer>
    </div>
  );
}
