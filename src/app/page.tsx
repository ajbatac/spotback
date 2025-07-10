
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getPlaylistsForUser, getUserProfile, getPlaylistWithAllTracks } from '@/lib/spotify';
import type { SpotifyPlaylist, SpotifyTrack, SpotifyUserProfile } from '@/types/spotify';
import { PlaylistCard } from '@/components/playlist-card';
import { Loader2, LogIn, LogOut, User, Download, FileJson, FileText, FileArchive } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import JSZip from 'jszip';

export default function Home() {
  const { token, setToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<SpotifyUserProfile | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<string | null>(null);
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
  }, [searchParams, token, setToken, router]);

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
        if (e.status === 401) {
          setError('Your session has expired. Please log in again.');
          setToken(null);
        } else if (e.status === 429) {
          setError("You've made too many requests to Spotify. Please wait a moment and try again.");
        } else {
          setError(e.message || 'An error occurred while fetching data from Spotify.');
        }
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, setToken]);
  
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:9002';
    const redirectUri = `${appUrl}/api/auth/callback/spotify`;
    const scopes = "user-read-private user-read-email playlist-read-private playlist-read-collaborative";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };
  
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setPlaylists([]);
    setSelectedPlaylists(new Set());
    setError(null);
    router.push('/');
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

  const handleSelectAll = () => {
    if(selectedPlaylists.size === playlists.length) {
      setSelectedPlaylists(new Set());
    } else {
      setSelectedPlaylists(new Set(playlists.map(p => p.id)));
    }
  }

  const selectedCount = useMemo(() => selectedPlaylists.size, [selectedPlaylists]);
  const allSelected = useMemo(() => selectedCount > 0 && selectedCount === playlists.length, [selectedCount, playlists.length]);

  const fetchFullPlaylists = async (exportType: string): Promise<SpotifyPlaylist[]> => {
    if (!token) throw new Error("Authentication token is not available.");
    setIsExporting(exportType);
    try {
      const selectedArr = Array.from(selectedPlaylists);
      const fullPlaylists = await Promise.all(
        selectedArr.map(id => getPlaylistWithAllTracks(id, token))
      );
      return fullPlaylists;
    } finally {
      setIsExporting(null);
    }
  }

  const handleExport = async (format: 'json' | 'csv' | 'zip' | 'official-json') => {
    try {
      setError(null);
      const fullPlaylistsData = await fetchFullPlaylists(format);

      if (format === 'official-json') {
          const dataStr = JSON.stringify({ playlists: fullPlaylistsData }, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          triggerDownload(blob, "spotback_official_playlists.json");
          return;
      }
      
      if (format === 'json') {
        const simplifiedData = fullPlaylistsData.map(p => ({
            name: p.name,
            description: p.description,
            owner: p.owner.display_name,
            tracks: p.tracks.items?.map(item => item.track ? ({
                name: item.track.name,
                artists: item.track.artists.map(a => a.name).join(', '),
                album: item.track.album.name
            }) : null).filter(Boolean)
        }));
        const dataStr = JSON.stringify(simplifiedData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        triggerDownload(blob, "spotback_playlists.json");
      } else if (format === 'csv') {
        const csvContent = convertToCsv(fullPlaylistsData);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        triggerDownload(blob, "spotback_playlists.csv");
      } else if (format === 'zip') {
        const zip = new JSZip();
        fullPlaylistsData.forEach(playlist => {
          const csvContent = convertToCsv([playlist]);
          const safeName = playlist.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          zip.file(`${safeName}.csv`, csvContent);
        });
        const zipBlob = await zip.generateAsync({ type: "blob" });
        triggerDownload(zipBlob, "spotback_playlists.zip");
      }
    } catch (e: any) {
      if (e.status === 429) {
        setError("You've made too many requests to Spotify. Please wait a moment before exporting.");
      } else {
        setError(e.message || "Failed to export playlists.");
      }
    }
  }
  
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const convertToCsv = (data: SpotifyPlaylist[]): string => {
    const rows = [["Playlist ID", "Playlist Name", "Track ID", "Track Name", "Artists", "Album"]];
    data.forEach(playlist => {
      playlist.tracks.items?.forEach(item => {
        if(item.track) {
          const { track } = item;
          rows.push([
            playlist.id,
            `"${playlist.name.replace(/"/g, '""')}"`,
            track.id,
            `"${track.name.replace(/"/g, '""')}"`,
            `"${track.artists.map(a => a.name).join(', ').replace(/"/g, '""')}"`,
            `"${track.album.name.replace(/"/g, '""')}"`,
          ]);
        }
      });
    });
    return rows.map(e => e.join(",")).join("\n");
  }


  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your library...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight font-headline mb-4">Backup Your Spotify Playlists</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Never lose your curated music collections again. With SPOTBACK, you can easily save your playlists in various formats, including CSV, JSON, and the official Spotify format for easy transfer.
        </p>
        {error && <p className="mb-4 text-destructive">{error}</p>}
        <Button size="lg" onClick={handleLogin}>
          <LogIn className="mr-2" /> Login with Spotify to Start
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
       <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold font-headline">SPOTBACK</h1>
              {user && <p className="text-muted-foreground flex items-center gap-2 mt-1"><User size={16}/> {user.display_name}</p>}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut /> Logout</Button>
          </div>
          <div className="flex items-center gap-2">
             <div className="text-sm text-muted-foreground text-right mr-2">
                <p>{selectedCount} playlist{selectedCount !== 1 ? 's' : ''} selected</p>
                <p>of {playlists.length} total</p>
             </div>
            <Button variant="outline" onClick={handleSelectAll}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-muted/50 rounded-lg">
            <Download className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="font-medium mr-2">Backup Options:</span>
            <Button size="sm" onClick={() => handleExport('csv')} disabled={selectedCount === 0 || !!isExporting}>
              {isExporting === 'csv' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText />}
              Export as CSV
            </Button>
            <Button size="sm" onClick={() => handleExport('zip')} disabled={selectedCount === 0 || !!isExporting}>
              {isExporting === 'zip' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileArchive />}
              Export as ZIP
            </Button>
            <Button size="sm" onClick={() => handleExport('json')} disabled={selectedCount === 0 || !!isExporting}>
              {isExporting === 'json' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileJson />}
              Export as JSON
            </Button>
             <Button size="sm" variant="secondary" onClick={() => handleExport('official-json')} disabled={selectedCount === 0 || !!isExporting}>
              {isExporting === 'official-json' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileJson />}
              Spotify API Format
            </Button>
        </div>

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

    