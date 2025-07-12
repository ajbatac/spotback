import type { Playlist, User } from 'spotify-api';

// Re-exporting the official types with a more friendly name for use in the app
export type { Playlist as SpotifyPlaylist, User as SpotifyUser };

// A generic fetch wrapper to handle Spotify API calls, authentication, and error handling.
async function spotifyFetch(url: string, accessToken: string) {
    const response = await fetch(url, {
        headers: {
            // Ensure the Authorization header is formatted exactly as "Bearer <token>"
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        // If the response is not OK, try to parse the error JSON from Spotify
        try {
            const error = await response.json();
            // Construct a detailed error message from the Spotify API response
            const message = error.error?.message || `Spotify API Error: ${response.status} ${response.statusText}`;
            throw new Error(message);
        } catch (e) {
            // If parsing the error JSON fails, throw a generic error
            throw new Error(`Spotify API Error: ${response.status} ${response.statusText}. The response was not valid JSON.`);
        }
    }

    // If the response is OK, return the JSON data
    return await response.json();
}


async function fetchAllPages<T>(initialUrl: string, accessToken: string): Promise<T[]> {
    let items: T[] = [];
    let nextUrl: string | null = initialUrl;

    while(nextUrl) {
        const data = await spotifyFetch(nextUrl, accessToken);
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
    const url = 'https://api.spotify.com/v1/me';
    return await spotifyFetch(url, accessToken);
}
