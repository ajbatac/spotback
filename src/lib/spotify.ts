import type { Playlist, User } from 'spotify-api';

// Re-exporting the official types with a more friendly name for use in the app
export type { Playlist as SpotifyPlaylist, User as SpotifyUser };

// A generic fetch wrapper to handle Spotify API calls, authentication, and detailed error handling.
async function spotifyFetch(url: string, accessToken: string) {
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        // If the response is not OK, try to extract a detailed error message.
        let errorMessage;
        try {
            // First, try to parse the error as JSON, which is the expected format.
            const error = await response.json();
            errorMessage = error.error?.message || `Spotify API Error: ${response.status} ${response.statusText}`;
        } catch (e) {
            // If parsing as JSON fails, it's likely an HTML error page. Read it as text.
            const errorText = await response.text();
            // Create a more informative error message from the HTML body if possible.
            const titleMatch = errorText.match(/<title>(.*?)<\/title>/i);
            const bodyMatch = errorText.match(/<div id="message">(.*?)<\/div>/i);
            if (titleMatch && bodyMatch) {
              errorMessage = `Spotify returned an HTML error page: ${titleMatch[1]} - ${bodyMatch[1]}`;
            } else {
              errorMessage = `Spotify API Error: ${response.status} ${response.statusText}. The response was not valid JSON.`;
            }
        }
        throw new Error(errorMessage);
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
