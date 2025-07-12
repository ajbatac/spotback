'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getPlaylists, getUserProfile } from '@/lib/spotify';
import type { SpotifyPlaylist } from '@/lib/spotify';
import { Header } from '@/components/Header';
import { PlaylistCard } from '@/components/PlaylistCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Info,
  PlusCircle,
  Save,
  FileJson2,
  FileCode2,
  FileText,
} from 'lucide-react';
import fileDownload from 'js-file-download';
import { Footer } from './Footer';
import { jsonToXml } from '@/lib/utils';

export function Dashboard() {
  const { accessToken, setUser } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupComplete, setBackupComplete] = useState(false);
  const [backedUpPlaylists, setBackedUpPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        // Fetch user profile and playlists in parallel
        const [userProfile, userPlaylists] = await Promise.all([
          getUserProfile(accessToken),
          getPlaylists(accessToken),
        ]);
        
        setUser(userProfile);
        setPlaylists(userPlaylists);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch data from Spotify.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, setUser]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allPlaylistIds = new Set(playlists.map(p => p.id));
      setSelectedPlaylists(allPlaylistIds);
    } else {
      setSelectedPlaylists(new Set());
    }
  };

  const handleSelectPlaylist = (playlistId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedPlaylists);
    if (isSelected) {
      newSelection.add(playlistId);
    } else {
      newSelection.delete(playlistId);
    }
    setSelectedPlaylists(newSelection);
  };
  
  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupComplete(false);
    const playlistsToBackup = playlists.filter(p => selectedPlaylists.has(p.id));
    setBackedUpPlaylists(playlistsToBackup);

    // Simulate a network request for the backup process
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupComplete(true);
    }, 1500);
  };

  const handleDownload = (format: 'json' | 'xml' | 'txt') => {
    const timestamp = new Date().toISOString();
    if (format === 'json') {
      const dataToDownload = JSON.stringify(backedUpPlaylists, null, 2);
      fileDownload(dataToDownload, `spotify_backup_${timestamp}.json`);
    } else if (format === 'xml') {
      const xmlData = jsonToXml({ playlist: backedUpPlaylists });
      fileDownload(xmlData, `spotify_backup_${timestamp}.xml`);
    } else if (format === 'txt') {
        const urls = backedUpPlaylists
            .map(p => p.external_urls.spotify)
            .join('\n');
        fileDownload(urls, `spotify_playlist_links_${timestamp}.txt`);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading your playlists...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="select-all" 
                onCheckedChange={handleSelectAll}
                checked={playlists.length > 0 && (selectedPlaylists.size === playlists.length ? true : selectedPlaylists.size === 0 ? false : 'indeterminate')}
              />
              <Label htmlFor="select-all" className="text-lg font-medium">
                Select All Playlists
              </Label>
            </div>
             <p className="text-muted-foreground mt-1">{selectedPlaylists.size} of {playlists.length} selected</p>
          </div>
          {selectedPlaylists.size > 0 && !backupComplete && (
            <Button onClick={handleBackup} disabled={isBackingUp} size="lg">
              {isBackingUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Backing up now...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {`Backup ${selectedPlaylists.size} Playlist(s) Now`}
                </>
              )}
            </Button>
          )}
        </div>

        {backupComplete && (
           <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg mb-8 shadow-md text-center">
             <h2 className="text-2xl font-semibold text-primary mb-3">Backup Complete!</h2>
             <p className="text-muted-foreground mb-4">Your selected playlists have been prepared for download.</p>
             <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={() => handleDownload('json')} className="transition-all hover:bg-accent/80">
                <FileJson2 className="mr-2 h-4 w-4" />
                Download as .JSON
              </Button>
              <Button variant="outline" onClick={() => handleDownload('xml')} className="transition-all hover:bg-accent/80">
                <FileCode2 className="mr-2 h-4 w-4" />
                Download as .XML
              </Button>
              <Button variant="outline" onClick={() => handleDownload('txt')} className="transition-all hover:bg-accent/80">
                <FileText className="mr-2 h-4 w-4" />
                Download as .TXT (Links)
              </Button>
             </div>
             
             <div className="mt-6 flex items-start gap-3 bg-background/50 p-4 rounded-md text-left">
                <Info className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-primary-foreground">What's this for?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your backup file contains the complete blueprint of your playlist, including all track IDs. While Spotify doesn't offer a direct "restore" feature, this file serves as a permanent record, allowing you or a future version of SpotBack to rebuild your playlists on any account.
                    </p>
                </div>
             </div>
             <div className="mt-6">
                <Button 
                    variant="default" 
                    size="lg"
                    onClick={() => { setBackupComplete(false); setSelectedPlaylists(new Set()); }}
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Start a New Backup
                </Button>
            </div>
           </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isSelected={selectedPlaylists.has(playlist.id)}
              onSelect={handleSelectPlaylist}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
