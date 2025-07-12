
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const { accessToken, user, logout } = useAuth();
  const [configResponse, setConfigResponse] = useState('');
  const [isFetchingConfig, setIsFetchingConfig] = useState(false);
  const [configError, setConfigError] = useState('');

  const fetchConfig = async () => {
    setConfigResponse('');
    setConfigError('');
    setIsFetchingConfig(true);
    try {
      const res = await fetch('/api/config');
      // IMPORTANT: We fetch as raw text to see exactly what the server sends,
      // avoiding the JSON parsing error we're trying to debug.
      const text = await res.text(); 
      setConfigResponse(text);
    } catch (e: any) {
      setConfigError(e.message || 'An unknown error occurred');
    } finally {
        setIsFetchingConfig(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

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
          <div className="space-y-2 text-sm">
            <p><strong>Access Token:</strong> <span className="text-green-600 break-all">{accessToken || 'Not Set'}</span></p>
            <div>
              <strong>User Object:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {user ? JSON.stringify(user, null, 2) : 'null'}
              </pre>
            </div>
            {accessToken && <Button variant="destructive" size="sm" onClick={logout} className="mt-2">Logout</Button>}
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
