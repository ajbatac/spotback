import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpotBack',
  description: 'Backup Your Spotify Playlist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}