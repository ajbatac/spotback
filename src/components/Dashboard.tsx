'use client';
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useAuth } from '@/context/auth-context';
import { getPlaylists, type SpotifyPlaylist } from '@/lib/spotify';
import { Header } from '@/components/Header';
import { PlaylistCard } from '@/components/PlaylistCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import fileDownload from 'js-file-download';

export function Dashboard() {
  const { accessToken } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupComplete, setBackupComplete] = useState(false);
  const [backedUpPlaylists, setBackedUpPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchPlaylists = async () => {
      try {
        const userPlaylists = await getPlaylists(accessToken);
        setPlaylists(userPlaylists);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch playlists.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
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

  const jsonToXml = (json: object): string => {
    let xml = '';
    const convert = (obj: any, indent: string) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const tag = key.replace(/[^a-zA-Z0-9_]/g, '_'); // Basic sanitization for tag names

                if (value === null || value === undefined) {
                    xml += `${indent}<${tag}/>\n`;
                } else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            xml += `${indent}<${tag}>\n`;
                            convert(item, indent + '  ');
                            xml += `${indent}</${tag}>\n`;
                        });
                    } else {
                        xml += `${indent}<${tag}>\n`;
                        convert(value, indent + '  ');
                        xml += `${indent}</${tag}>\n`;
                    }
                } else {
                    const escapedValue = String(value)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&apos;');
                    xml += `${indent}<${tag}>${escapedValue}</${tag}>\n`;
                }
            }
        }
    };
    convert(json, '  ');
    return `<playlists>\n${xml}</playlists>`;
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

  const handleDownload = (format: 'json' | 'xml') => {
    if (format === 'json') {
      const dataToDownload = JSON.stringify(backedUpPlaylists, null, 2);
      fileDownload(dataToDownload, `spotify_backup_${new Date().toISOString()}.json`);
    } else if (format === 'xml') {
      const xmlData = jsonToXml({ playlist: backedUpPlaylists });
      fileDownload(xmlData, `spotify_backup_${new Date().toISOString()}.xml`);
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
                `Backup ${selectedPlaylists.size} Playlist(s) Now`
              )}
            </Button>
          )}
        </div>

        {backupComplete && (
           <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg mb-8 shadow-md">
             <h2 className="text-2xl font-semibold text-primary mb-3">Backup Complete!</h2>
             <p className="text-muted-foreground mb-4">Your selected playlists have been prepared for download.</p>
             <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleDownload('json')}>Download as .JSON</Button>
              <Button variant="outline" onClick={() => handleDownload('xml')}>Download as .XML</Button>
             </div>
             <Button variant="link" onClick={() => { setBackupComplete(false); setSelectedPlaylists(new Set()); }} className="mt-4 px-0">Start a new backup</Button>
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
    </div>
  );
}
