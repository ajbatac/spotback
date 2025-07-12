import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import './globals.css';
import { cn } from '@/lib/utils';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Suspense } from 'react';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
const title = 'SpotBack - The Easiest Way to Backup Your Spotify Playlists';
const description = 'Never lose your curated music again. SpotBack allows you to securely connect to Spotify and export your playlists to JSON, XML, or TXT in just a few clicks.';
const imageUrl = `${appUrl}/spotify.png`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | SpotBack`,
  },
  description: description,
  keywords: ['Spotify', 'backup', 'playlist', 'export', 'music', 'downloader', 'archive'],
  openGraph: {
    title: title,
    description: description,
    url: appUrl,
    siteName: 'SpotBack',
    images: [
      {
        url: imageUrl,
        width: 64,
        height: 64,
        alt: 'SpotBack Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: title,
    description: description,
    images: [imageUrl],
  },
  metadataBase: new URL(appUrl),
};


const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background font-sans antialiased',
          ptSans.variable
        )}
      >
        {gaMeasurementId && (
            <Suspense>
                <GoogleAnalytics ga_id={gaMeasurementId} />
            </Suspense>
        )}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
