
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getPlaylistsForUser, getUserProfile } from '@/lib/spotify';
import type { SpotifyPlaylist, SpotifyUserProfile } from '@/types/spotify';
import { PlaylistCard } from '@/components/playlist-card';
import { Loader2, LogIn, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const { token, setToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<SpotifyUserProfile | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      setToken(null);
      router.replace('/');
    } else if (accessToken && !token) {
      setToken(accessToken);
      router.replace('/');
    }
  }, [searchParams, token, setToken, router, setError]);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const userProfile = await getUserProfile(token);
        setUser(userProfile);
        const userPlaylists = await getPlaylistsForUser(userProfile.id, token);
        setPlaylists(userPlaylists);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'An error occurred while fetching data from Spotify.');
        if (e.status === 401) {
          setError('Your session has expired. Please log in again.');
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, setToken]);
  
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:9002';
    const redirectUri = `${appUrl}/api/auth/callback/spotify`;
    const scopes = "user-read-private user-read-email playlist-read-private playlist-read-collaborative";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  const handleSelectionChange = (id: string) => {
    setSelectedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectedCount = useMemo(() => selectedPlaylists.size, [selectedPlaylists]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading playlists...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-bold font-headline mb-2">Welcome to Playlist Organizer</h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-md">Please log in with your Spotify account to view and organize your playlists.</p>
        {error && <p className="mb-4 text-destructive">{error}</p>}
        <Button size="lg" onClick={handleLogin}>
          <LogIn className="mr-2" /> Login with Spotify
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
       <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold font-headline">Your Playlists</h1>
            {user && <p className="text-muted-foreground flex items-center gap-2 mt-1"><User size={16}/> {user.display_name} ({user.id})</p>}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">{selectedCount} playlist{selectedCount !== 1 ? 's' : ''} selected</p>
            <Button disabled={selectedCount === 0}>
                Organize Selected
            </Button>
          </div>
        </header>

      {error && <p className="mb-4 text-destructive bg-destructive/10 p-4 rounded-md">{error}</p>}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {playlists.map(p => (
          <PlaylistCard 
            key={p.id}
            playlist={p}
            isSelected={selectedPlaylists.has(p.id)}
            onSelectionChange={handleSelectionChange}
          />
        ))}
      </div>
    </main>
  );
}
