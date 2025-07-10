
"use client";

import Image from "next/image";
import type { SpotifyArtist } from "@/types/spotify";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface TopArtistCardProps {
  artist: SpotifyArtist;
}

export function TopArtistCard({ artist }: TopArtistCardProps) {
  const imageUrl = artist.images?.[0]?.url;

  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-card border transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="artist portrait"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <User className="h-1/3 w-1/3 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="font-bold text-white drop-shadow-md truncate">{artist.name}</h3>
      </div>
    </a>
  );
}

    