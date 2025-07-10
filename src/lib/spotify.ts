
"use server";
import type { SpotifyPlaylist, SpotifyTrack, Paged, SpotifyUserProfile, SpotifyArtist } from '@/types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

class SpotifyApiError extends Error {
  constructor(message: string, public status: number, public retryAfter: number | null = null) {
    super(message);
    this.name = 'SpotifyApiError';
  }
}

async function fetchSpotify<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Spotify API request failed with status ${response.status}`;
    const retryAfterHeader = response.headers.get('Retry-After');
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;
    throw new SpotifyApiError(message, response.status, retryAfter);
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
    // Fetch the full playlist object first.
    // The `fields` parameter can be used to control the response size, but for official format we want everything.
    const playlistInfo: SpotifyPlaylist = await fetchSpotify(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    let tracks: { track: SpotifyTrack }[] = [];
    // Start with the initial track list from the playlist object
    if (playlistInfo.tracks && playlistInfo.tracks.items) {
        tracks = tracks.concat(playlistInfo.tracks.items.filter(item => item && item.track));
    }
    
    let url: string | null = playlistInfo.tracks.next;
    
    // Paginate through the rest of the tracks if they exist
    while(url) {
        const data: Paged<{ track: SpotifyTrack }> = await fetchSpotify(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (data && data.items) {
          tracks = tracks.concat(data.items.filter(item => item && item.track)); // Filter out null tracks if any
          url = data.next;
        } else {
          url = null;
        }
    }

    // Replace the original paginated track list with the full one.
    playlistInfo.tracks.items = tracks;
    playlistInfo.tracks.total = tracks.length;
    // We set `next` to null because we have fetched all pages.
    playlistInfo.tracks.next = null; 

    return playlistInfo;
}

export async function getTopArtists(token: string, limit: number = 5): Promise<SpotifyArtist[]> {
    const data = await fetchSpotify<Paged<SpotifyArtist>>(`${SPOTIFY_API_BASE}/me/top/artists?limit=${limit}&time_range=long_term`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return data.items;
}
