export interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks: {
        total: number;
    };
    owner: {
        display_name: string;
    }
}

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

export async function getPlaylists(accessToken: string): Promise<Playlist[]> {
    const initialUrl = 'https://api.spotify.com/v1/me/playlists?limit=50';
    return await fetchAllPages<Playlist>(initialUrl, accessToken);
}
