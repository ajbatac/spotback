
"use server";
import type { SpotifyPlaylist, SpotifyTrack, Paged, SpotifyUserProfile } from '@/types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

class SpotifyApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'SpotifyApiError';
  }
}

async function fetchSpotify<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Spotify API request failed with status ${response.status}`;
    throw new SpotifyApiError(message, response.status);
  }
  // Handle cases where response is empty
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getUserProfile(token: string): Promise<SpotifyUserProfile> {
    return fetchSpotify<SpotifyUserProfile>(`${SPOTIFY_API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export async function getPlaylistsForUser(userId: string, token: string): Promise<SpotifyPlaylist[]> {
    let playlists: SpotifyPlaylist[] = [];
    let url: string | null = `${SPOTIFY_API_BASE}/users/${userId}/playlists?limit=50`;

    while(url) {
        const data: Paged<SpotifyPlaylist> = await fetchSpotify(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (data && data.items) {
          playlists = playlists.concat(data.items);
          url = data.next;
        } else {
          url = null;
        }
    }
    return playlists;
}

export async function getPlaylistWithAllTracks(playlistId: string, token: string): Promise<SpotifyPlaylist> {
    const playlistInfo: SpotifyPlaylist = await fetchSpotify(`${SPOTIFY_API_BASE}/playlists/${playlistId}?fields=id,name,description,images,tracks.total`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    let tracks: { track: SpotifyTrack }[] = [];
    let url: string | null = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?fields=items(track(id,name,artists(name),album(name))),next&limit=100`;
    
    while(url) {
        const data: Paged<{ track: SpotifyTrack }> = await fetchSpotify(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (data && data.items) {
          tracks = tracks.concat(data.items.filter(item => item.track)); // Filter out null tracks if any
          url = data.next;
        } else {
          url = null;
        }
    }

    playlistInfo.tracks = { ...playlistInfo.tracks, items: tracks, total: tracks.length };
    return playlistInfo;
}
