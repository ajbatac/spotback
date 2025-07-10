
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Library, ListMusic, Download, Loader2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from '@/hooks/use-local-storage';
import { PlaylistCard } from '@/components/playlist-card';
import { getPlaylistsForUser, getPlaylistWithAllTracks, getUserProfile } from '@/lib/spotify';
import type { SpotifyPlaylist, SpotifyTrack, SpotifyUserProfile } from '@/types/spotify';
import { organizePlaylistMetadata } from '@/ai/flows/organize-playlist-metadata';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAuth();
  const [user, setUser] = useLocalStorage<SpotifyUserProfile | null>('spotify-user', null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    // The AuthProvider will handle the redirect
  }, [setAccessToken, setUser]);

  const fetchPlaylists = useCallback(async () => {
    if (!accessToken || !user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const userPlaylists = await getPlaylistsForUser(user.id, accessToken);
      setPlaylists(userPlaylists);
    } catch (e: any) {
      console.error(e);
      let errorMessage = "Failed to fetch playlists. Your session might have expired.";
      if (e.status === 401) {
        handleLogout();
        errorMessage += " Please log in again.";
      }
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, user?.id, toast, handleLogout]);

  useEffect(() => {
    if (accessToken && !user) {
      const fetchUser = async () => {
        try {
          const profile = await getUserProfile(accessToken);
          setUser(profile);
        } catch (e) {
          console.error("Failed to fetch user profile", e);
          handleLogout();
        }
      };
      fetchUser();
    }
  }, [accessToken, user, setUser, handleLogout]);
  
  useEffect(() => {
    if(user?.id) {
        fetchPlaylists();
    } else if (accessToken) {
        setIsLoading(true); // We have a token, but no user yet, so we are loading user data
    } else {
        setIsLoading(false); // No token, no user, not loading. AuthProvider will redirect.
    }
  }, [user, accessToken, fetchPlaylists]);

  const handleSelectionChange = (playlistId: string) => {
    setSelectedPlaylists(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(playlistId)) {
        newSelection.delete(playlistId);
      } else {
        newSelection.add(playlistId);
      }
      return newSelection;
    });
  };

  const handleExport = async () => {
    if (!accessToken || selectedPlaylists.size === 0) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: !accessToken ? "You are not logged in." : "No playlists selected for export.",
      });
      return;
    }

    setIsExporting(true);
    try {
      const fullPlaylists = await Promise.all(
        Array.from(selectedPlaylists).map(id => getPlaylistWithAllTracks(id, accessToken))
      );

      const metadataString = fullPlaylists.map(p => 
        `Playlist: ${p.name}\nDescription: ${p.description}\nTracks:\n` +
        p.tracks.items.map((trackItem: { track: SpotifyTrack }) => `- ${trackItem.track.name} by ${trackItem.track.artists.map(a => a.name).join(', ')}`).join('\n')
      ).join('\n\n');

      const { organizedMetadata } = await organizePlaylistMetadata({ metadata: metadataString });
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        organizedSummary: organizedMetadata,
        playlists: fullPlaylists.map(p => ({
          ...p,
          tracks: p.tracks.items,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spotback_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${selectedPlaylists.size} playlist(s) have been exported.`,
      });
      setSelectedPlaylists(new Set());
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred during export.",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!accessToken) {
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full bg-background font-body text-foreground transition-colors duration-300">
        <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-3">
                <Library className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">SpotBack</h1>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.display_name}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                    <Button onClick={handleExport} disabled={selectedPlaylists.size === 0 || isExporting} className="shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200 bg-accent text-accent-foreground hover:bg-accent/90">
                      {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                      Export ({selectedPlaylists.size})
                    </Button>
                  </>
                ) : (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                 <div key={i} className="rounded-lg bg-background p-4 shadow-neumorphic animate-pulse">
                    <div className="aspect-square w-full rounded-md bg-muted mb-4"></div>
                    <div className="h-4 w-3/4 rounded bg-muted mb-2"></div>
                    <div className="h-3 w-1/2 rounded bg-muted"></div>
                 </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center h-[60vh] text-destructive">
                <AlertCircle size={48} className="mb-4" />
                <h2 className="text-2xl font-bold font-headline mb-2">An Error Occurred</h2>
                <p className="max-w-md">{error}</p>
                <Button onClick={fetchPlaylists} variant="destructive" className="mt-6">
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {playlists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  isSelected={selectedPlaylists.has(playlist.id)}
                  onSelectionChange={() => handleSelectionChange(playlist.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-[60vh] text-muted-foreground">
              <ListMusic size={48} className="mb-4" />
              <h2 className="text-2xl font-bold font-headline mb-2">No Playlists Found</h2>
              <p>We couldn't find any playlists for your account.</p>
              <Button onClick={fetchPlaylists} variant="outline" className="mt-6 shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm">
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
