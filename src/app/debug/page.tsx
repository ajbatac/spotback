
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function DebugPage() {
  const { accessToken, user, logout } = useAuth();
  const [configResponse, setConfigResponse] = useState('');
  const [isFetchingConfig, setIsFetchingConfig] = useState(false);
  const [configError, setConfigError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');
  const [loginConfigError, setLoginConfigError] = useState('');
  const [scopes, setScopes] = useState<string[]>([]);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This safely gates the rendering of components that depend on client-side state.
    setIsClient(true);
  }, []);

  const fetchConfig = async () => {
    setConfigResponse('');
    setConfigError('');
    setIsFetchingConfig(true);
    try {
      const res = await fetch('/api/config');
      const text = await res.text(); 
      setConfigResponse(text);
    } catch (e: any) {
      setConfigError(e.message || 'An unknown error occurred');
    } finally {
        setIsFetchingConfig(false);
    }
  };
  
  const generateLoginUrl = async () => {
    setLoginConfigError('');
    try {
      const response = await fetch('/api/config');
       if (!response.ok) {
          const config = await response.json();
          throw new Error(config.error || `Server responded with status: ${response.status}`);
        }
        const config = await response.json();
        if (config.error) {
          throw new Error(config.error);
        }
        const { appUrl, clientId } = config;

        const requestedScopes = [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-read-collaborative',
          'user-top-read',
        ];
        setScopes(requestedScopes);

        const constructedRedirectUri = `${appUrl}/api/auth/callback/spotify`;
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('scope', requestedScopes.join(' '));
        authUrl.searchParams.append('redirect_uri', constructedRedirectUri);
        setSpotifyAuthUrl(authUrl.toString());
    } catch (e: any) {
      setLoginConfigError(e.message || 'Failed to generate login URL.');
    }
  };


  useEffect(() => {
    fetchConfig();
    if (!accessToken) {
      generateLoginUrl();
    }
  }, [accessToken]);

  return (
    <div className="container mx-auto p-8 font-mono bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Application Debug Console</h1>

        {/* Environment Variables Section */}
        <section className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Client-Side Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXT_PUBLIC_APP_URL:</strong> <span className="text-blue-600 break-all">{process.env.NEXT_PUBLIC_APP_URL || 'Not Set'}</span></p>
            <p><strong>NEXT_PUBLIC_SPOTIFY_CLIENT_ID:</strong> <span className="text-blue-600">{process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'Not Set'}</span></p>
            <p><strong>NEXT_PUBLIC_GA_MEASUREMENT_ID:</strong> <span className="text-blue-600">{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'Not Set'}</span></p>
          </div>
        </section>

        {/* Authentication Context Section */}
        <section className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Authentication Context</h2>
          {isClient ? (
            <div className="space-y-2 text-sm">
              <p><strong>Access Token:</strong> <span className="text-green-600 break-all">{accessToken || 'Not Set'}</span></p>
              <div>
                <strong>User Object:</strong>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {user ? JSON.stringify(user, null, 2) : 'null'}
                </pre>
              </div>
              {accessToken ? (
                <Button variant="destructive" size="sm" onClick={logout} className="mt-2">Logout</Button>
              ) : (
                 <div className="mt-2 space-y-4">
                  {loginConfigError ? (
                      <div className="text-red-500 bg-red-100 p-2 rounded-md text-xs">
                          <p className="font-bold">Could not generate login URL:</p>
                          <p>{loginConfigError}</p>
                      </div>
                  ) : spotifyAuthUrl ? (
                      <Button size="sm" asChild>
                          <a href={spotifyAuthUrl}>
                              <LogIn className="mr-2 h-4 w-4" />
                              Login with Spotify
                          </a>
                      </Button>
                  ) : (
                      <Button size="sm" disabled>Loading Login...</Button>
                  )}
                 </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading auth state...</p>
          )}
        </section>

        {/* Login URL Details Section */}
        <section className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Spotify Login URL Details</h2>
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-semibold text-gray-600">Requested Scopes:</h3>
              {scopes.length > 0 ? (
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {scopes.map(scope => <li key={scope}><code className="bg-gray-100 p-1 rounded text-blue-700">{scope}</code></li>)}
                </ul>
              ) : (
                <p className="text-muted-foreground">No scopes generated yet...</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Constructed Auth URL:</h3>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs break-all overflow-auto">
                {spotifyAuthUrl || 'No URL generated yet...'}
              </pre>
            </div>
          </div>
        </section>


        {/* API Response Section */}
        <section className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-700">/api/config Raw Response</h2>
            <Button onClick={fetchConfig} disabled={isFetchingConfig} size="sm">
                {isFetchingConfig ? 'Fetching...' : 'Re-fetch Config'}
            </Button>
          </div>
          {configError && <div className="p-2 bg-red-100 text-red-700 rounded text-sm"><strong>Error:</strong> {configError}</div>}
          <pre className="mt-1 p-3 bg-gray-800 text-white rounded text-xs overflow-auto">
            {configResponse || 'No response yet...'}
          </pre>
        </section>
      </div>
    </div>
  );
}
