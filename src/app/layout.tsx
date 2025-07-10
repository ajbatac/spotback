
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import Script from 'next/script';

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
      <body className="bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <Script
          strategy="lazyOnload"
          src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
          data-name="bmc-button"
          data-slug="emailsig"
          data-color="#FFDD00"
          data-emoji="🍕"
          data-font="Cookie"
          data-text="Buy me a pizza?"
          data-outline-color="#000000"
          data-font-color="#000000"
          data-coffee-color="#ffffff"
        />
      </body>
    </html>
  );
}
