import type { Playlist, User } from 'spotify-api';

// Re-exporting the official types with a more friendly name for use in the app
export type { Playlist as SpotifyPlaylist, User as SpotifyUser };

async function fetchAllPages<T>(initialUrl: string, accessToken: string): Promise<T[]> {
    let items: T[] = [];
    let nextUrl: string | null = initialUrl;

    while(nextUrl) {
        const response = await fetch(nextUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Spotify API Error: ${error.error.message || response.statusText}`);
        }
        
        const data = await response.json();
        items = items.concat(data.items);
        nextUrl = data.next;
    }
    
    return items;
}

export async function getPlaylists(accessToken: string): Promise<SpotifyPlaylist[]> {
    const initialUrl = 'https://api.spotify.com/v1/me/playlists?limit=50';
    // The spotify-api type for /me/playlists is PagingObject<PlaylistObjectSimplified>
    // so we cast to SpotifyPlaylist which is compatible for our use case.
    return await fetchAllPages<SpotifyPlaylist>(initialUrl, accessToken);
}

export async function getUserProfile(accessToken: string): Promise<SpotifyUser> {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Spotify API Error: ${error.error.message || response.statusText}`);
    }

    return await response.json();
}
