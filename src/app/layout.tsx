
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SpotBack - Backup Your Spotify Playlist',
  description: 'Organize and backup your Spotify playlists with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <AuthProvider>
          <div className="flex-grow">
            {children}
          </div>
        </AuthProvider>
        <Toaster />
        <footer className="text-center p-4 text-sm text-muted-foreground">
          Created with ❤️ by AJ Batac (<a href="https://www.instagram.com/ajbatac" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">@ajbatac</a>) - 
          <Link href="/changelog" className="underline hover:text-primary">
            v1.0.0
          </Link>
        </footer>
      </body>
    </html>
  );
}
