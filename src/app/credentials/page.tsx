
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { KeyRound, LogIn, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function CredentialsPage() {
  const router = useRouter();
  const { setCredentials } = useAuth();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (appUrl) {
        try {
            const callbackUrl = new URL('/api/auth/callback/spotify', appUrl);
            setRedirectUri(callbackUrl.toString());
        } catch (e) {
            console.error("Invalid NEXT_PUBLIC_APP_URL", e);
            setRedirectUri("Error: Invalid App URL configured.")
        }
    }
  }, []);

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
          <Link href="/">
            <Image
              src="/spotify.png"
              alt="SpotBack Logo"
              width={64}
              height={64}
              data-ai-hint="logo"
            />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Enter Your API Keys
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide your personal Spotify Developer keys to begin.
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
                How to get your API Keys
            </h2>
            <p className="text-muted-foreground text-sm">
              Due to Spotify's developer policy, you must use your own API keys. This ensures all data access is explicitly approved by you, for you. Your keys are stored securely in your browser and are never saved on our server.
            </p>
            <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-2 mt-3">
                <li>Go to the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Spotify Developer Dashboard</a> and log in.</li>
                <li>Click "Create App" and give it a name and description.</li>
                <li>Once created, you will see your <strong>Client ID</strong> and <strong>Client Secret</strong>. Copy them into the form above.</li>
                <li>Go to "App Settings" and add this exact "Redirect URI":
                    <div className="p-2 my-1 bg-gray-100 rounded-md font-mono text-xs break-all">
                       {isClient ? <strong>{redirectUri}</strong> : 'Loading...'}
                    </div>
                </li>
                <li>Finally, go to the "Users and Access" tab and add the email address of your Spotify account to the list of users. This is required for apps in Development Mode.</li>
            </ol>
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
