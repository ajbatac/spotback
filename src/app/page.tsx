"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Library, ListMusic, Download, Loader2, FileDown, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from '@/hooks/use-local-storage';
import { CredentialsDialog } from '@/components/credentials-dialog';
import { PlaylistCard } from '@/components/playlist-card';
import { getPlaylistsForUser, getPlaylistWithAllTracks, getAccessToken } from '@/lib/spotify';
import type { SpotifyPlaylist, SpotifyTrack } from '@/types/spotify';

export default function Home() {
  const [credentials, setCredentials] = useLocalStorage<{ clientId: string; clientSecret: string; userId: string } | null>('spotback-credentials', null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const hasCredentials = useMemo(() => credentials && credentials.clientId && credentials.clientSecret && credentials.userId, [credentials]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!hasCredentials) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(false);
      fetchPlaylists();
    }
  }, [credentials, hasCredentials, isClient]);

  const fetchPlaylists = async () => {
    if (!credentials) return;
    setIsLoading(true);
    setError(null);
    setPlaylists([]);
    try {
      const token = await getAccessToken(credentials.clientId, credentials.clientSecret);
      const userPlaylists = await getPlaylistsForUser(credentials.userId, token);
      setPlaylists(userPlaylists);
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || "Failed to fetch playlists. Please check your credentials and User ID.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    if (selectedPlaylists.size === 0 || !credentials) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "No playlists selected for export.",
      });
      return;
    }

    setIsExporting(true);
    try {
      const token = await getAccessToken(credentials.clientId, credentials.clientSecret);
      const fullPlaylists = await Promise.all(
        Array.from(selectedPlaylists).map(id => getPlaylistWithAllTracks(id, token))
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
  
  const clearCredentials = () => {
    setCredentials(null);
    setPlaylists([]);
    setError(null);
    setSelectedPlaylists(new Set());
    setIsDialogOpen(true);
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
              <div className="flex items-center gap-2">
                {isClient && hasCredentials && (
                  <Button variant="outline" size="sm" onClick={clearCredentials} className="shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Change Credentials
                  </Button>
                )}
                <Button onClick={handleExport} disabled={selectedPlaylists.size === 0 || isExporting} className="shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200 bg-accent text-accent-foreground hover:bg-accent/90">
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Export ({selectedPlaylists.size})
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {!isClient || !hasCredentials ? (
             <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                <Library size={64} className="text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline mb-2">Welcome to SpotBack</h2>
                <p className="text-muted-foreground">Please provide your Spotify API credentials to begin.</p>
             </div>
          ) : isLoading ? (
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
              <p>We couldn't find any playlists for this User ID.</p>
              <Button onClick={fetchPlaylists} variant="outline" className="mt-6 shadow-neumorphic-sm hover:shadow-neumorphic-inset-sm">
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
          )}
        </main>
      </div>
      <CredentialsDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSave={setCredentials}
      />
    </>
  );
}
