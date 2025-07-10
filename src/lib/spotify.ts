
"use server";
import type { SpotifyPlaylist, SpotifyTrack, Paged } from '@/types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com/api';

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
  return response.json();
}

export async function getAccessToken(): Promise<string> {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Spotify API credentials are not set in the environment variables.');
    }

    const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: 'grant_type=client_credentials',
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Failed to authenticate with Spotify');
    }

    const data = await response.json();
    return data.access_token;
}

export async function getPlaylistsForUser(userId: string, token: string): Promise<SpotifyPlaylist[]> {
    let playlists: SpotifyPlaylist[] = [];
    let url: string | null = `${SPOTIFY_API_BASE}/users/${userId}/playlists?limit=50`;

    while(url) {
        const data: Paged<SpotifyPlaylist> = await fetchSpotify(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        playlists = playlists.concat(data.items);
        url = data.next;
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
        tracks = tracks.concat(data.items.filter(item => item.track)); // Filter out null tracks if any
        url = data.next;
    }

    playlistInfo.tracks = { items: tracks, total: tracks.length };
    return playlistInfo;
}

    