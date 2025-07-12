import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}