
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { KeyRound, LogIn, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function CredentialsPage() {
  const router = useRouter();
  const { setCredentials } = useAuth();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId && clientSecret) {
      setCredentials({ clientId, clientSecret });
      router.push('/'); // Redirect to the main page to start the login process
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center space-y-6 max-w-lg mx-auto">
          <Image
            src="/spotify.png"
            alt="SpotBack Logo"
            width={64}
            height={64}
            data-ai-hint="logo"
          />
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Use Your Own Keys
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your personal Spotify Developer Client ID and Secret to use SpotBack with your own API quota.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Spotify Client ID</label>
              <input
                type="text"
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your Client ID"
                required
              />
            </div>
            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">Spotify Client Secret</label>
              <input
                type="password"
                id="clientSecret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your Client Secret"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              <LogIn className="mr-2 h-5 w-5" />
              Save Keys & Login
            </Button>
          </form>

           <div className="pt-6 text-left border-t border-gray-200 mt-6 w-full">
             <h2 className="text-xl font-bold text-gray-800 text-center mb-3 flex items-center justify-center gap-2">
                <HelpCircle className="h-5 w-5"/>
                Why is this needed?
            </h2>
            <p className="text-muted-foreground text-sm">
              Spotify no longer allows new apps to be made public for individual developers. To use this tool, you must create your own "app" in the Spotify Developer Dashboard to get your own API keys.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              This ensures all data access is explicitly approved by you, for you. Your keys are stored securely in your browser session and are never saved on our server.
            </p>
            <div className="text-center mt-4">
                <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                    Go to Spotify Developer Dashboard &rarr;
                </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
