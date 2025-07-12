'use client';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { SpotifyPlaylist } from '@/lib/spotify';
import { cn } from '@/lib/utils';
import { Music2 } from 'lucide-react';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  isSelected: boolean;
  onSelect: (playlistId: string, isSelected: boolean) => void;
}

export function PlaylistCard({ playlist, isSelected, onSelect }: PlaylistCardProps) {
  const imageUrl = playlist.images?.[0]?.url;

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden group border-2 transition-all duration-300 cursor-pointer",
        isSelected ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"
      )}
      onClick={() => onSelect(playlist.id, !isSelected)}
    >
      <div className="absolute top-2 right-2 z-20 bg-background/50 backdrop-blur-sm rounded-full p-1">
         <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(playlist.id, !!checked)}
            className="h-5 w-5"
            aria-label={`Select ${playlist.name}`}
        />
      </div>

      <div className="aspect-square w-full relative">
        {imageUrl ? (
            <Image
            src={imageUrl}
            alt={`Cover for ${playlist.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="playlist cover"
            />
        ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
                <Music2 className="w-1/2 h-1/2 text-muted-foreground/50"/>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="font-bold text-white truncate" title={playlist.name}>
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-300 truncate">
          {playlist.owner.display_name} &bull; {playlist.tracks.total} tracks
        </p>
      </div>
    </div>
  );
}
