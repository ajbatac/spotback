
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { SpotifyPlaylist } from "@/types/spotify";
import { Music, Check } from "lucide-react";

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
}

export function PlaylistCard({ playlist, isSelected, onSelectionChange }: PlaylistCardProps) {
  const imageUrl = playlist.images?.[0]?.url;

  return (
    <div
      onClick={() => onSelectionChange(playlist.id)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg bg-card border transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-1",
         isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="p-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-md mb-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={playlist.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="music album"
            />
          ) : (
             <div className="flex h-full w-full items-center justify-center bg-muted rounded-md">
                <Music className="h-1/3 w-1/3 text-muted-foreground" />
             </div>
          )}
          <div className={cn("absolute inset-0 bg-gradient-to-t from-black/50 to-transparent", !imageUrl && "hidden")} />
        </div>
        
        <h3 className="font-bold truncate font-headline">{playlist.name}</h3>
        <p className="text-sm text-muted-foreground">{playlist.tracks.total} tracks</p>
      </div>

      <div 
        className={cn(
          "absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-md border-2 bg-background/70 backdrop-blur-sm transition-all duration-200",
          "shadow-sm group-hover:scale-110",
          isSelected ? "bg-primary border-primary-foreground text-primary-foreground" : "border-transparent"
        )}
      >
        <Checkbox
          id={`select-${playlist.id}`}
          checked={isSelected}
          onCheckedChange={() => onSelectionChange(playlist.id)}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          aria-label={`Select playlist ${playlist.name}`}
        />
        {isSelected && <Check className="h-4 w-4" />}
      </div>
    </div>
  );
}

    