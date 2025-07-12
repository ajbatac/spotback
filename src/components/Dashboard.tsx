'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getPlaylists, getUserProfile } from '@/lib/spotify';
import type { SpotifyPlaylist, SpotifyUser } from '@/lib/spotify';
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
  AlertTriangle,
} from 'lucide-react';
import fileDownload from 'js-file-download';
import { Footer } from './Footer';
import { jsonToXml } from '@/lib/utils';

interface DebugInfo {
  user: string;
  token: string;
  call: string;
  output: string;
  url: string;
}

export function Dashboard() {
  const { accessToken, user, setUser, logout } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupComplete, setBackupComplete] = useState(false);
  const [backedUpPlaylists, setBackedUpPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const initialDebugState: DebugInfo = {
          user: JSON.stringify(user, null, 2),
          token: accessToken,
          call: 'Attempting to fetch user profile and playlists...',
          output: 'Pending...',
          url: window.location.href
      };
      setDebugInfo(initialDebugState);

      try {
        setDebugInfo(prev => ({...prev!, call: 'https://api.spotify.com/v1/me'}));
        const userProfile = await getUserProfile(accessToken);
        setUser(userProfile);
        
        setDebugInfo(prev => ({...prev!, call: 'https://api.spotify.com/v1/me/playlists', output: `User Profile OK: ${JSON.stringify(userProfile, null, 2)}`}));
        const userPlaylists = await getPlaylists(accessToken);
        setPlaylists(userPlaylists);
        
        setDebugInfo(prev => ({...prev!, output: `Playlists OK: ${userPlaylists.length} found.`}));

      } catch (err: any) {
        console.error("Failed to fetch data from Spotify:", err);
        const errorMessage = err.message || 'Failed to fetch your data from Spotify. The API might be temporarily down, or your session may have expired.';
        setError(errorMessage);
        setDebugInfo(prev => ({...prev!, output: `ERROR: ${errorMessage}`}));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

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
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {debugInfo && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 font-mono text-xs" role="alert">
                <h3 className="font-bold text-base mb-2">DEBUG OUTPUT</h3>
                <p><strong className="w-20 inline-block">URL</strong>: <span className="break-all">{debugInfo.url}</span></p>
                <p><strong className="w-20 inline-block">User</strong>: <pre className="inline-block bg-yellow-200 p-1 rounded mt-1">{debugInfo.user}</pre></p>
                <p><strong className="w-20 inline-block">Token</strong>: <span className="break-all">{debugInfo.token}</span></p>
                <p><strong className="w-20 inline-block">Call</strong>: <span>{debugInfo.call}</span></p>
                <p><strong className="w-20 inline-block">OUTPUT</strong>: <pre className="whitespace-pre-wrap break-all bg-yellow-200 p-1 rounded mt-1">{debugInfo.output}</pre></p>
            </div>
        )}

        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading your playlists...</p>
            </div>
        )}
        
        {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-8 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold">Failed to load playlists</h3>
                <p className="text-sm">{error}</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-destructive" onClick={logout}>Click here to log out and try again.</Button>
              </div>
            </div>
        )}
      
        {!error && !isLoading && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="select-all" 
                    onCheckedChange={handleSelectAll}
                    checked={playlists.length > 0 && (selectedPlaylists.size === playlists.length ? true : selectedPlaylists.size === 0 ? false : 'indeterminate')}
                    disabled={playlists.length === 0}
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
                      Backing up...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      {`Backup ${selectedPlaylists.size} Playlist(s)`}
                    </>
                  )}
                </Button>
              )}
            </div>

            {backupComplete && (
              <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg mb-8 shadow-md text-center">
                <h2 className="text-2xl font-semibold text-primary mb-3">Backup Complete!</h2>
                <p className="text-muted-foreground mb-4">Your selected playlists are ready for download.</p>
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
                            Your backup file contains the complete blueprint of your playlist. While Spotify doesn't offer a direct "restore" feature, this file is a permanent record, allowing you to rebuild your playlists on any account.
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
            
            {playlists.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No playlists found. Time to create some music!</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
